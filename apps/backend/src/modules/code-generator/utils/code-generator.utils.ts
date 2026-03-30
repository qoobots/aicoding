/**
 * 代码生成工具类
 */

// 数据库类型映射到Java类型
export const DATABASE_TYPE_TO_JAVA: Record<string, string> = {
  varchar: 'String',
  char: 'String',
  text: 'String',
  longtext: 'String',
  mediumtext: 'String',
  tinytext: 'String',

  int: 'Integer',
  tinyint: 'Integer',
  smallint: 'Integer',
  mediumint: 'Integer',

  bigint: 'Long',

  float: 'Float',
  double: 'Double',
  decimal: 'BigDecimal',

  bit: 'Boolean',
  boolean: 'Boolean',

  date: 'Date',
  datetime: 'Date',
  timestamp: 'Date',
  time: 'Date',
  year: 'Integer',
};

// 数据库类型映射到TypeScript类型
export const DATABASE_TYPE_TO_TS: Record<string, string> = {
  varchar: 'string',
  char: 'string',
  text: 'string',
  longtext: 'string',
  mediumtext: 'string',
  tinytext: 'string',

  int: 'number',
  tinyint: 'number',
  smallint: 'number',
  mediumint: 'number',

  bigint: 'number',

  float: 'number',
  double: 'number',
  decimal: 'number',

  bit: 'boolean',
  boolean: 'boolean',

  date: 'string',
  datetime: 'string',
  timestamp: 'string',
  time: 'string',
  year: 'number',
};

// 数据库列名转驼峰
export function toCamelCase(str: string): string {
  return str
    .split('_')
    .map((word, index) => {
      if (index === 0) {
        return word.toLowerCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join('');
}

// 表名转类名（首字母大写的驼峰）
export function toClassName(tableName: string): string {
  return tableName
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}

// 数据库类型转Java类型
export function dbTypeToJava(dbType: string): string {
  const lowerType = dbType.toLowerCase();
  // 提取基本类型（去掉长度等信息）
  const baseType = lowerType.split('(')[0].split(' ')[0];
  return DATABASE_TYPE_TO_JAVA[baseType] || 'String';
}

// 数据库类型转TypeScript类型
export function dbTypeToTs(dbType: string): string {
  const lowerType = dbType.toLowerCase();
  const baseType = lowerType.split('(')[0].split(' ')[0];
  return DATABASE_TYPE_TO_TS[baseType] || 'string';
}

// 获取JPA注解
export function getJpaAnnotations(column: any): string[] {
  const annotations: string[] = [];

  if (column.isPrimaryKey) {
    annotations.push('@Id');
    annotations.push('@GeneratedValue(strategy = GenerationType.IDENTITY)');
  }

  if (column.columnName.toLowerCase().endsWith('id') || column.isPrimaryKey) {
    annotations.push(`@Column(name = "${column.columnName}")`);
  } else {
    annotations.push(
      `@Column(name = "${column.columnName}"${column.isNullable ? '' : ', nullable = false'}${column.defaultValue ? `, defaultValue = "${column.defaultValue}"` : ''})`
    );
  }

  return annotations;
}
