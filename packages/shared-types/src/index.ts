/**
 * 共享TypeScript类型定义
 */

/**
 * 数据库类型枚举
 */
export enum DatabaseType {
  MySQL = 'mysql',
  PostgreSQL = 'postgresql',
  Oracle = 'oracle',
  SqlServer = 'sqlserver',
}

/**
 * 数据库类型辅助类
 */
export class DatabaseTypeUtils {
  /**
   * 获取数据库类型的中文名称
   */
  static getDisplayName(type: DatabaseType): string {
    const displayNames: Record<DatabaseType, string> = {
      [DatabaseType.MySQL]: 'MySQL',
      [DatabaseType.PostgreSQL]: 'PostgreSQL',
      [DatabaseType.Oracle]: 'Oracle',
      [DatabaseType.SqlServer]: 'SQL Server',
    };
    return displayNames[type] || type;
  }

  /**
   * 获取数据库类型的默认端口
   */
  static getDefaultPort(type: DatabaseType): number {
    const defaultPorts: Record<DatabaseType, number> = {
      [DatabaseType.MySQL]: 3306,
      [DatabaseType.PostgreSQL]: 5432,
      [DatabaseType.Oracle]: 1521,
      [DatabaseType.SqlServer]: 1433,
    };
    return defaultPorts[type] || 3306;
  }

  /**
   * 获取所有数据库类型列表
   */
  static getAllTypes(): DatabaseType[] {
    return Object.values(DatabaseType);
  }

  /**
   * 获取数据库类型选项（用于下拉选择）
   */
  static getOptions(): Array<{ label: string; value: DatabaseType }> {
    return this.getAllTypes().map((type) => ({
      label: this.getDisplayName(type),
      value: type,
    }));
  }

  /**
   * 检查是否是有效的数据库类型
   */
  static isValidType(type: string): type is DatabaseType {
    return Object.values(DatabaseType).includes(type as DatabaseType);
  }
}

/**
 * 编程语言枚举
 */
export enum ProgrammingLanguage {
  Java = 'java',
  Go = 'go',
  Python = 'python',
  TypeScript = 'typescript',
  Rust = 'rust',
}

/**
 * 编程语言辅助类
 */
export class ProgrammingLanguageUtils {
  /**
   * 获取编程语言的中文名称
   */
  static getDisplayName(language: ProgrammingLanguage): string {
    const displayNames: Record<ProgrammingLanguage, string> = {
      [ProgrammingLanguage.Java]: 'Java',
      [ProgrammingLanguage.Go]: 'Go',
      [ProgrammingLanguage.Python]: 'Python',
      [ProgrammingLanguage.TypeScript]: 'TypeScript',
      [ProgrammingLanguage.Rust]: 'Rust',
    };
    return displayNames[language] || language;
  }

  /**
   * 获取编程语言的文件扩展名
   */
  static getFileExtension(language: ProgrammingLanguage): string {
    const extensions: Record<ProgrammingLanguage, string> = {
      [ProgrammingLanguage.Java]: '.java',
      [ProgrammingLanguage.Go]: '.go',
      [ProgrammingLanguage.Python]: '.py',
      [ProgrammingLanguage.TypeScript]: '.ts',
      [ProgrammingLanguage.Rust]: '.rs',
    };
    return extensions[language] || '.txt';
  }

  /**
   * 获取编程语言的图标
   */
  static getIcon(language: ProgrammingLanguage): string {
    const icons: Record<ProgrammingLanguage, string> = {
      [ProgrammingLanguage.Java]: '☕',
      [ProgrammingLanguage.Go]: '🐹',
      [ProgrammingLanguage.Python]: '🐍',
      [ProgrammingLanguage.TypeScript]: '💎',
      [ProgrammingLanguage.Rust]: '🦀',
    };
    return icons[language] || '📄';
  }

  /**
   * 获取所有编程语言列表
   */
  static getAllLanguages(): ProgrammingLanguage[] {
    return Object.values(ProgrammingLanguage);
  }

  /**
   * 获取编程语言选项（用于下拉选择）
   */
  static getOptions(): Array<{ label: string; value: ProgrammingLanguage; icon: string }> {
    return this.getAllLanguages().map((lang) => ({
      label: this.getDisplayName(lang),
      value: lang,
      icon: this.getIcon(lang),
    }));
  }

  /**
   * 检查是否是有效的编程语言
   */
  static isValidLanguage(language: string): language is ProgrammingLanguage {
    return Object.values(ProgrammingLanguage).includes(language as ProgrammingLanguage);
  }

