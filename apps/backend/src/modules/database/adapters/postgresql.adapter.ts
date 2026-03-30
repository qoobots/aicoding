import { Injectable, Logger } from '@nestjs/common';
import { DatabaseConnection } from '../../entities/database-connection.entity';
import { IDatabaseAdapter } from './database.adapter.interface';
import { Pool } from 'pg';

/**
 * PostgreSQL 数据类型映射
 * PostgreSQL 类型 -> 统一类型
 */
const POSTGRESQL_TYPE_MAPPING: Record<string, string> = {
  // 整数类型
  integer: 'Integer',
  bigint: 'Long',
  smallint: 'Integer',
  serial: 'Integer',
  bigserial: 'Long',

  // 浮点类型
  numeric: 'BigDecimal',
  decimal: 'BigDecimal',
  real: 'Double',
  'double precision': 'Double',

  // 字符串类型
  'character varying': 'String',
  varchar: 'String',
  character: 'String',
  char: 'String',
  text: 'String',

  // 布尔类型
  boolean: 'Boolean',
  bool: 'Boolean',

  // 日期时间类型
  'timestamp without time zone': 'Date',
  'timestamp with time zone': 'Date',
  date: 'Date',
  'time without time zone': 'Date',
  'time with time zone': 'Date',

  // 二进制类型
  bytea: 'byte[]',

  // UUID
  uuid: 'String',

  // JSON
  json: 'String',
  jsonb: 'String',

  // 数组类型
  ARRAY: 'List',
};

@Injectable()
export class PostgreSQLAdapter implements IDatabaseAdapter {
  private readonly logger = new Logger(PostgreSQLAdapter.name);
  private pool: Pool | null = null;

  async createConnection(connection: DatabaseConnection): Promise<Pool> {
    this.pool = new Pool({
      host: connection.host,
      port: connection.port,
      user: connection.username,
      password: connection.password,
      database: connection.database,
      max: 20, // 最大连接数
      idleTimeoutMillis: 30000, // 空闲超时
      connectionTimeoutMillis: 2000, // 连接超时
    });
    return this.pool;
  }

  async getTables(pool: Pool, databaseName: string): Promise<any[]> {
    const result = await pool.query(`
      SELECT
        table_name as "tableName",
        obj_description((table_schema||'.'||table_name)::regclass, 'pg_class') as "tableComment"
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    return result.rows;
  }

  async getTableSchema(pool: Pool, databaseName: string, tableName: string): Promise<any> {
    // 获取表注释
    const tableResult = await pool.query(
      `
      SELECT obj_description((quote_ident($1)::regclass), 'pg_class') as "tableComment"
    `,
      [tableName]
    );

    // 获取列信息
    const columnsResult = await pool.query(
      `
      SELECT
        column_name as "columnName",
        col_description(quote_ident(table_schema)||'.'||quote_ident(table_name)::regclass::oid, ordinal_position) as "columnComment",
        data_type as "dataType",
        character_maximum_length as "columnLength",
        numeric_precision as "numericPrecision",
        numeric_scale as "numericScale",
        is_nullable as "isNullable",
        column_default as "defaultValue",
        CASE
          WHEN pk.column_name IS NOT NULL THEN 'PRI'
          ELSE ''
        END as "columnKey"
      FROM information_schema.columns
      LEFT JOIN (
        SELECT ku.column_name
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage ku
          ON tc.constraint_name = ku.constraint_name
        WHERE tc.constraint_type = 'PRIMARY KEY'
          AND tc.table_name = $1
          AND tc.table_schema = 'public'
      ) pk ON columns.column_name = pk.column_name
      WHERE table_schema = 'public'
        AND table_name = $1
      ORDER BY ordinal_position
    `,
      [tableName]
    );

    return {
      tableName,
      tableComment: tableResult.rows[0]?.tableComment || '',
      columns: columnsResult.rows.map((col: any) => {
        const baseType = col.dataType.toLowerCase();
        const mappedType = POSTGRESQL_TYPE_MAPPING[baseType] || 'String';

        // 构建完整的列类型字符串
        let columnType = mappedType;
        if (col.columnLength) {
          columnType = `${mappedType}(${col.columnLength})`;
        } else if (col.numericPrecision && col.numericScale) {
          columnType = `${mappedType}(${col.numericPrecision},${col.numericScale})`;
        }

        // 清理默认值表达式
        let defaultValue = col.defaultValue;
        if (defaultValue) {
          // 移除 PostgreSQL 默认值中的函数调用，如 nextval()
          defaultValue = defaultValue.replace(/nextval\([^)]+\)/g, '');
          // 移除引号
          defaultValue = defaultValue.replace(/^'(.*)'::\w+$/, '$1');
        }

        return {
          columnName: col.columnName,
          columnComment: col.columnComment || '',
          columnType: columnType,
          dataType: mappedType,
          columnLength: col.columnLength,
          isNullable: col.isNullable === 'YES',
          isPrimaryKey: col.columnKey === 'PRI',
          defaultValue: defaultValue,
          extra: '',
        };
      }),
    };
  }

  async closeConnection(pool: Pool): Promise<void> {
    if (pool) {
      await pool.end();
      this.pool = null;
    }
  }

  async testConnection(
    connection: DatabaseConnection
  ): Promise<{ success: boolean; message: string }> {
    const pool = await this.createConnection(connection);
    await pool.query('SELECT NOW()');
    await pool.end();
    return { success: true, message: '连接成功' };
  }
}
