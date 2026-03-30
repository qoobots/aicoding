import { Injectable, Logger } from '@nestjs/common';
import { IDatabaseAdapter } from './database.adapter.interface';
import { MySQLAdapter } from './mysql.adapter';
import { PostgreSQLAdapter } from './postgresql.adapter';
import { OracleAdapter } from './oracle.adapter';
import { DatabaseConnection } from '../../entities/database-connection.entity';

@Injectable()
export class DatabaseAdapterFactory {
  private readonly logger = new Logger(DatabaseAdapterFactory.name);

  constructor(
    private readonly mysqlAdapter: MySQLAdapter,
    private readonly postgresAdapter: PostgreSQLAdapter,
    private readonly oracleAdapter: OracleAdapter
  ) {}

  getAdapter(connection: DatabaseConnection): IDatabaseAdapter {
    this.logger.log(`Creating adapter for database type: ${connection.type}`);

    switch (connection.type) {
      case 'mysql':
        return this.mysqlAdapter;
      case 'postgresql':
        return this.postgresAdapter;
      case 'oracle':
        return this.oracleAdapter;
      case 'sqlserver':
        this.logger.warn(
          'SQL Server adapter not yet implemented, falling back to PostgreSQL adapter'
        );
        return this.postgresAdapter;
      default:
        throw new Error(`Unsupported database type: ${connection.type}`);
    }
  }
}