  /**
   * 根据文件扩展名推断编程语言
   */
  static inferFromFileExtension(ext: string): ProgrammingLanguage | null {
    const extensionMap: Record<string, ProgrammingLanguage> = {
      '.java': ProgrammingLanguage.Java,
      '.go': ProgrammingLanguage.Go,
      '.py': ProgrammingLanguage.Python,
      '.ts': ProgrammingLanguage.TypeScript,
      '.tsx': ProgrammingLanguage.TypeScript,
      '.rs': ProgrammingLanguage.Rust,
    };
    return extensionMap[ext.toLowerCase()] || null;
  }
}

/**
 * 数据库列类型映射类
 * 将PostgreSQL、MySQL、Oracle、SqlServer数据库列类型映射到Java、Go、Python、TypeScript、Rust属性类型
 */
export class DataTypeMapper {
  /**
   * 按数据库分类的类型映射结构
   */
  private static typeMaps = {
    mysql: {
      java: {
        tinyint: 'Byte',
        smallint: 'Short',
        int: 'Integer',
        integer: 'Integer',
        bigint: 'Long',
        float: 'Float',
        double: 'Double',
        decimal: 'java.math.BigDecimal',
        numeric: 'java.math.BigDecimal',
        char: 'String',
        varchar: 'String',
        text: 'String',
        longtext: 'String',
        mediumtext: 'String',
        tinytext: 'String',
        date: 'java.time.LocalDate',
        datetime: 'java.time.LocalDateTime',
        timestamp: 'java.time.LocalDateTime',
        time: 'java.time.LocalTime',
        year: 'Integer',
        bit: 'Boolean',
        boolean: 'Boolean',
        json: 'String',
        enum: 'String',
        set: 'String',
        binary: 'byte[]',
        blob: 'byte[]',
        longblob: 'byte[]',
      },
      go: {
        tinyint: 'int8',
        smallint: 'int16',
        int: 'int32',
        integer: 'int32',
        bigint: 'int64',
        float: 'float32',
        double: 'float64',
        decimal: 'string',
        numeric: 'string',
        char: 'string',
        varchar: 'string',
        text: 'string',
        longtext: 'string',
        mediumtext: 'string',
        tinytext: 'string',
        date: 'time.Time',
        datetime: 'time.Time',
        timestamp: 'time.Time',
        time: 'time.Time',
        year: 'int32',
        bit: 'bool',
        boolean: 'bool',
        json: 'string',
        enum: 'string',
        set: 'string',
        binary: '[]byte',
        blob: '[]byte',
        longblob: '[]byte',
      },
      python: {
        tinyint: 'int',
        smallint: 'int',
        int: 'int',
        integer: 'int',
        bigint: 'int',
        float: 'float',
        double: 'float',
        decimal: 'Decimal',
        numeric: 'Decimal',
        char: 'str',
        varchar: 'str',
        text: 'str',
        longtext: 'str',
        mediumtext: 'str',
        tinytext: 'str',
        date: 'date',
        datetime: 'datetime',
        timestamp: 'datetime',
        time: 'time',
        year: 'int',
        bit: 'bool',
        boolean: 'bool',
        json: 'dict',
        enum: 'str',
        set: 'str',
        binary: 'bytes',
        blob: 'bytes',
        longblob: 'bytes',
      },
      typescript: {
        tinyint: 'number',
        smallint: 'number',
        int: 'number',
        integer: 'number',
        bigint: 'number',
        float: 'number',
        double: 'number',
        decimal: 'number',
        numeric: 'number',
        char: 'string',
        varchar: 'string',
        text: 'string',
        longtext: 'string',
        mediumtext: 'string',
        tinytext: 'string',
        date: 'string',
        datetime: 'string',
        timestamp: 'string',
        time: 'string',
        year: 'number',
        bit: 'boolean',
        boolean: 'boolean',
        json: 'object',
        enum: 'string',
        set: 'string[]',
        binary: 'string',
        blob: 'string',
        longblob: 'string',
      },
      rust: {
        tinyint: 'i8',
        smallint: 'i16',
        int: 'i32',
        integer: 'i32',
        bigint: 'i64',
        float: 'f32',
        double: 'f64',
        decimal: 'BigDecimal',
        numeric: 'BigDecimal',
        char: 'String',
        varchar: 'String',
        text: 'String',
        longtext: 'String',
        mediumtext: 'String',
        tinytext: 'String',
        date: 'chrono::NaiveDate',
        datetime: 'chrono::NaiveDateTime',
        timestamp: 'chrono::DateTime<chrono::Utc>',
        time: 'chrono::NaiveTime',
        year: 'i32',
        bit: 'bool',
        boolean: 'bool',
        json: 'serde_json::Value',
        enum: 'String',
        set: 'Vec<String>',
        binary: 'Vec<u8>',
        blob: 'Vec<u8>',
        longblob: 'Vec<u8>',
      },
    },
    postgresql: {
      java: {
        // 数值类型
        smallint: 'Short',
        int2: 'Short',
        integer: 'Integer',
        int: 'Integer',
        int4: 'Integer',
        bigint: 'Long',
        int8: 'Long',
        decimal: 'java.math.BigDecimal',
        numeric: 'java.math.BigDecimal',
        real: 'Float',
        float4: 'Float',
        'double precision': 'Double',
        float8: 'Double',
        money: 'java.math.BigDecimal',

        // 自增序列
        smallserial: 'Integer',
        serial2: 'Integer',
        serial: 'Integer',
        serial4: 'Integer',
        bigserial: 'Long',
        serial8: 'Long',

        // 字符串类型
        character: 'String',
        char: 'String',
        bpchar: 'String',
        'character varying': 'String',
        varchar: 'String',
        text: 'String',

        // 布尔类型
        boolean: 'Boolean',
        bool: 'Boolean',

        // 日期时间类型
        date: 'java.time.LocalDate',
        time: 'java.time.LocalTime',
        timetz: 'java.time.OffsetTime',
        timestamp: 'java.time.LocalDateTime',
        timestamptz: 'java.time.OffsetDateTime',
        interval: 'java.time.Duration',

        // 二进制类型
        bytea: 'byte[]',

        // JSON 类型
        json: 'String',
        jsonb: 'String',

        // UUID
        uuid: 'java.util.UUID',

        // XML
        xml: 'String',

        // 位串类型
        bit: 'String',
        varbit: 'String',

        // 特殊类型
        cidr: 'String',
        inet: 'String',
        macaddr: 'String',
        macaddr8: 'String',
        tsquery: 'String',
        tsvector: 'String',
        txid_snapshot: 'String',
        pg_lsn: 'String',
        pg_snapshot: 'String',

        // 数组类型(示例)
        'integer[]': 'Integer[]',
        'varchar[]': 'String[]',
        'text[]': 'String[]',
        'jsonb[]': 'String[]',

        // 范围类型
        int4range: 'String',
        int8range: 'String',
        numrange: 'String',
        tsrange: 'String',
        tstzrange: 'String',
        daterange: 'String',

        // 几何类型
        point: 'String',
        line: 'String',
        lseg: 'String',
        box: 'String',
        path: 'String',
        polygon: 'String',
        circle: 'String',

        // 对象标识符
        oid: 'Long',
        regproc: 'String',
        regprocedure: 'String',
        regoper: 'String',
        regoperator: 'String',
        regclass: 'String',
        regtype: 'String',
        regrole: 'String',
        regnamespace: 'String',
      },
      go: {
        // 数值类型
        smallint: 'int16',
        int2: 'int16',
        integer: 'int32',
        int: 'int32',
        int4: 'int32',
        bigint: 'int64',
        int8: 'int64',
        decimal: 'string',
        numeric: 'string',
        real: 'float32',
        float4: 'float32',
        'double precision': 'float64',
        float8: 'float64',
        money: 'string',

        // 自增序列
        smallserial: 'int32',
        serial2: 'int32',
        serial: 'int32',
        serial4: 'int32',
        bigserial: 'int64',
        serial8: 'int64',

        // 字符串类型
        character: 'string',
        char: 'string',
        bpchar: 'string',
        'character varying': 'string',
        varchar: 'string',
        text: 'string',

        // 布尔类型
        boolean: 'bool',
        bool: 'bool',

        // 日期时间类型
        date: 'time.Time',
        time: 'time.Time',
        timetz: 'time.Time',
        timestamp: 'time.Time',
        timestamptz: 'time.Time',
        interval: 'time.Duration',

        // 二进制类型
        bytea: '[]byte',

        // JSON 类型
        json: 'string',
        jsonb: 'string',

        // UUID
        uuid: 'string',

        // XML
        xml: 'string',

        // 位串类型
        bit: 'string',
        varbit: 'string',

        // 特殊类型
        cidr: 'string',
        inet: 'string',
        macaddr: 'string',
        macaddr8: 'string',
        tsquery: 'string',
        tsvector: 'string',
        txid_snapshot: 'string',
        pg_lsn: 'string',
        pg_snapshot: 'string',

        // 数组类型
        'integer[]': '[]int32',
        'varchar[]': '[]string',
        'text[]': '[]string',
        'jsonb[]': '[]string',

        // 范围类型
        int4range: 'string',
        int8range: 'string',
        numrange: 'string',
        tsrange: 'string',
        tstzrange: 'string',
        daterange: 'string',

        // 几何类型
        point: 'string',
        line: 'string',
        lseg: 'string',
        box: 'string',
        path: 'string',
        polygon: 'string',
        circle: 'string',

        // 对象标识符
        oid: 'int64',
        regproc: 'string',
        regprocedure: 'string',
        regoper: 'string',
        regoperator: 'string',
        regclass: 'string',
        regtype: 'string',
        regrole: 'string',
        regnamespace: 'string',
      },
      python: {
        // 数值类型
        smallint: 'int',
        int2: 'int',
        integer: 'int',
        int: 'int',
        int4: 'int',
        bigint: 'int',
        int8: 'int',
        decimal: 'Decimal',
        numeric: 'Decimal',
        real: 'float',
        float4: 'float',
        'double precision': 'float',
        float8: 'float',
        money: 'Decimal',

        // 自增序列
        smallserial: 'int',
        serial2: 'int',
        serial: 'int',
        serial4: 'int',
        bigserial: 'int',
        serial8: 'int',

        // 字符串类型
        character: 'str',
        char: 'str',
        bpchar: 'str',
        'character varying': 'str',
        varchar: 'str',
        text: 'str',

        // 布尔类型
        boolean: 'bool',
        bool: 'bool',

        // 日期时间类型
        date: 'date',
        time: 'time',
        timetz: 'time',
        timestamp: 'datetime',
        timestamptz: 'datetime',
        interval: 'timedelta',

        // 二进制类型
        bytea: 'bytes',

        // JSON 类型
        json: 'dict',
        jsonb: 'dict',

        // UUID
        uuid: 'str',

        // XML
        xml: 'str',

        // 位串类型
        bit: 'str',
        varbit: 'str',

        // 特殊类型
        cidr: 'str',
        inet: 'str',
        macaddr: 'str',
        macaddr8: 'str',
        tsquery: 'str',
        tsvector: 'str',
        txid_snapshot: 'str',
        pg_lsn: 'str',
        pg_snapshot: 'str',

        // 数组类型
        'integer[]': 'List[int]',
        'varchar[]': 'List[str]',
        'text[]': 'List[str]',
        'jsonb[]': 'List[dict]',

        // 范围类型
        int4range: 'str',
        int8range: 'str',
        numrange: 'str',
        tsrange: 'str',
        tstzrange: 'str',
        daterange: 'str',

        // 几何类型
        point: 'str',
        line: 'str',
        lseg: 'str',
        box: 'str',
        path: 'str',
        polygon: 'str',
        circle: 'str',

        // 对象标识符
        oid: 'int',
        regproc: 'str',
        regprocedure: 'str',
        regoper: 'str',
        regoperator: 'str',
        regclass: 'str',
        regtype: 'str',
        regrole: 'str',
        regnamespace: 'str',
      },
      typescript: {
        // 数值类型
        smallint: 'number',
        int2: 'number',
        integer: 'number',
        int: 'number',
        int4: 'number',
        bigint: 'number',
        int8: 'number',
        decimal: 'number',
        numeric: 'number',
        real: 'number',
        float4: 'number',
        'double precision': 'number',
        float8: 'number',
        money: 'number',

        // 自增序列
        smallserial: 'number',
        serial2: 'number',
        serial: 'number',
        serial4: 'number',
        bigserial: 'number',
        serial8: 'number',

        // 字符串类型
        character: 'string',
        char: 'string',
        bpchar: 'string',
        'character varying': 'string',
        varchar: 'string',
        text: 'string',

        // 布尔类型
        boolean: 'boolean',
        bool: 'boolean',

        // 日期时间类型
        date: 'string',
        time: 'string',
        timetz: 'string',
        timestamp: 'string',
        timestamptz: 'string',
        interval: 'string',

        // 二进制类型
        bytea: 'string',

        // JSON 类型
        json: 'object',
        jsonb: 'object',

        // UUID
        uuid: 'string',

        // XML
        xml: 'string',

        // 位串类型
        bit: 'string',
        varbit: 'string',

        // 特殊类型
        cidr: 'string',
        inet: 'string',
        macaddr: 'string',
        macaddr8: 'string',
        tsquery: 'string',
        tsvector: 'string',
        txid_snapshot: 'string',
        pg_lsn: 'string',
        pg_snapshot: 'string',

        // 数组类型
        'integer[]': 'number[]',
        'varchar[]': 'string[]',
        'text[]': 'string[]',
        'jsonb[]': 'object[]',

        // 范围类型
        int4range: 'string',
        int8range: 'string',
        numrange: 'string',
        tsrange: 'string',
        tstzrange: 'string',
        daterange: 'string',

        // 几何类型
        point: 'string',
        line: 'string',
        lseg: 'string',
        box: 'string',
        path: 'string',
        polygon: 'string',
        circle: 'string',

        // 对象标识符
        oid: 'number',
        regproc: 'string',
        regprocedure: 'string',
        regoper: 'string',
        regoperator: 'string',
        regclass: 'string',
        regtype: 'string',
        regrole: 'string',
        regnamespace: 'string',
      },
      rust: {
        // 数值类型
        smallint: 'i16',
        int2: 'i16',
        integer: 'i32',
        int: 'i32',
        int4: 'i32',
        bigint: 'i64',
        int8: 'i64',
        decimal: 'BigDecimal',
        numeric: 'BigDecimal',
        real: 'f32',
        float4: 'f32',
        'double precision': 'f64',
        float8: 'f64',
        money: 'BigDecimal',

        // 自增序列
        smallserial: 'i32',
        serial2: 'i32',
        serial: 'i32',
        serial4: 'i32',
        bigserial: 'i64',
        serial8: 'i64',

        // 字符串类型
        character: 'String',
        char: 'String',
        bpchar: 'String',
        'character varying': 'String',
        varchar: 'String',
        text: 'String',

        // 布尔类型
        boolean: 'bool',
        bool: 'bool',

        // 日期时间类型
        date: 'chrono::NaiveDate',
        time: 'chrono::NaiveTime',
        timetz: 'chrono::DateTime<chrono::Utc>',
        timestamp: 'chrono::NaiveDateTime',
        timestamptz: 'chrono::DateTime<chrono::Utc>',
        interval: 'chrono::Duration',

        // 二进制类型
        bytea: 'Vec<u8>',

        // JSON 类型
        json: 'serde_json::Value',
        jsonb: 'serde_json::Value',

        // UUID
        uuid: 'uuid::Uuid',

        // XML
        xml: 'String',

        // 位串类型
        bit: 'String',
        varbit: 'String',

        // 特殊类型
        cidr: 'String',
        inet: 'String',
        macaddr: 'String',
        macaddr8: 'String',
        tsquery: 'String',
        tsvector: 'String',
        txid_snapshot: 'String',
        pg_lsn: 'String',
        pg_snapshot: 'String',

        // 数组类型
        'integer[]': 'Vec<i32>',
        'varchar[]': 'Vec<String>',
        'text[]': 'Vec<String>',
        'jsonb[]': 'Vec<serde_json::Value>',

        // 范围类型
        int4range: 'String',
        int8range: 'String',
        numrange: 'String',
        tsrange: 'String',
        tstzrange: 'String',
        daterange: 'String',

        // 几何类型
        point: 'String',
        line: 'String',
        lseg: 'String',
        box: 'String',
        path: 'String',
        polygon: 'String',
        circle: 'String',

        // 对象标识符
        oid: 'i64',
        regproc: 'String',
        regprocedure: 'String',
        regoper: 'String',
        regoperator: 'String',
        regclass: 'String',
        regtype: 'String',
        regrole: 'String',
        regnamespace: 'String',
      },
    },
    oracle: {
      java: {
        number: 'java.math.BigDecimal',
        binary_float: 'Float',
        binary_double: 'Double',
        nvarchar2: 'String',
        nclob: 'String',
        rowid: 'String',
        urowid: 'String',
        'timestamp with time zone': 'java.time.OffsetDateTime',
        'timestamp with local time zone': 'java.time.LocalDateTime',
        bfile: 'byte[]',
      },
      go: {
        number: 'string',
        binary_float: 'float32',
        binary_double: 'float64',
        nvarchar2: 'string',
        nclob: 'string',
        rowid: 'string',
        urowid: 'string',
        'timestamp with time zone': 'time.Time',
        'timestamp with local time zone': 'time.Time',
        bfile: '[]byte',
      },
      python: {
        number: 'Decimal',
        binary_float: 'float',
        binary_double: 'float',
        nvarchar2: 'str',
        nclob: 'str',
        rowid: 'str',
        urowid: 'str',
        'timestamp with time zone': 'datetime',
        'timestamp with local time zone': 'datetime',
        bfile: 'bytes',
      },
      typescript: {
        number: 'number',
        binary_float: 'number',
        binary_double: 'number',
        nvarchar2: 'string',
        nclob: 'string',
        rowid: 'string',
        urowid: 'string',
        'timestamp with time zone': 'string',
        'timestamp with local time zone': 'string',
        bfile: 'string',
      },
      rust: {
        number: 'BigDecimal',
        binary_float: 'f32',
        binary_double: 'f64',
        nvarchar2: 'String',
        nclob: 'String',
        rowid: 'String',
        urowid: 'String',
        'timestamp with time zone': 'chrono::DateTime<chrono::Utc>',
        'timestamp with local time zone': 'chrono::DateTime<chrono::Utc>',
        bfile: 'Vec<u8>',
      },
    },
    sqlserver: {
      java: {
        tinyint: 'Byte',
        smallmoney: 'java.math.BigDecimal',
        money: 'java.math.BigDecimal',
        smalldatetime: 'java.time.LocalDateTime',
        datetime2: 'java.time.LocalDateTime',
        datetimeoffset: 'java.time.OffsetDateTime',
        uniqueidentifier: 'java.util.UUID',
        varbinary: 'byte[]',
        image: 'byte[]',
        ntext: 'String',
        nvarchar: 'String',
        xml: 'String',
      },
      go: {
        tinyint: 'int8',
        smallmoney: 'string',
        money: 'string',
        smalldatetime: 'time.Time',
        datetime2: 'time.Time',
        datetimeoffset: 'time.Time',
        uniqueidentifier: 'string',
        varbinary: '[]byte',
        image: '[]byte',
        ntext: 'string',
        nvarchar: 'string',
        xml: 'string',
      },
      python: {
        tinyint: 'int',
        smallmoney: 'Decimal',
        money: 'Decimal',
        smalldatetime: 'datetime',
        datetime2: 'datetime',
        datetimeoffset: 'datetime',
        uniqueidentifier: 'str',
        varbinary: 'bytes',
        image: 'bytes',
        ntext: 'str',
        nvarchar: 'str',
        xml: 'str',
      },
      typescript: {
        tinyint: 'number',
        smallmoney: 'number',
        money: 'number',
        smalldatetime: 'string',
        datetime2: 'string',
        datetimeoffset: 'string',
        uniqueidentifier: 'string',
        varbinary: 'string',
        image: 'string',
        ntext: 'string',
        nvarchar: 'string',
        xml: 'string',
      },
      rust: {
        tinyint: 'i8',
        smallmoney: 'BigDecimal',
        money: 'BigDecimal',
        smalldatetime: 'chrono::NaiveDateTime',
        datetime2: 'chrono::DateTime<chrono::Utc>',
        datetimeoffset: 'chrono::DateTime<chrono::Utc>',
        uniqueidentifier: 'uuid::Uuid',
        varbinary: 'Vec<u8>',
        image: 'Vec<u8>',
        ntext: 'String',
        nvarchar: 'String',
        xml: 'String',
      },
    },
  };

