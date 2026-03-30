# DatabaseType 枚举使用文档

## 枚举定义

```typescript
export enum DatabaseType {
  MySQL = 'mysql',
  PostgreSQL = 'postgresql',
  Oracle = 'oracle',
  SqlServer = 'sqlserver',
}
```

## 使用方法

### 1. 在类型定义中使用

```typescript
import { DatabaseType } from '@shared/types';

interface DatabaseConnection {
  type: DatabaseType;
  // 其他字段...
}
```

### 2. 获取所有数据库类型

```typescript
import { DatabaseTypeUtils } from '@shared/types';

const allTypes = DatabaseTypeUtils.getAllTypes();
// 返回: [DatabaseType.MySQL, DatabaseType.PostgreSQL, DatabaseType.Oracle, DatabaseType.SqlServer]
```

### 3. 获取数据库类型选项（用于下拉选择）

```typescript
import { DatabaseTypeUtils } from '@shared/types';

const options = DatabaseTypeUtils.getOptions();
// 返回: [
//   { label: 'MySQL', value: DatabaseType.MySQL },
//   { label: 'PostgreSQL', value: DatabaseType.PostgreSQL },
//   { label: 'Oracle', value: DatabaseType.Oracle },
//   { label: 'SQL Server', value: DatabaseType.SqlServer }
// ]
```

### 4. 获取数据库类型的中文名称

```typescript
import { DatabaseTypeUtils } from '@shared/types';

const displayName = DatabaseTypeUtils.getDisplayName(DatabaseType.PostgreSQL);
// 返回: 'PostgreSQL'
```

### 5. 获取数据库类型的默认端口

```typescript
import { DatabaseTypeUtils } from '@shared/types';

const defaultPort = DatabaseTypeUtils.getDefaultPort(DatabaseType.MySQL);
// 返回: 3306

const postgresPort = DatabaseTypeUtils.getDefaultPort(DatabaseType.PostgreSQL);
// 返回: 5432
```

### 6. 验证是否是有效的数据库类型

```typescript
import { DatabaseTypeUtils } from '@shared/types';

const isValid = DatabaseTypeUtils.isValidType('mysql');
// 返回: true

const isInvalid = DatabaseTypeUtils.isValidType('invalid-type');
// 返回: false
```

### 7. 在 Vue 组件中使用

```vue
<template>
  <t-select v-model="databaseType" placeholder="选择数据库类型">
    <t-option
      v-for="option in databaseTypeOptions"
      :key="option.value"
      :value="option.value"
      :label="option.label"
    />
  </t-select>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { DatabaseType, DatabaseTypeUtils } from '@shared/types';

const databaseType = ref<DatabaseType>(DatabaseType.MySQL);
const databaseTypeOptions = DatabaseTypeUtils.getOptions();
</script>
```

### 8. 监听数据库类型变化，自动设置默认端口

```typescript
import { DatabaseTypeUtils } from '@shared/types';

function handleDatabaseTypeChange(type: string) {
  if (DatabaseTypeUtils.isValidType(type)) {
    const defaultPort = DatabaseTypeUtils.getDefaultPort(type);
    // 设置默认端口
  }
}
```

### 9. 在后端使用

```typescript
import { DatabaseType } from '@shared/types';

export class DatabaseAdapterFactory {
  static createAdapter(type: DatabaseType): DatabaseAdapter {
    switch (type) {
      case DatabaseType.MySQL:
        return new MySQLAdapter();
      case DatabaseType.PostgreSQL:
        return new PostgreSQLAdapter();
      case DatabaseType.Oracle:
        return new OracleAdapter();
      case DatabaseType.SqlServer:
        return new SQLServerAdapter();
      default:
        throw new Error('Unsupported database type');
    }
  }
}
```

## 数据库类型映射表

| 枚举值                    | 字符串值       | 中文名称   | 默认端口 |
| ------------------------- | -------------- | ---------- | -------- |
| `DatabaseType.MySQL`      | `'mysql'`      | MySQL      | 3306     |
| `DatabaseType.PostgreSQL` | `'postgresql'` | PostgreSQL | 5432     |
| `DatabaseType.Oracle`     | `'oracle'`     | Oracle     | 1521     |
| `DatabaseType.SqlServer`  | `'sqlserver'`  | SQL Server | 1433     |

## 注意事项

1. **类型安全**: 使用 `DatabaseType` 枚举而不是字符串字面量，可以避免拼写错误
2. **自动补全**: IDE 会提供完整的枚举值列表和自动补全
3. **重构友好**: 如果需要修改枚举值，IDE 会自动更新所有引用
4. **类型检查**: TypeScript 会在编译时检查类型错误

## 迁移指南

如果你之前使用的是字符串字面量：

### 旧代码

```typescript
type: 'mysql' | 'postgresql' | 'oracle' | 'sqlserver';
```

### 新代码

```typescript
import { DatabaseType } from '@shared/types';

type: DatabaseType;
```

所有使用该类型的地方都需要更新为使用枚举值：

```typescript
// 旧代码
connection.type = 'mysql';

// 新代码
import { DatabaseType } from '@shared/types';
connection.type = DatabaseType.MySQL;
```
