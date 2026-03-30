import { Injectable, Logger } from '@nestjs/common';
import { DatabaseConnection } from '../../entities/database-connection.entity';
import { IDatabaseAdapter } from './database.adapter.interface';

@Injectable()
export class OracleAdapter implements IDatabaseAdapter {
  private readonly logger = new Logger(OracleAdapter.name);

  async createConnection(connection: DatabaseConnection): Promise<any> {
    // Oracle 需要安装 oracledb 客户端库
    // 这里返回一个占位符，实际使用需要安装 oracledb 包
    throw new Error('Oracle 数据库支持需要安装 oracledb 包。请运行: pnpm add oracledb');
  }

  async getTables(connection: any, databaseName: string): Promise<any[]> {
    // Oracle 表查询
    const query = `
      SELECT
        TABLE_NAME as tableName,
        COMMENTS as tableComment
      FROM USER_TAB_COMMENTS
      ORDER BY TABLE_NAME
    `;
    // 实际实现需要 oracledb 连接
    throw new Error('Oracle 数据库支持需要安装 oracledb 包');
  }

  async getTableSchema(connection: any, databaseName: string, tableName: string): Promise<any> {
    // Oracle 表结构查询
    throw new Error('Oracle 数据库支持需要安装 oracledb 包');
  }

  async closeConnection(connection: any): Promise<void> {
    if (connection) {
      await connection.close();
    }
  }

  async testConnection(
    connection: DatabaseConnection
  ): Promise<{ success: boolean; message: string }> {
    throw new Error('Oracle 数据库支持需要安装 oracledb 包');
  }
}