  /**
   * 数据库类型到编程语言的默认类型映射
   */
  private static defaultTypes = {
    [ProgrammingLanguage.Java]: 'String',
    [ProgrammingLanguage.Go]: 'string',
    [ProgrammingLanguage.Python]: 'str',
    [ProgrammingLanguage.TypeScript]: 'string',
    [ProgrammingLanguage.Rust]: 'String',
  };

  /**
   * 获取特定数据库和语言的映射表
   */
  private static getMap(
    dbType: DatabaseType,
    language: ProgrammingLanguage
  ): Record<string, string> {
    const dbKey = dbType.toLowerCase();
    const langKey = language.toLowerCase();

    // @ts-expect-error - Dynamic access to type maps
    return this.typeMaps[dbKey]?.[langKey] || {};
  }

  /**
   * 根据数据库类型和目标语言获取对应的类型
   * @param dbType 数据库列类型（如 'varchar', 'int', 'timestamp'）
   * @param databaseType 数据库类型（MySQL, PostgreSQL, Oracle, SqlServer）
   * @param language 目标编程语言
   * @returns 对应的编程语言类型
   */
  static mapType(
    dbType: string,
    databaseType: DatabaseType,
    language: ProgrammingLanguage
  ): string {
    const normalizedDbType = dbType.toLowerCase().trim();
    const map = this.getMap(databaseType, language);
    return map[normalizedDbType] || this.defaultTypes[language];
  }

