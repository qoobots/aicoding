/**
 * 数据库类型常量
 */
export enum DatabaseType {
  MYSQL = 'mysql',
  POSTGRESQL = 'postgresql',
  ORACLE = 'oracle',
  SQLSERVER = 'sqlserver',
}

/**
 * 数据库类型配置
 */
export const DATABASE_TYPE_CONFIG = {
  [DatabaseType.MYSQL]: {
    name: 'MySQL',
    defaultPort: 3306,
    description: 'MySQL 数据库',
    supported: true,
  },
  [DatabaseType.POSTGRESQL]: {
    name: 'PostgreSQL',
    defaultPort: 5432,
    description: 'PostgreSQL 数据库',
    supported: true,
  },
  [DatabaseType.ORACLE]: {
    name: 'Oracle',
    defaultPort: 1521,
    description: 'Oracle 数据库（需要安装 oracledb）',
    supported: false,
  },
  [DatabaseType.SQLSERVER]: {
    name: 'SQL Server',
    defaultPort: 1433,
    description: 'SQL Server 数据库（使用 PostgreSQL 适配器）',
    supported: false,
  },
};

/**
 * 获取数据库类型配置
 */
export function getDatabaseTypeConfig(type: DatabaseType) {
  return DATABASE_TYPE_CONFIG[type];
}

/**
 * 获取数据库类型默认端口
 */
export function getDatabaseTypeDefaultPort(type: DatabaseType): number {
  return DATABASE_TYPE_CONFIG[type]?.defaultPort || 3306;
}

/**
 * 检查数据库类型是否支持
 */
export function isDatabaseTypeSupported(type: DatabaseType): boolean {
  return DATABASE_TYPE_CONFIG[type]?.supported || false;
}
