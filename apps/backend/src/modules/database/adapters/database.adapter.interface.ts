import { DatabaseConnection } from '../../entities/database-connection.entity';

export interface IDatabaseAdapter {
  /**
   * 创建数据库连接
   */
  createConnection(connection: DatabaseConnection): Promise<any>;

  /**
   * 获取所有表
   */
  getTables(connection: any, databaseName: string): Promise<any[]>;

  /**
   * 获取表结构
   */
  getTableSchema(connection: any, databaseName: string, tableName: string): Promise<any>;

  /**
   * 关闭连接
   */
  closeConnection(connection: any): Promise<void>;

  /**
   * 测试连接
   */
  testConnection(connection: DatabaseConnection): Promise<{ success: boolean; message: string }>;
}