  /**
   * 根据数据库类型和目标语言获取对应的类型（简化版本，不指定数据库）
   * 会在所有数据库中查找该类型
   * @param dbType 数据库列类型
   * @param language 目标编程语言
   * @returns 对应的编程语言类型
   */
  static mapTypeSimple(dbType: string, language: ProgrammingLanguage): string {
    const normalizedDbType = dbType.toLowerCase().trim();

    // 按优先级顺序查找：MySQL -> PostgreSQL -> Oracle -> SQL Server
    const databases = [
      DatabaseType.MySQL,
      DatabaseType.PostgreSQL,
      DatabaseType.Oracle,
      DatabaseType.SqlServer,
    ];

    for (const dbTypeKey of databases) {
      const map = this.getMap(dbTypeKey, language);
      if (map[normalizedDbType]) {
        return map[normalizedDbType];
      }
    }

    return this.defaultTypes[language];
  }

  /**
   * 批量映射多个数据库类型
   * @param dbTypes 数据库列类型数组
   * @param databaseType 数据库类型
   * @param language 目标编程语言
   * @returns 对应的编程语言类型数组
   */
  static mapTypes(
    dbTypes: string[],
    databaseType: DatabaseType,
    language: ProgrammingLanguage
  ): string[] {
    return dbTypes.map((type) => this.mapType(type, databaseType, language));
  }

