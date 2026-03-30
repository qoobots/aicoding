import { Injectable, Logger } from '@nestjs/common';
import { DatabaseConnection } from '../../entities/database-connection.entity';
import { IDatabaseAdapter } from './database.adapter.interface';
import * as mysql from 'mysql2/promise';

@Injectable()
export class MySQLAdapter implements IDatabaseAdapter {
  private readonly logger = new Logger(MySQLAdapter.name);

  async createConnection(connection: DatabaseConnection): Promise<any> {
    this.logger.log(`Creating MySQL connection to ${connection.host}:${connection.port}`);
    const config = {
      host: connection.host,
      port: connection.port,
      user: connection.username,
      password: connection.password,
      database: connection.database,
    };
    this.logger.log(`Connection config: ${JSON.stringify({ ...config, password: '***' })}`);
    return await mysql.createConnection(config);
  }

  async getTables(connection: any, databaseName: string): Promise<any[]> {
    const [rows] = (await connection.query(
      `
      SELECT
        TABLE_NAME as tableName,
        TABLE_COMMENT as tableComment
      FROM INFORMATION_SCHEMA.TABLES
      WHERE TABLE_SCHEMA = ?
      ORDER BY TABLE_NAME
    `,
      [databaseName]
    )) as any[];
    return rows;
  }

  async getTableSchema(connection: any, databaseName: string, tableName: string): Promise<any> {
    // 获取表注释
    const [tableInfo] = (await connection.query(
      `
      SELECT TABLE_COMMENT as tableComment
      FROM INFORMATION_SCHEMA.TABLES
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?
    `,
      [databaseName, tableName]
    )) as any[];

    // 获取列信息
    const [columns] = (await connection.query(
      `
      SELECT
        COLUMN_NAME as columnName,
        COLUMN_COMMENT as columnComment,
        COLUMN_TYPE as columnType,
        DATA_TYPE as dataType,
        CHARACTER_MAXIMUM_LENGTH as columnLength,
        IS_NULLABLE as isNullable,
        COLUMN_KEY as columnKey,
        COLUMN_DEFAULT as defaultValue,
        EXTRA as extra
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?
      ORDER BY ORDINAL_POSITION
    `,
      [databaseName, tableName]
    )) as any[];

    return {
      tableName,
      tableComment: tableInfo[0]?.tableComment || '',
      columns: columns.map((col: any) => ({
        columnName: col.columnName,
        columnComment: col.columnComment || '',
        columnType: col.columnType,
        dataType: col.dataType,
        columnLength: col.columnLength,
        isNullable: col.isNullable === 'YES',
        isPrimaryKey: col.columnKey === 'PRI',
        defaultValue: col.defaultValue,
        extra: col.extra,
      })),
    };
  }

  async closeConnection(connection: any): Promise<void> {
    await connection.end();
  }

  async testConnection(
    connection: DatabaseConnection
  ): Promise<{ success: boolean; message: string }> {
    const conn = await this.createConnection(connection);
    await conn.ping();
    await conn.end();
    return { success: true, message: '连接成功' };
  }
}
