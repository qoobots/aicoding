# ProgrammingLanguage 枚举使用文档

## 枚举定义

```typescript
export enum ProgrammingLanguage {
  Java = 'java',
  Go = 'go',
  Python = 'python',
  TypeScript = 'typescript',
  Rust = 'rust',
}
```

## 使用方法

### 1. 在类型定义中使用

```typescript
import { ProgrammingLanguage } from '@shared/types';

interface Project {
  name: string;
  language: ProgrammingLanguage;
  // 其他字段...
}
```

### 2. 获取所有编程语言

```typescript
import { ProgrammingLanguageUtils } from '@shared/types';

const allLanguages = ProgrammingLanguageUtils.getAllLanguages();
// 返回: [
//   ProgrammingLanguage.Java,
//   ProgrammingLanguage.Go,
//   ProgrammingLanguage.Python,
//   ProgrammingLanguage.TypeScript,
//   ProgrammingLanguage.Rust
// ]
```

### 3. 获取编程语言选项（用于下拉选择）

```typescript
import { ProgrammingLanguageUtils } from '@shared/types';

const options = ProgrammingLanguageUtils.getOptions();
// 返回: [
//   { label: 'Java', value: ProgrammingLanguage.Java, icon: '☕' },
//   { label: 'Go', value: ProgrammingLanguage.Go, icon: '🐹' },
//   { label: 'Python', value: ProgrammingLanguage.Python, icon: '🐍' },
//   { label: 'TypeScript', value: ProgrammingLanguage.TypeScript, icon: '💎' },
//   { label: 'Rust', value: ProgrammingLanguage.Rust, icon: '🦀' }
// ]
```

### 4. 获取编程语言的中文名称

```typescript
import { ProgrammingLanguageUtils } from '@shared/types';

const displayName = ProgrammingLanguageUtils.getDisplayName(ProgrammingLanguage.Java);
// 返回: 'Java'
```

### 5. 获取编程语言的文件扩展名

```typescript
import { ProgrammingLanguageUtils } from '@shared/types';

const extension = ProgrammingLanguageUtils.getFileExtension(ProgrammingLanguage.Python);
// 返回: '.py'

const tsExtension = ProgrammingLanguageUtils.getFileExtension(ProgrammingLanguage.TypeScript);
// 返回: '.ts'
```

### 6. 获取编程语言的图标

```typescript
import { ProgrammingLanguageUtils } from '@shared/types';

const icon = ProgrammingLanguageUtils.getIcon(ProgrammingLanguage.Java);
// 返回: '☕'
```

### 7. 验证是否是有效的编程语言

```typescript
import { ProgrammingLanguageUtils } from '@shared/types';

const isValid = ProgrammingLanguageUtils.isValidLanguage('java');
// 返回: true

const isInvalid = ProgrammingLanguageUtils.isValidLanguage('invalid-language');
// 返回: false
```

### 8. 根据文件扩展名推断编程语言

```typescript
import { ProgrammingLanguageUtils } from '@shared/types';

const language = ProgrammingLanguageUtils.inferFromFileExtension('.java');
// 返回: ProgrammingLanguage.Java

const pythonLang = ProgrammingLanguageUtils.inferFromFileExtension('.py');
// 返回: ProgrammingLanguage.Python

const unknownLang = ProgrammingLanguageUtils.inferFromFileExtension('.unknown');
// 返回: null
```

### 9. 在 Vue 组件中使用

```vue
<template>
  <t-select v-model="language" placeholder="选择编程语言">
    <t-option
      v-for="option in languageOptions"
      :key="option.value"
      :value="option.value"
      :label="option.label"
    >
      <template #prefix>
        <span style="margin-right: 8px">{{ option.icon }}</span>
      </template>
    </t-option>
  </t-select>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ProgrammingLanguage, ProgrammingLanguageUtils } from '@shared/types';

const language = ref<ProgrammingLanguage>(ProgrammingLanguage.Java);
const languageOptions = ProgrammingLanguageUtils.getOptions();
</script>
```

### 10. 代码生成器中使用

```typescript
import { ProgrammingLanguage, ProgrammingLanguageUtils } from '@shared/types';

export class CodeGenerator {
  generateCode(language: ProgrammingLanguage): string {
    const extension = ProgrammingLanguageUtils.getFileExtension(language);

    switch (language) {
      case ProgrammingLanguage.Java:
        return this.generateJavaCode();
      case ProgrammingLanguage.Go:
        return this.generateGoCode();
      case ProgrammingLanguage.Python:
        return this.generatePythonCode();
      case ProgrammingLanguage.TypeScript:
        return this.generateTypeScriptCode();
      case ProgrammingLanguage.Rust:
        return this.generateRustCode();
    }
  }

  getFileName(className: string, language: ProgrammingLanguage): string {
    const extension = ProgrammingLanguageUtils.getFileExtension(language);
    return `${className}${extension}`;
  }
}
```

### 11. 文件上传时自动识别语言