  /**
   * 批量映射多个数据库类型（简化版本）
   * @param dbTypes 数据库列类型数组
   * @param language 目标编程语言
   * @returns 对应的编程语言类型数组
   */
  static mapTypesSimple(dbTypes: string[], language: ProgrammingLanguage): string[] {
    return dbTypes.map((type) => this.mapTypeSimple(type, language));
  }

  /**
   * 获取特定数据库和语言的类型映射表（用于调试）
   * @param databaseType 数据库类型
   * @param language 编程语言
   * @returns 类型映射表的副本
   */
  static getTypeMap(
    databaseType: DatabaseType,
    language: ProgrammingLanguage
  ): Record<string, string> {
    return { ...this.getMap(databaseType, language) };
  }

  /**
   * 获取特定数据库类型的所有类型（跨所有数据库）
   * @param language 编程语言
   * @returns 所有数据库类型的映射表合并
   */
  static getAllTypeMap(language: ProgrammingLanguage): Record<string, string> {
    const allTypes: Record<string, string> = {};

    for (const dbType of Object.values(DatabaseType)) {
      const map = this.getMap(dbType, language);
      Object.assign(allTypes, map);
    }

    return allTypes;
  }

  /**
   * 获取所有支持的数据库类型
   * @returns 所有支持的数据库列类型列表
   */
  static getAllDatabaseTypes(): string[] {
    const allTypes = new Set<string>();

    for (const dbType of Object.values(DatabaseType)) {
      for (const language of Object.values(ProgrammingLanguage)) {
        const map = this.getMap(dbType, language);
        Object.keys(map).forEach((type) => allTypes.add(type));
      }
    }

    return Array.from(allTypes).sort();
  }

