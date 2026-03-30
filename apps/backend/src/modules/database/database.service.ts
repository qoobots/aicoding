import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DatabaseConnection } from '../../entities/database-connection.entity';
import { CreateDatabaseConnectionDto, UpdateDatabaseConnectionDto } from './dto/database.dto';
import { DatabaseAdapterFactory } from './adapters/database-adapter-factory';
import { ConnectionHealthCheck, ConnectionStatus } from './dto/connection-status.dto';
import { DatabaseErrorHandler } from './utils/database-error-handler.util';

@Injectable()
export class DatabaseService {
  private readonly logger = new Logger(DatabaseService.name);
  private readonly healthCache = new Map<string, ConnectionHealthCheck>();
  private readonly HEALTH_CACHE_TTL = 60000; // 健康检查缓存1分钟

  constructor(
    @InjectRepository(DatabaseConnection)
    private databaseConnectionRepository: Repository<DatabaseConnection>,
    private readonly adapterFactory: DatabaseAdapterFactory
  ) {}

  // 获取所有数据库连接
  async findAll(): Promise<DatabaseConnection[]> {
    return await this.databaseConnectionRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  // 根据ID获取数据库连接
  async findOne(id: string): Promise<DatabaseConnection> {
    const connection = await this.databaseConnectionRepository.findOne({ where: { id } });
    if (!connection) {
      throw new NotFoundException(`Database connection with ID ${id} not found`);
    }
    return connection;
  }

  // 创建数据库连接
  async create(createDto: CreateDatabaseConnectionDto): Promise<DatabaseConnection> {
    this.logger.log(`Creating database connection with type: ${createDto.type}`);
    const connection = this.databaseConnectionRepository.create(createDto);
    this.logger.log(`Connection object created: ${JSON.stringify(connection)}`);
    const saved = await this.databaseConnectionRepository.save(connection);
    this.logger.log(`Connection saved with ID: ${saved.id}`);
    return saved;
  }

  // 更新数据库连接
  async update(id: string, updateDto: UpdateDatabaseConnectionDto): Promise<DatabaseConnection> {
    const connection = await this.findOne(id);
    Object.assign(connection, updateDto);
    return await this.databaseConnectionRepository.save(connection);
  }

  // 删除数据库连接
  async remove(id: string): Promise<void> {
    const connection = await this.findOne(id);
    await this.databaseConnectionRepository.remove(connection);
  }

  // 测试数据库连接
  async testConnection(connectionId: string): Promise<{ success: boolean; message: string }> {
    const startTime = Date.now();
    try {
      const connection = await this.findOne(connectionId);
      const adapter = this.adapterFactory.getAdapter(connection);
      const result = await adapter.testConnection(connection);

      const responseTime = Date.now() - startTime;

      // 缓存健康检查结果
      this.healthCache.set(connectionId, {
        status: result.success ? ConnectionStatus.ACTIVE : ConnectionStatus.ERROR,
        message: result.message,
        lastChecked: new Date(),
        responseTime,
      });

      // 更新连接状态
      await this.databaseConnectionRepository.update(connectionId, {
        status: result.success ? 'active' : 'inactive',
      });

      return result;
    } catch (error: any) {
      const responseTime = Date.now() - startTime;

      this.logger.error(`Test connection failed: ${error.message}`, error.stack);

      // 使用错误处理器解析错误
      const userMessage = DatabaseErrorHandler.parseError(error);

      // 缓存错误结果
      this.healthCache.set(connectionId, {
        status: ConnectionStatus.ERROR,
        message: userMessage,
        lastChecked: new Date(),
        responseTime,
      });

      // 更新连接状态
      await this.databaseConnectionRepository.update(connectionId, {
        status: 'inactive',
      });

      return { success: false, message: userMessage };
    }
  }

  // 获取连接健康状态
  async getHealthStatus(connectionId: string): Promise<ConnectionHealthCheck> {
    // 检查缓存
    const cached = this.healthCache.get(connectionId);
    if (cached && Date.now() - cached.lastChecked.getTime() < this.HEALTH_CACHE_TTL) {
      return cached;
    }

    // 执行新的健康检查
    const testResult = await this.testConnection(connectionId);
    const current = this.healthCache.get(connectionId);
    return current!;
  }

  // 获取数据库所有表
  async getTables(connectionId: string): Promise<any[]> {
    let conn: any = null;
    try {
      this.logger.log(`Getting tables for connection ID: ${connectionId}`);
      const connection = await this.findOne(connectionId);

      this.logger.log(`Connection details:`);
      this.logger.log(`  - Type: ${connection.type} (${typeof connection.type})`);
      this.logger.log(`  - Host: ${connection.host}`);
      this.logger.log(`  - Port: ${connection.port}`);
      this.logger.log(`  - Database: ${connection.database}`);
      this.logger.log(`  - User: ${connection.username}`);

      const adapter = this.adapterFactory.getAdapter(connection);
      this.logger.log(`Adapter created successfully: ${adapter.constructor.name}`);

      conn = await adapter.createConnection(connection);
      this.logger.log('Database connection created');

      this.logger.log('Querying table list...');
      const tables = await adapter.getTables(conn, connection.database);

      await adapter.closeConnection(conn);
      this.logger.log(`Found ${tables.length} tables`);
      return tables;
    } catch (error: any) {
      this.logger.error(`Failed to get tables: ${error.message}`, error.stack);
      if (error.code) {
        this.logger.error(`Database Error Code: ${error.code}`);
      }
      if (error.errno) {
        this.logger.error(`Database Error Number: ${error.errno}`);
      }
      if (error.sql) {
        this.logger.error(`SQL: ${error.sql}`);
      }
      if (conn) {
        try {
          // 尝试使用适配器关闭连接
          const connection = await this.findOne(connectionId);
          const adapter = this.adapterFactory.getAdapter(connection);
          await adapter.closeConnection(conn);
        } catch (e) {
          this.logger.error('Failed to close connection:', e);
        }
      }
      const userMessage = DatabaseErrorHandler.parseError(error);
      throw new Error(`获取表列表失败: ${userMessage}`);
    }
  }

  // 获取表结构
  async getTableSchema(connectionId: string, tableName: string): Promise<any> {
    let conn: any = null;
    try {
      const connection = await this.findOne(connectionId);
      const adapter = this.adapterFactory.getAdapter(connection);

      conn = await adapter.createConnection(connection);
      const schema = await adapter.getTableSchema(conn, connection.database, tableName);

      await adapter.closeConnection(conn);
      return schema;
    } catch (error: any) {
      this.logger.error(`Failed to get table schema: ${error.message}`, error.stack);
      if (conn) {
        try {
          const connection = await this.findOne(connectionId);
          const adapter = this.adapterFactory.getAdapter(connection);
          await adapter.closeConnection(conn);
        } catch (e) {
          this.logger.error('Failed to close connection:', e);
        }
      }
      const userMessage = DatabaseErrorHandler.parseError(error);
      throw new Error(`获取表结构失败: ${userMessage}`);
    }
  }
}