```typescript
import { ProgrammingLanguageUtils } from '@shared/types';

function handleFileUpload(file: File) {
  const ext = '.' + file.name.split('.').pop();
  const language = ProgrammingLanguageUtils.inferFromFileExtension(ext);

  if (language) {
    console.log(`检测到 ${ProgrammingLanguageUtils.getDisplayName(language)} 文件`);
  } else {
    console.log('未知的文件类型');
  }
}
```

### 12. 项目创建向导

```typescript
import { ProgrammingLanguage, ProgrammingLanguageUtils } from '@shared/types';

interface CreateProjectForm {
  name: string;
  language: ProgrammingLanguage;
  description?: string;
}

const languageOptions = ProgrammingLanguageUtils.getOptions().map((opt) => ({
  label: `${opt.icon} ${opt.label}`,
  value: opt.value,
}));

// 在表单中使用
const form = reactive<CreateProjectForm>({
  name: '',
  language: ProgrammingLanguage.Java,
  description: '',
});
```

## 编程语言映射表

| 枚举值                           | 字符串值       | 中文名称   | 文件扩展名     | 图标 |
| -------------------------------- | -------------- | ---------- | -------------- | ---- |
| `ProgrammingLanguage.Java`       | `'java'`       | Java       | `.java`        | ☕   |
| `ProgrammingLanguage.Go`         | `'go'`         | Go         | `.go`          | 🐹   |
| `ProgrammingLanguage.Python`     | `'python'`     | Python     | `.py`          | 🐍   |
| `ProgrammingLanguage.TypeScript` | `'typescript'` | TypeScript | `.ts` / `.tsx` | 💎   |
| `ProgrammingLanguage.Rust`       | `'rust'`       | Rust       | `.rs`          | 🦀   |

## 实际应用场景

### 场景 1: 项目列表显示

```vue
<template>
  <t-table :data="projects" :columns="columns">
    <template #language="{ row }">
      <t-tag :icon="getLanguageIcon(row.language)">
        {{ getLanguageName(row.language) }}
      </t-tag>
    </template>
  </t-table>
</template>

<script setup lang="ts">
import { ProgrammingLanguageUtils } from '@shared/types';

function getLanguageName(language: ProgrammingLanguage): string {
  return ProgrammingLanguageUtils.getDisplayName(language);
}

function getLanguageIcon(language: ProgrammingLanguage): string {
  return ProgrammingLanguageUtils.getIcon(language);
}
</script>
```

### 场景 2: 代码编辑器语言高亮

```typescript
import { ProgrammingLanguage, ProgrammingLanguageUtils } from '@shared/types';

import * as monaco from 'monaco-editor';

function setupEditor(monacoInstance: typeof monaco, language: ProgrammingLanguage) {
  const languageMap: Record<ProgrammingLanguage, string> = {
    [ProgrammingLanguage.Java]: 'java',
    [ProgrammingLanguage.Go]: 'go',
    [ProgrammingLanguage.Python]: 'python',
    [ProgrammingLanguage.TypeScript]: 'typescript',
    [ProgrammingLanguage.Rust]: 'rust',
  };

  const editorLanguage = languageMap[language] || 'plaintext';

  monacoInstance.editor.create(container, {
    language: editorLanguage,
    theme: 'vs-dark',
  });
}
```

### 场景 3: 代码模板选择

```typescript
import { ProgrammingLanguage } from '@shared/types';

const templateMap: Record<ProgrammingLanguage, string> = {
  [ProgrammingLanguage.Java]: 'spring-boot-entity',
  [ProgrammingLanguage.Go]: 'go-gin-entity',
  [ProgrammingLanguage.Python]: 'fastapi-entity',
  [ProgrammingLanguage.TypeScript]: 'nestjs-entity',
  [ProgrammingLanguage.Rust]: 'actix-entity',
};

function getTemplate(language: ProgrammingLanguage): string {
  return templateMap[language] || 'default-entity';
}
```

## 注意事项

1. **类型安全**: 使用 `ProgrammingLanguage` 枚举而不是字符串字面量
2. **自动补全**: IDE 会提供完整的枚举值列表
3. **重构友好**: 如果需要修改枚举值，IDE 会自动更新所有引用
4. **类型检查**: TypeScript 会在编译时检查类型错误
5. **文件扩展名**: 使用 `getFileExtension()` 方法确保文件扩展名正确

## 迁移指南

### 旧代码

```typescript
type: string;
```

### 新代码

```typescript
import { ProgrammingLanguage } from '@shared/types';

type: ProgrammingLanguage;
```

所有使用该类型的地方都需要更新为使用枚举值：

```typescript
// 旧代码
project.type = 'java';

// 新代码
import { ProgrammingLanguage } from '@shared/types';
project.type = ProgrammingLanguage.Java;
```

## 最佳实践

1. **始终使用枚举值**: 不要使用字符串字面量
2. **使用工具方法**: 利用 `ProgrammingLanguageUtils` 提供的辅助方法
3. **类型守卫**: 使用 `isValidLanguage()` 方法进行类型检查
4. **一致性**: 在整个项目中保持使用相同的枚举定义
5. **文档**: 为新加入的开发者提供使用文档