  /**
   * 检查数据库类型是否被支持
   * @param dbType 数据库列类型
   * @param databaseType 可选，指定数据库类型
   * @returns 是否支持
   */
  static isSupported(dbType: string, databaseType?: DatabaseType): boolean {
    const normalizedDbType = dbType.toLowerCase().trim();

    if (databaseType) {
      const map = this.getMap(databaseType, ProgrammingLanguage.Java);
      return Object.prototype.hasOwnProperty.call(map, normalizedDbType);
    }

    // 在所有数据库中查找
    for (const dbTypeKey of Object.values(DatabaseType)) {
      const map = this.getMap(dbTypeKey, ProgrammingLanguage.Java);
      if (Object.prototype.hasOwnProperty.call(map, normalizedDbType)) {
        return true;
      }
    }

    return false;
  }

  /**
   * 获取特定数据库支持的类型
   * @param databaseType 数据库类型
   * @returns 该数据库支持的所有列类型
   */
  static getDatabaseTypes(databaseType: DatabaseType): string[] {
    const allTypes = new Set<string>();

    for (const language of Object.values(ProgrammingLanguage)) {
      const map = this.getMap(databaseType, language);
      Object.keys(map).forEach((type) => allTypes.add(type));
    }

    return Array.from(allTypes).sort();
  }
}

