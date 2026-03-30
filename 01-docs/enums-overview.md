# 项目枚举类型概览

本项目在 `packages/shared-types/src/index.ts` 中定义了多个类型安全的枚举，用于前后端共享。

## 已定义的枚举

### 1. DatabaseType（数据库类型枚举）

**定义位置**: `packages/shared-types/src/index.ts`

**枚举值**:

```typescript
export enum DatabaseType {
  MySQL = 'mysql',
  PostgreSQL = 'postgresql',
  Oracle = 'oracle',
  SqlServer = 'sqlserver',
}
```

**使用场景**:

- 数据库连接配置
- 代码生成配置
- 数据库适配器选择

**辅助工具**: `DatabaseTypeUtils`

- `getDisplayName()` - 获取中文名称
- `getDefaultPort()` - 获取默认端口
- `getAllTypes()` - 获取所有类型
- `getOptions()` - 获取选项数组（用于下拉选择）
- `isValidType()` - 验证类型有效性

**文档**: [database-type-enum.md](./database-type-enum.md)

---

### 2. ProgrammingLanguage（编程语言枚举）

**定义位置**: `packages/shared-types/src/index.ts`

**枚举值**:

```typescript
export enum ProgrammingLanguage {
  Java = 'java',
  Go = 'go',
  Python = 'python',
  TypeScript = 'typescript',
  Rust = 'rust',
}
```

**使用场景**:

- 项目类型定义
- 代码生成配置
- 文件语言识别
- 编辑器语言高亮

**辅助工具**: `ProgrammingLanguageUtils`

- `getDisplayName()` - 获取中文名称
- `getFileExtension()` - 获取文件扩展名
- `getIcon()` - 获取语言图标
- `getAllLanguages()` - 获取所有语言
- `getOptions()` - 获取选项数组
- `isValidLanguage()` - 验证语言有效性
- `inferFromFileExtension()` - 根据文件扩展名推断语言

**文档**: [programming-language-enum.md](./programming-language-enum.md)

---

## 如何使用这些枚举

### 在 TypeScript 中使用

```typescript
import {
  DatabaseType,
  ProgrammingLanguage,
  DatabaseTypeUtils,
  ProgrammingLanguageUtils,
} from '@shared/types';

// 定义接口
interface DatabaseConnection {
  type: DatabaseType;
  port: number;
}

interface Project {
  language: ProgrammingLanguage;
  name: string;
}

// 使用枚举值
const connection: DatabaseConnection = {
  type: DatabaseType.MySQL,
  port: DatabaseTypeUtils.getDefaultPort(DatabaseType.MySQL),
};

const project: Project = {
  language: ProgrammingLanguage.Java,
  name: 'MyProject',
};
```

### 在 Vue 组件中使用

```vue
<template>
  <div>
    <!-- 数据库类型选择 -->
    <t-select v-model="dbType" placeholder="选择数据库类型">
      <t-option
        v-for="option in DatabaseTypeUtils.getOptions()"
        :key="option.value"
        :value="option.value"
        :label="option.label"
      />
    </t-select>

    <!-- 编程语言选择 -->
    <t-select v-model="language" placeholder="选择编程语言">
      <t-option
        v-for="option in ProgrammingLanguageUtils.getOptions()"
        :key="option.value"
        :value="option.value"
        :label="`${option.icon} ${option.label}`"
      />
    </t-select>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  DatabaseType,
  ProgrammingLanguage,
  DatabaseTypeUtils,
  ProgrammingLanguageUtils,
} from '@shared/types';

const dbType = ref<DatabaseType>(DatabaseType.MySQL);
const language = ref<ProgrammingLanguage>(ProgrammingLanguage.Java);
</script>
```

### 在后端使用

```typescript
import { DatabaseType, ProgrammingLanguage } from '@shared/types';

@Controller('databases')
export class DatabaseController {
  @Post('connect')
  async connect(@Body() connection: { type: DatabaseType; host: string; port: number }) {
    switch (connection.type) {
      case DatabaseType.MySQL:
        return this.connectMySQL(connection);
      case DatabaseType.PostgreSQL:
        return this.connectPostgreSQL(connection);
      // ...
    }
  }
}

@Controller('projects')
export class ProjectController {
  @Post('generate')
  async generate(@Body() config: { language: ProgrammingLanguage; tableName: string }) {
    switch (config.language) {
      case ProgrammingLanguage.Java:
        return this.generateJavaCode(config);
      case ProgrammingLanguage.Go:
        return this.generateGoCode(config);
      // ...
    }
  }
}
```

---

## 添加新的枚举

如果需要添加新的枚举类型，请遵循以下步骤：

### 1. 定义枚举

在 `packages/shared-types/src/index.ts` 中添加枚举定义：

```typescript
/**
 * 新枚举描述
 */
export enum NewEnum {
  Value1 = 'value1',
  Value2 = 'value2',
  Value3 = 'value3',
}
```

### 2. 创建辅助工具类

```typescript
/**
 * 新枚举辅助类
 */
export class NewEnumUtils {
  static getDisplayName(value: NewEnum): string {
    const displayNames: Record<NewEnum, string> = {
      [NewEnum.Value1]: '值1',
      [NewEnum.Value2]: '值2',
      [NewEnum.Value3]: '值3',
    };
    return displayNames[value] || value;
  }

  static getAllValues(): NewEnum[] {
    return Object.values(NewEnum);
  }

  static getOptions(): Array<{ label: string; value: NewEnum }> {
    return this.getAllValues().map((val) => ({
      label: this.getDisplayName(val),
      value: val,
    }));
  }

  static isValidValue(value: string): value is NewEnum {
    return Object.values(NewEnum).includes(value as NewEnum);
  }
}
```

### 3. 在类型定义中使用

```typescript
export interface SomeInterface {
  enumField: NewEnum;
}
```

### 4. 更新文档

在 `01-docs/` 目录中创建对应的文档文件，说明枚举的用途和使用方法。

### 5. 编译共享类型包

```bash
pnpm --filter @shared/types build
```

---

## 枚举设计原则

1. **字符串枚举**: 使用字符串值而不是数字，便于序列化和调试
2. **工具方法**: 每个枚举都应该有对应的 `Utils` 工具类
3. **类型安全**: 使用类型守卫函数确保类型安全
4. **一致性**: 枚举值使用小写或驼峰命名，保持一致性
5. **文档完整**: 每个枚举都应该有详细的使用文档

---

## 常见问题

### Q: 为什么不直接使用字符串字面量？

A: 枚举提供了类型安全、自动补全、重构友好等优势。

### Q: 如何添加新的枚举值？

A: 在枚举定义中添加新值，并更新工具类中的映射表。

### Q: 枚举值可以修改吗？

A: 可以，但需要注意向后兼容性。建议通过版本管理来处理。

### Q: 如何处理未知的枚举值？

A: 使用工具类的 `isValid*()` 方法进行验证，并提供默认值。

---

## 参考文档

- [database-type-enum.md](./database-type-enum.md) - 数据库类型枚举详细文档
- [programming-language-enum.md](./programming-language-enum.md) - 编程语言枚举详细文档
- TypeScript Enums: https://www.typescriptlang.org/docs/handbook/enums.html