/**
 * 数据库相关类型
 */
export interface DatabaseConnection {
  id?: string;
  name: string;
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  type: DatabaseType;
  status?: 'active' | 'inactive';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TableSchema {
  tableName: string;
  tableComment?: string;
  columns: ColumnSchema[];
  createTime?: Date;
  updateTime?: Date;
}

export interface ColumnSchema {
  columnName: string;
  columnComment?: string;
  columnType: string;
  dataType: string;
  columnLength?: number;
  isNullable: boolean;
  isPrimaryKey: boolean;
  defaultValue?: string;
  extra?: string;
}

export interface CodeGenerateConfig {
  projectPath: string;
  packageName: string;
  tableName: string;
  tableComment?: string;
  resourcePath?: string;
  vueResourcePath?: string;
  vuePackagePath?: string;
  language?: ProgrammingLanguage; // 生成代码的目标语言
  entityConfig: EntityClassConfig;
  mapperConfig: MapperClassConfig;
  serviceConfig: ServiceClassConfig;
  controllerConfig: ControllerClassConfig;
  dtoConfig: DTOClassConfig;
  voConfig: VOClassConfig;
  commonConfig: CommonClassConfig;
  testConfig: TestClassConfig;
  vueConfig: VueConfig;
}

export interface EntityClassConfig {
  basePath: string;
  basePackage: string;
  className: string;
}

export interface MapperClassConfig {
  basePath: string;
  basePackage: string;
  className: string;
}

export interface ServiceClassConfig {
  basePath: string;
  basePackage: string;
  className: string;
}

export interface ServiceImplClassConfig {
  basePath: string;
  basePackage: string;
  className: string;
}

export interface ControllerClassConfig {
  basePath: string;
  basePackage: string;
  className: string;
}

export interface DTOClassConfig {
  basePath: string;
  basePackage: string;
  className: string;
}

export interface VOClassConfig {
  basePath: string;
  basePackage: string;
  className: string;
}

export interface CommonClassConfig {
  basePath: string;
  basePackage: string;
  classNames: string[];
}

export interface TestClassConfig {
  basePath: string;
  basePackage: string;
  className: string;
}

export interface VueConfig {
  basePath: string;
  routePath: string;
  files: VueFileConfig[];
}

export interface VueFileConfig {
  type: 'create' | 'edit' | 'detail' | 'list' | 'entity';
  fileName: string;
  path: string;
}

/**
 * 项目相关类型
 */
export interface Project {
  id: string;
  name: string;
  description?: string;
  type: ProgrammingLanguage;
  templateType?: string; // 兼容旧版本
  status: 'active' | 'archived' | 'deleted';
  packageName?: string;
  config?: ProjectConfig;
  projectPath: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectConfig {
  packageName?: string;
  port?: number;
  database?: DatabaseConfig;
  modules?: string[];
}

export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
}

/**
 * 代码文件相关类型
 */
export interface CodeFile {
  id: string;
  projectId: string;
  filePath: string;
  content?: string;
  fileHash: string;
  language: string;
  fileSize: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * AI生成相关类型
 */
export interface AIGeneration {
  id: string;
  projectId: string;
  prompt: string;
  response?: string;
  model: string;
  tokensUsed?: number;
  status: 'success' | 'failed' | 'pending';
  errorMessage?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
}

/**
 * 模板相关类型
 */
export interface Template {
  id: string;
  name: string;
  type: TemplateType;
  category: string;
  version: string;
  description?: string;
  filePath: string;
  createdAt: Date;
  updatedAt: Date;
}

export type TemplateType = 'spring-boot' | 'spring-cloud' | 'vue3' | 'react' | 'other';

/**
 * 实体配置类型
 */
export interface EntityConfig {
  className: string;
  tableName: string;
  description?: string;
  fields: FieldConfig[];
}

export interface FieldConfig {
  name: string;
  type: FieldType;
  comment?: string;
  length?: number;
  nullable?: boolean;
  defaultValue?: string;
}

export type FieldType =
  | 'String'
  | 'Integer'
  | 'Long'
  | 'Double'
  | 'BigDecimal'
  | 'Boolean'
  | 'Date'
  | 'LocalDateTime'
  | 'Text';

/**
 * API响应类型
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PageResult<T> {
  list: T[];
  total: number;
  pageNum: number;
  pageSize: number;
}

/**
 * WebSocket消息类型
 */
export interface WSMessage {
  type: 'code-generate' | 'project-sync' | 'error';
  payload: any;
  timestamp: number;
}

/**
 * Electron IPC消息类型
 */
export interface IPCMessage {
  channel: string;
  args: any[];
}

export interface IPCResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}
