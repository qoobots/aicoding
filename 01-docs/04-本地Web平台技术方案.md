# AI编程平台技术方案

---

## 最终技术方案确定

### 技术栈

- **桌面框架**: Electron (跨平台桌面应用)
- **后端**: NestJS (Node.js + TypeScript)
- **前端**: Vue 3 + TypeScript
- **UI组件库**: TDesign
- **代码编辑器**: Monaco Editor
- **元数据存储**: SQLite
- **文件存储**: 本地文件系统

### 生成的1000个项目技术栈

- **后端**: Java Spring Boot 3.x + Spring Cloud 2023.x
- **前端**: Vue 3 + TypeScript + TDesign
- **数据库**: PostgreSQL + Redis

---

## 技术架构

### 架构设计

```
┌─────────────────────────────────────────────────┐
│         Electron 桌面应用                       │
│  ┌─────────────────────────────────────────┐  │
│  │  主进程 (Node.js 环境)                  │  │
│  │  - 管理 NestJS 后端服务                  │  │
│  │  - 管理应用窗口                          │  │
│  │  - 文件系统访问                          │  │
│  └─────────────────────────────────────────┘  │
│  ┌─────────────────────────────────────────┐  │
│  │  渲染进程 (Chromium)                     │  │
│  │  - Vue 3 + TDesign 前端                  │  │
│  │  - Monaco Editor 代码编辑器             │  │
│  │  - IPC 通信                              │  │
│  └─────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────┐
│         NestJS 后端服务                        │
│  - REST API                                    │
│  - AI 代码生成逻辑                              │
│  - Java 代码模板引擎                            │
│  - 业务逻辑处理                                 │
└─────────────────┬───────────────────────────────┘
                  ↓
        ┌─────────┴─────────┐
        ↓                   ↓
┌───────────────┐   ┌───────────────┐
│   SQLite      │   │  文件系统     │
│  (元数据存储) │   │ (代码文件)    │
│ - 项目配置    │   │ - 生成代码    │
│ - AI记录      │   │ - 模板文件    │
│ - 用户偏好    │   │ - 缓存文件    │
│ - 操作日志    │   │ - 日志文件    │
└───────────────┘   └───────────────┘
```

---

## 技术栈选择

### 前端技术栈

#### 框架: Vue 3 + TypeScript

**选择理由**:

- Vue 3 性能优秀,组合式API更灵活
- TypeScript保证代码质量
- 与TDesign组件库集成完美
- 国内生态成熟,中文文档完善

**核心依赖**:

```json
{
  "vue": "^3.4.0",
  "typescript": "^5.0.0",
  "vite": "^5.0.0",
  "@vitejs/plugin-vue": "^5.0.0",
  "vue-router": "^4.2.0",
  "pinia": "^2.1.0"
}
```

#### UI组件库: TDesign (腾讯)

**选择理由**:

- 企业级UI组件库,设计规范完整
- Vue 3组件丰富,类型完善
- 中文文档友好,国内社区活跃
- 与Vue 3集成完美

**核心依赖**:

```json
{
  "tdesign-vue-next": "^1.9.0"
}
```

#### 代码编辑器: Monaco Editor

**选择理由**:

- VS Code内核,开发者熟悉
- 功能强大,支持多种语言
- 可高度定制
- TypeScript原生支持

**核心配置**:

```typescript
import * as monaco from 'monaco-editor';

const editor = monaco.editor.create(container, {
  value: '',
  language: 'typescript',
  theme: 'vs-dark',
  minimap: { enabled: true },
  fontSize: 14,
  lineNumbers: 'on',
  scrollBeyondLastLine: false,
  automaticLayout: true,
});
```

#### 状态管理: Pinia

**选择理由**:

- Vue 3官方推荐的状态管理库
- TypeScript支持优秀
- API简洁,易于使用
- 支持DevTools调试

**示例**:

```typescript
import { defineStore } from 'pinia';

interface EditorState {
  code: string;
  setCode: (code: string) => void;
}

export const useEditorStore = defineStore('editor', {
  state: () => ({
    code: '',
  }),
  actions: {
    setCode(code: string) {
      this.code = code;
    },
  },
});
```

#### 实时协作: Yjs

**选择理由**:

- CRDT算法,自动冲突解决
- 支持离线编辑
- 性能优秀
- 可集成到Monaco Editor

---

### 后端技术栈

#### 框架: NestJS (Node.js) - AI编程平台后端

**选择理由**:

- TypeScript全栈,类型安全
- 架构优雅,模块化设计
- 依赖注入,易于测试
- 企业级应用首选
- 快速开发和迭代

**核心依赖**:

```json
{
  "@nestjs/common": "^10.0.0",
  "@nestjs/core": "^10.0.0",
  "@nestjs/platform-express": "^10.0.0",
  "@nestjs/config": "^3.0.0",
  "@nestjs/typeorm": "^10.0.0",
  "typeorm": "^0.3.0",
  "class-validator": "^0.14.0",
  "class-transformer": "^0.5.0"
}
```

---

#### 1000个生成项目: Java Spring Boot + Spring Cloud 微服务架构

**技术栈选择**:

**Spring Boot 3.x**:

- 企业级Java框架的首选
- 成熟稳定,生态完善
- 丰富的开箱即用特性
- 企业信任度高

**Spring Cloud 2023.x** (微服务治理):

- 服务注册与发现 (Eureka/Nacos)
- 配置中心 (Spring Cloud Config/Nacos)
- 服务调用 (OpenFeign)
- 熔断降级 (Sentinel/Resilience4j)
- 网关 (Spring Cloud Gateway)
- 链路追踪 (Sleuth + Zipkin/Micrometer Tracing)

**Spring Data JPA**:

- ORM框架,简化数据库操作
- 支持多种数据库
- 强大的查询能力

**核心依赖**:

```xml
<!-- pom.xml -->
<dependencies>
    <!-- Spring Boot -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>

    <!-- Spring Cloud -->
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-openfeign</artifactId>
    </dependency>

    <!-- 数据库 -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>

    <!-- PostgreSQL驱动 -->
    <dependency>
        <groupId>org.postgresql</groupId>
        <artifactId>postgresql</artifactId>
    </dependency>

    <!-- Redis -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-redis</artifactId>
    </dependency>

    <!-- Lombok -->
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <optional>true</optional>
    </dependency>

    <!-- 文档 -->
    <dependency>
        <groupId>org.springdoc</groupId>
        <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    </dependency>
</dependencies>

<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-dependencies</artifactId>
            <version>2023.0.0</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>
```

---

#### 数据库: PostgreSQL

**选择理由**:

- 开源、稳定、功能强大
- 支持复杂查询
- 事务处理能力强
- 适合企业应用
- 与Java Spring Boot集成良好

**备选**: MySQL

- 传统企业应用首选
- 生态成熟
- 社区活跃

---

#### 缓存: Redis

**选择理由**:

- 性能优秀
- 支持多种数据结构
- 可用于会话管理
- 可用于消息队列
- Spring Data Redis集成完善

---

#### ORM: Spring Data JPA / MyBatis-Plus

**Spring Data JPA** (推荐):

- Spring官方推荐
- 约定优于配置
- 开发效率高
- 类型安全

**MyBatis-Plus** (备选):

- SQL灵活
- 国内使用广泛
- 性能优异
- 插件丰富

---

### AI服务层

#### 方案1: 调用云端AI API (推荐)

**OpenAI API**:

```typescript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: 'https://api.openai.com/v1',
});

const response = await openai.chat.completions.create({
  model: 'gpt-4-turbo-preview',
  messages: [
    { role: 'system', content: '你是一个AI编程助手' },
    { role: 'user', content: '生成一个用户管理模块' },
  ],
});
```

**Claude API (备选)**:

```typescript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const response = await anthropic.messages.create({
  model: 'claude-3-opus-20240229',
  max_tokens: 4096,
  messages: [{ role: 'user', content: '生成一个用户管理模块' }],
});
```

**国内API (备选)**:

- 通义千问
- 文心一言
- 智谱AI

#### 方案2: 本地部署开源模型 (未来)

**Ollama**:

```bash
# 安装Ollama
curl https://ollama.ai/install.sh | sh

# 下载模型
ollama pull codellama:34b

# 运行模型
ollama run codellama:34b
```

**调用本地模型**:

```typescript
const response = await fetch('http://localhost:11434/api/generate', {
  method: 'POST',
  body: JSON.stringify({
    model: 'codellama:34b',
    prompt: '生成一个用户管理模块',
    stream: false,
  }),
});
```

**本地模型选择**:

- CodeLlama: Meta的代码生成模型
- DeepSeek Coder: 国产代码模型
- StarCoder: Hugging Face的代码模型

**权衡**:

- ✅ 离线可用,无需网络
- ✅ 数据安全,不依赖第三方
- ❌ 需要强大硬件(GPU)
- ❌ 模型能力不如GPT-4
- ❌ 模型更新和优化困难

---

## 本地部署方案

### 方案1: Node.js + npm (最简单)

**安装步骤**:

1. **安装Node.js**:

```bash
# 下载并安装 Node.js LTS
# 访问 https://nodejs.org/

# 验证安装
node --version
npm --version
```

2. **克隆项目**:

```bash
git clone https://github.com/your-org/ai-coding-platform.git
cd ai-coding-platform
```

3. **安装依赖**:

```bash
# 安装前端依赖
cd frontend
npm install

# 安装后端依赖
cd ../backend
npm install
```

4. **配置环境变量**:

```bash
# 创建 .env 文件
cp .env.example .env

# 编辑 .env
# DATABASE_URL=postgresql://user:password@localhost:5432/ai_coding
# OPENAI_API_KEY=sk-xxx
# REDIS_URL=redis://localhost:6379
```

5. **初始化数据库**:

```bash
# 安装 PostgreSQL
# Windows: https://www.postgresql.org/download/windows/

# 运行迁移
npm run migration:run

# 填充初始数据
npm run seed
```

6. **启动服务**:

```bash
# 启动后端
npm run start:dev

# 启动前端 (新终端)
cd frontend
npm run dev
```

7. **访问应用**:

```
打开浏览器访问: http://localhost:3000
```

---

### 方案2: Docker (推荐)

**Docker Compose配置**:

```yaml
# docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: ai-coding-postgres
    environment:
      POSTGRES_USER: aicoding
      POSTGRES_PASSWORD: aicoding123
      POSTGRES_DB: ai_coding
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - ai-coding-network

  redis:
    image: redis:7-alpine
    container_name: ai-coding-redis
    ports:
      - '6379:6379'
    volumes:
      - redis_data:/data
    networks:
      - ai-coding-network

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: ai-coding-backend
    environment:
      DATABASE_URL: postgresql://aicoding:aicoding123@postgres:5432/ai_coding
      REDIS_URL: redis://redis:6379
      OPENAI_API_KEY: ${OPENAI_API_KEY}
    ports:
      - '3001:3001'
    depends_on:
      - postgres
      - redis
    volumes:
      - ./backend:/app
      - /app/node_modules
    networks:
      - ai-coding-network

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: ai-coding-frontend
    ports:
      - '3000:3000'
    depends_on:
      - backend
    volumes:
      - ./frontend:/app
      - /app/node_modules
    networks:
      - ai-coding-network

volumes:
  postgres_data:
  redis_data:

networks:
  ai-coding-network:
    driver: bridge
```

**启动步骤**:

```bash
# 克隆项目
git clone https://github.com/your-org/ai-coding-platform.git
cd ai-coding-platform

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件,添加 OPENAI_API_KEY

# 启动所有服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 访问应用
# 打开浏览器访问: http://localhost:3000
```

**优势**:

- ✅ 一键启动,环境一致
- ✅ 隔离性好,不影响系统
- ✅ 易于迁移和部署
- ✅ 适合开发和测试

---

## Electron桌面应用架构 (最终方案)

### 架构设计

```
┌─────────────────────────────────────────────────┐
│         Electron 主进程 (Node.js 环境)          │
│  - 管理 NestJS 后端服务                          │
│  - 管理应用窗口                                  │
│  - 文件系统访问                                  │
│  - 系统托盘集成                                  │
└─────────────────┬───────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────┐
│         Electron 渲染进程 (Chromium)             │
│  - 加载 Vue 3 + TDesign 前端                    │
│  - Monaco Editor 代码编辑器                     │
│  - 用户界面交互                                 │
│  - 通过 IPC 与后端通信                          │
└─────────────────┬───────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────┐
│         NestJS 后端服务                        │
│  - 运行在本地端口 (如: 3001)                    │
│  - 提供 REST API                               │
│  - AI 代码生成逻辑                              │
│  - Java 代码模板引擎                            │
│  - PostgreSQL + Redis                          │
└─────────────────────────────────────────────────┘
```

### Monorepo项目结构

```
ai-coding-platform/
├── apps/
│   ├── electron/              # Electron主进程
│   │   ├── src/
│   │   │   ├── main.ts        # 主进程入口
│   │   │   ├── preload.ts     # 预加载脚本
│   │   │   └── ipc.ts         # IPC通信处理
│   │   ├── package.json
│   │   └── electron-builder.yml
│   │
│   ├── backend/               # NestJS后端
│   │   ├── src/
│   │   │   ├── modules/
│   │   │   │   ├── code-generator/  # 代码生成模块
│   │   │   │   ├── template/        # 模板管理
│   │   │   │   └── project/         # 项目管理
│   │   │   ├── common/
│   │   │   └── main.ts
│   │   ├── dist/                # 编译后的JS
│   │   └── package.json
│   │
│   └── frontend/              # Vue3前端
│       ├── src/
│       │   ├── components/
│       │   ├── views/
│       │   ├── stores/        # Pinia状态管理
│       │   └── main.ts
│       ├── dist/              # 打包后的静态资源
│       └── package.json
│
├── packages/
│   ├── shared-types/          # 共享TypeScript类型
│   │   ├── src/
│   │   │   ├── code.types.ts
│   │   │   └── project.types.ts
│   │   └── package.json
│   │
│   ├── java-templates/        # Java代码模板
│   │   ├── spring-boot/
│   │   │   ├── entity.hbs
│   │   │   ├── controller.hbs
│   │   │   ├── service.hbs
│   │   │   └── repository.hbs
│   │   ├── spring-cloud/
│   │   └── pom.xml
│   │   └── package.json
│   │
│   └── shared-utils/          # 共享工具函数
│       └── package.json
│
├── package.json               # 根package.json
├── pnpm-workspace.yaml        # Monorepo配置
├── tsconfig.json              # 根TypeScript配置
└── README.md
```

### Electron主进程配置

```typescript
// apps/electron/src/main.ts
import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { spawn } from 'child_process';

let nestjsProcess: any;
let mainWindow: BrowserWindow | null = null;

// 启动 NestJS 后端服务
async function startNestJS() {
  const backendPath = path.join(__dirname, '../backend/dist/main.js');

  nestjsProcess = spawn('node', [backendPath], {
    stdio: 'inherit',
    env: { ...process.env },
  });

  nestjsProcess.on('error', (err: Error) => {
    console.error('NestJS启动失败:', err);
  });

  // 等待后端启动完成 (3秒)
  await new Promise((resolve) => setTimeout(resolve, 3000));
  console.log('NestJS后端已启动');
}

// 创建主窗口
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1600,
    height: 1000,
    minWidth: 1200,
    minHeight: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
    },
    icon: path.join(__dirname, '../assets/icon.png'),
    show: false,
  });

  // 开发环境加载dev server,生产环境加载打包后的文件
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../frontend/dist/index.html'));
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// 应用启动
app.whenReady().then(async () => {
  await startNestJS();
  createWindow();
});

// 应用退出
app.on('quit', () => {
  if (nestjsProcess) {
    nestjsProcess.kill();
    console.log('NestJS后端已关闭');
  }
});

// macOS 特殊处理
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
```

### Electron预加载脚本

```typescript
// apps/electron/src/preload.ts
import { contextBridge, ipcRenderer } from 'electron';

// 暴露安全的API给渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
  // 生成代码
  generateCode: (prompt: string, options: any) =>
    ipcRenderer.invoke('generate-code', prompt, options),

  // 打开文件选择器
  selectDirectory: () => ipcRenderer.invoke('select-directory'),

  // 保存文件
  saveFile: (filePath: string, content: string) =>
    ipcRenderer.invoke('save-file', filePath, content),

  // 读取文件
  readFile: (filePath: string) => ipcRenderer.invoke('read-file', filePath),

  // 获取项目列表
  getProjects: () => ipcRenderer.invoke('get-projects'),

  // 打开外部链接
  openExternal: (url: string) => ipcRenderer.invoke('open-external', url),
});
```

### Electron IPC通信

```typescript
// apps/electron/src/ipc.ts
import { ipcMain, dialog } from 'electron';
import axios from 'axios';

// 注册IPC处理器
export function registerIPCHandlers() {
  // 生成代码
  ipcMain.handle('generate-code', async (event, prompt: string, options: any) => {
    try {
      // 调用NestJS后端API
      const response = await axios.post('http://localhost:3001/api/code/generate', {
        prompt,
        options,
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  // 选择目录
  ipcMain.handle('select-directory', async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory', 'createDirectory'],
    });
    return result.filePaths[0] || null;
  });

  // 保存文件
  ipcMain.handle('save-file', async (event, filePath: string, content: string) => {
    try {
      await fs.promises.writeFile(filePath, content, 'utf-8');
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  // 读取文件
  ipcMain.handle('read-file', async (event, filePath: string) => {
    try {
      const content = await fs.promises.readFile(filePath, 'utf-8');
      return { success: true, data: content };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  // 打开外部链接
  ipcMain.handle('open-external', async (event, url: string) => {
    const { shell } = require('electron');
    await shell.openExternal(url);
  });
}
```

### Vue3前端主配置

```typescript
// apps/frontend/src/main.ts
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import TDesign from 'tdesign-vue-next';
import App from './App.vue';
import router from './router';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(TDesign);

app.mount('#app');
```

### Monaco Editor集成

```vue
<!-- apps/frontend/src/components/CodeEditor.vue -->
<template>
  <div class="code-editor" ref="editorContainer"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import * as monaco from 'monaco-editor';

const props = defineProps<{
  modelValue: string;
  language?: string;
  theme?: string;
}>();

const emit = defineEmits(['update:modelValue']);

const editorContainer = ref<HTMLElement>();
let editor: monaco.editor.IStandaloneCodeEditor | null = null;

onMounted(() => {
  if (!editorContainer.value) return;

  editor = monaco.editor.create(editorContainer.value, {
    value: props.modelValue,
    language: props.language || 'java',
    theme: props.theme || 'vs-dark',
    fontSize: 14,
    lineNumbers: 'on',
    minimap: { enabled: true },
    automaticLayout: true,
    tabSize: 4,
    wordWrap: 'on',
  });

  editor.onDidChangeModelContent(() => {
    emit('update:modelValue', editor?.getValue() || '');
  });
});

onBeforeUnmount(() => {
  editor?.dispose();
});
</script>

<style scoped>
.code-editor {
  width: 100%;
  height: 100%;
}
</style>
```

### pnpm-workspace配置

```yaml
# pnpm-workspace.yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

### 根package.json配置

```json
{
  "name": "ai-coding-platform",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "pnpm --filter frontend dev",
    "dev:backend": "pnpm --filter backend start:dev",
    "dev:electron": "pnpm --filter electron dev",
    "build": "pnpm -r build",
    "build:frontend": "pnpm --filter frontend build",
    "build:backend": "pnpm --filter backend build",
    "build:electron": "pnpm --filter electron build",
    "electron": "electron-builder",
    "electron:win": "electron-builder --win",
    "electron:mac": "electron-builder --mac",
    "electron:linux": "electron-builder --linux"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0",
    "electron": "^28.0.0",
    "electron-builder": "^24.9.0"
  }
}
```

### electron-builder配置

```yaml
# apps/electron/electron-builder.yml
appId: com.aicoding.platform
productName: AI编程平台
directories:
  buildResources: build
  output: dist
files:
  - dist/**/*
  - ../backend/dist/**/*
  - ../frontend/dist/**/*
  - package.json
extraFiles:
  - from: ../backend/package.json
    to: ../backend/package.json
  - from: ../backend/node_modules
    to: ../backend/node_modules

win:
  target:
    - nsis
  icon: build/icon.ico

mac:
  target:
    - dmg
  icon: build/icon.icns

linux:
  target:
    - AppImage
  icon: build/icon.png
  category: Development
```

### 打包和分发

#### 开发流程

```bash
# 1. 安装依赖
pnpm install

# 2. 启动开发环境
pnpm dev                    # 启动前端
pnpm dev:backend            # 启动后端(新终端)
pnpm dev:electron           # 启动Electron(新终端)
```

#### 生产构建

```bash
# 1. 构建所有应用
pnpm build

# 2. 打包Electron应用
pnpm electron:win           # Windows
pnpm electron:mac           # macOS
pnpm electron:linux         # Linux

# 输出:
# dist/AI编程平台 Setup 1.0.0.exe (Windows, 约200MB)
# dist/AI编程平台-1.0.0.dmg (macOS, 约220MB)
# dist/AI编程平台-1.0.0.AppImage (Linux, 约200MB)
```

### 用户使用流程

```
1. 用户下载安装包
   ↓
2. 双击安装,安装到系统
   ↓
3. 启动应用
   ↓
4. Electron自动启动NestJS后端服务
   ↓
5. 加载Vue3前端界面
   ↓
6. 用户开始使用AI编程功能
   ↓
7. 生成的Java代码保存到本地
```

### 优势总结

| 特性         | Electron + NestJS + Vue3 |
| ------------ | ------------------------ |
| **用户体验** | ✅ 原生桌面应用体验      |
| **技术栈**   | ✅ 统一使用TypeScript    |
| **启动速度** | ✅ 快速启动(1-3秒)       |
| **内存占用** | ✅ 中等(200-500MB)       |
| **离线使用** | ✅ 完全离线可用          |
| **跨平台**   | ✅ Windows/macOS/Linux   |
| **文件访问** | ✅ 直接访问本地文件系统  |
| **系统集成** | ✅ 系统托盘、快捷方式    |
| **分发方式** | ✅ 安装包一键安装        |
| **更新机制** | ✅ 支持自动更新          |

---

## NestJS后端核心模块

### 代码生成模块

```typescript
// apps/backend/src/modules/code-generator/code-generator.module.ts
import { Module } from '@nestjs/common';
import { CodeGeneratorService } from './code-generator.service';
import { CodeGeneratorController } from './code-generator.controller';
import { TemplateModule } from '../template/template.module';
import { ProjectModule } from '../project/project.module';

@Module({
  imports: [TemplateModule, ProjectModule],
  controllers: [CodeGeneratorController],
  providers: [CodeGeneratorService],
  exports: [CodeGeneratorService],
})
export class CodeGeneratorModule {}
```

### Java代码生成服务

```typescript
// apps/backend/src/modules/code-generator/java-generator.service.ts
import { Injectable } from '@nestjs/common';
import * as Handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class JavaGeneratorService {
  private templates: Map<string, HandlebarsTemplateDelegate> = new Map();

  constructor() {
    this.loadTemplates();
  }

  private async loadTemplates() {
    const templateDir = path.join(__dirname, '../../../java-templates/spring-boot');

    const templateFiles = [
      'entity.hbs',
      'controller.hbs',
      'service.hbs',
      'repository.hbs',
      'dto.hbs',
      'mapper.hbs',
    ];

    for (const file of templateFiles) {
      const templatePath = path.join(templateDir, file);
      const templateContent = await fs.promises.readFile(templatePath, 'utf-8');
      this.templates.set(file, Handlebars.compile(templateContent));
    }
  }

  async generateEntity(config: any): Promise<string> {
    const template = this.templates.get('entity.hbs');
    if (!template) throw new Error('Template not found');

    return template(config);
  }

  async generateController(config: any): Promise<string> {
    const template = this.templates.get('controller.hbs');
    if (!template) throw new Error('Template not found');

    return template(config);
  }

  async generateService(config: any): Promise<string> {
    const template = this.templates.get('service.hbs');
    if (!template) throw new Error('Template not found');

    return template(config);
  }

  async generateRepository(config: any): Promise<string> {
    const template = this.templates.get('repository.hbs');
    if (!template) throw new Error('Template not found');

    return template(config);
  }

  async generateProjectStructure(projectConfig: ProjectConfig): Promise<void> {
    const { projectName, packageName, entities, modules } = projectConfig;

    // 创建项目目录结构
    const projectPath = path.join(process.cwd(), 'generated', projectName);
    await this.createDirectoryStructure(projectPath, packageName);

    // 生成实体类
    for (const entity of entities) {
      const entityCode = await this.generateEntity({
        packageName,
        className: entity.className,
        tableName: entity.tableName,
        fields: entity.fields,
      });

      await fs.promises.writeFile(
        path.join(
          projectPath,
          'src/main/java',
          packageName.replace(/\./g, '/'),
          'entity',
          `${entity.className}.java`
        ),
        entityCode
      );
    }

    // 生成Controller
    for (const entity of entities) {
      const controllerCode = await this.generateController({
        packageName,
        className: entity.className,
        entityName: entity.className.toLowerCase(),
      });

      await fs.promises.writeFile(
        path.join(
          projectPath,
          'src/main/java',
          packageName.replace(/\./g, '/'),
          'controller',
          `${entity.className}Controller.java`
        ),
        controllerCode
      );
    }

    // 生成Service
    for (const entity of entities) {
      const serviceCode = await this.generateService({
        packageName,
        className: entity.className,
      });

      await fs.promises.writeFile(
        path.join(
          projectPath,
          'src/main/java',
          packageName.replace(/\./g, '/'),
          'service',
          `${entity.className}Service.java`
        ),
        serviceCode
      );
    }

    // 生成Repository
    for (const entity of entities) {
      const repositoryCode = await this.generateRepository({
        packageName,
        className: entity.className,
      });

      await fs.promises.writeFile(
        path.join(
          projectPath,
          'src/main/java',
          packageName.replace(/\./g, '/'),
          'repository',
          `${entity.className}Repository.java`
        ),
        repositoryCode
      );
    }

    // 生成pom.xml
    const pomXml = await this.generatePomXml(projectConfig);
    await fs.promises.writeFile(path.join(projectPath, 'pom.xml'), pomXml);

    // 生成application.yml
    const applicationYml = await this.generateApplicationYml(projectConfig);
    await fs.promises.writeFile(
      path.join(projectPath, 'src/main/resources/application.yml'),
      applicationYml
    );
  }

  private async createDirectoryStructure(projectPath: string, packageName: string): Promise<void> {
    const packagePath = packageName.replace(/\./g, '/');

    const directories = [
      `src/main/java/${packagePath}`,
      `src/main/java/${packagePath}/entity`,
      `src/main/java/${packagePath}/controller`,
      `src/main/java/${packagePath}/service`,
      `src/main/java/${packagePath}/repository`,
      `src/main/java/${packagePath}/dto`,
      `src/main/java/${packagePath}/config`,
      `src/main/resources`,
      `src/test/java/${packagePath}`,
    ];

    for (const dir of directories) {
      await fs.promises.mkdir(path.join(projectPath, dir), { recursive: true });
    }
  }

  private async generatePomXml(config: ProjectConfig): Promise<string> {
    return `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.0</version>
        <relativePath/>
    </parent>

    <groupId>${config.packageName}</groupId>
    <artifactId>${config.projectName}</artifactId>
    <version>1.0.0</version>
    <name>${config.projectName}</name>
    <description>${config.description || 'Spring Boot Project'}</description>

    <properties>
        <java.version>17</java.version>
        <spring-cloud.version>2023.0.0</spring-cloud.version>
    </properties>

    <dependencies>
        <!-- Spring Boot Web -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <!-- Spring Data JPA -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>

        <!-- PostgreSQL Driver -->
        <dependency>
            <groupId>org.postgresql</groupId>
            <artifactId>postgresql</artifactId>
            <scope>runtime</scope>
        </dependency>

        <!-- Redis -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-redis</artifactId>
        </dependency>

        <!-- Spring Cloud OpenFeign -->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-openfeign</artifactId>
        </dependency>

        <!-- Lombok -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>

        <!-- SpringDoc OpenAPI -->
        <dependency>
            <groupId>org.springdoc</groupId>
            <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
            <version>2.3.0</version>
        </dependency>

        <!-- Validation -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>

        <!-- Spring Boot DevTools -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-devtools</artifactId>
            <scope>runtime</scope>
            <optional>true</optional>
        </dependency>

        <!-- Spring Boot Test -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>org.springframework.cloud</groupId>
                <artifactId>spring-cloud-dependencies</artifactId>
                <version>\${spring-cloud.version}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <excludes>
                        <exclude>
                            <groupId>org.projectlombok</groupId>
                            <artifactId>lombok</artifactId>
                        </exclude>
                    </excludes>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>`;
  }

  private async generateApplicationYml(config: ProjectConfig): Promise<string> {
    return `server:
  port: ${config.port || 8080}

spring:
  application:
    name: ${config.projectName}

  datasource:
    url: jdbc:postgresql://localhost:5432/${config.projectName}
    username: ${config.database?.username || 'postgres'}
    password: ${config.database?.password || 'password'}
    driver-class-name: org.postgresql.Driver

  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
    properties:
      hibernate:
        format_sql: true
        dialect: org.hibernate.dialect.PostgreSQLDialect

  data:
    redis:
      host: localhost
      port: 6379

  cloud:
    openfeign:
      client:
        config:
          default:
            connectTimeout: 5000
            readTimeout: 5000

springdoc:
  api-docs:
    path: /api-docs
  swagger-ui:
    path: /swagger-ui.html

logging:
  level:
    root: INFO
    ${config.packageName}: DEBUG`;
  }
}

interface ProjectConfig {
  projectName: string;
  packageName: string;
  description?: string;
  port?: number;
  database?: {
    username: string;
    password: string;
  };
  entities: EntityConfig[];
  modules?: string[];
}

interface EntityConfig {
  className: string;
  tableName: string;
  fields: FieldConfig[];
}

interface FieldConfig {
  name: string;
  type: string;
  comment?: string;
}
```

---

## 开发工作流

### 1. 项目初始化

```bash
# 克隆项目
git clone https://github.com/your-org/ai-coding-platform.git
cd ai-coding-platform

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件

# 启动数据库
docker-compose up -d postgres redis

# 运行迁移
npm run migration:run

# 启动开发服务器
npm run dev
```

### 2. 日常开发

```bash
# 启动后端 (终端1)
cd backend
npm run start:dev

# 启动前端 (终端2)
cd frontend
npm run dev

# 访问应用
# http://localhost:3000
```

### 3. 批量生成项目

```bash
# 使用CLI工具批量生成
node scripts/generate-project.js \
  --template full-stack \
  --count 10 \
  --output ./generated-projects
```

---

## AI服务配置

### 配置OpenAI API

```bash
# .env 文件
OPENAI_API_KEY=sk-xxxxxxxxxxxx
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-4-turbo-preview
```

### 配置国内API

```bash
# 通义千问
QWEN_API_KEY=sk-xxxxxxxxxxxx
QWEN_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1

# 文心一言
ERNIE_API_KEY=sk-xxxxxxxxxxxx
ERNIE_SECRET_KEY=xxxxxxxxxxxx
```

---

## 数据存储

### 项目文件存储

**本地文件系统**:

```
~/ai-coding-platform/projects/
├── project-1/
│   ├── frontend/
│   ├── backend/
│   ├── database/
│   └── README.md
├── project-2/
└── ...
```

**优势**:

- ✅ 完全本地化,安全可控
- ✅ 无需网络访问
- ✅ 可直接用Git管理

### 数据库存储

**PostgreSQL数据**:

```sql
-- 项目表
CREATE TABLE projects (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  template VARCHAR(100),
  status VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 代码表
CREATE TABLE codes (
  id UUID PRIMARY KEY,
  project_id UUID REFERENCES projects(id),
  file_path VARCHAR(500),
  content TEXT,
  language VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

-- 生成记录表
CREATE TABLE generations (
  id UUID PRIMARY KEY,
  project_id UUID REFERENCES projects(id),
  prompt TEXT,
  response TEXT,
  tokens_used INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 性能优化

### 前端优化

1. **代码分割**: 使用React.lazy和Suspense
2. **虚拟滚动**: 处理大量项目列表
3. **缓存策略**: 使用Service Worker缓存静态资源
4. **懒加载**: 组件和路由懒加载

### 后端优化

1. **数据库索引**: 为常用查询添加索引
2. **查询优化**: 使用N+1查询优化
3. **缓存**: Redis缓存热点数据
4. **异步处理**: 使用消息队列处理耗时任务

---

## 安全性

### 数据安全

1. **加密存储**: 敏感信息加密存储
2. **访问控制**: 基于角色的访问控制(RBAC)
3. **审计日志**: 记录所有操作日志
4. **备份**: 定期备份数据库和项目文件

### API安全

1. **认证**: JWT认证
2. **限流**: API限流防止滥用
3. **验证**: 输入验证和参数校验
4. **HTTPS**: 生产环境使用HTTPS(可选)

---

## 未来扩展

### 混合部署

```
本地Web平台 ←→ 云端服务
    ↓               ↓
本地项目文件    云端AI服务
本地数据库      云端协作
```

### 云端化

1. **部署到云端**: 使用Docker部署到阿里云/腾讯云
2. **SaaS化**: 支持多用户和团队协作
3. **数据同步**: 本地和云端数据同步
4. **混合模式**: 本地开发 + 云端协作

---

## 开发和部署流程

### 开发环境启动

```bash
# 1. 克隆项目
git clone https://github.com/your-org/ai-coding-platform.git
cd ai-coding-platform

# 2. 安装依赖 (使用pnpm)
pnpm install

# 3. 启动数据库 (PostgreSQL + Redis)
docker-compose up -d postgres redis

# 4. 配置环境变量
cp .env.example .env
# 编辑.env文件,配置数据库和AI API密钥

# 5. 启动开发环境
# 终端1: 启动前端
pnpm dev

# 终端2: 启动后端
pnpm dev:backend

# 终端3: 启动Electron
pnpm dev:electron
```

### 生产环境构建

```bash
# 1. 构建所有应用
pnpm build

# 2. 打包Electron应用
pnpm electron:win           # Windows
pnpm electron:mac           # macOS
pnpm electron:linux         # Linux
```

### 用户安装和使用

```
1. 用户下载安装包 (AI编程平台 Setup 1.0.0.exe)
2. 双击安装,安装到系统
3. 桌面出现"AI编程平台"快捷方式
4. 双击启动应用
5. Electron自动启动NestJS后端服务
6. 加载Vue3前端界面
7. 用户开始使用AI编程功能
```

---

## 数据持久化方案 (混合方案: SQLite + 文件系统)

### 持久化策略

采用**混合持久化方案**,根据数据特点选择最适合的存储方式:

| 数据类型           | 存储方式 | 理由                               |
| ------------------ | -------- | ---------------------------------- |
| **项目元数据**     | SQLite   | 配置、状态、历史记录需要查询和事务 |
| **生成的代码文件** | 文件系统 | 大文件存储,便于版本控制和直接访问  |
| **模板文件**       | 文件系统 | 便于编辑和管理                     |
| **AI生成记录**     | SQLite   | 需要查询、统计和历史追溯           |
| **用户偏好设置**   | SQLite   | 频繁读写,需要持久化                |
| **缓存数据**       | 文件系统 | 临时数据,可随时删除                |

### 目录结构

```
~/ai-coding-platform/
├── data/
│   ├── database.db          # SQLite数据库(元数据)
│   ├── projects/            # 项目代码文件
│   │   ├── project-1/
│   │   │   ├── config.json  # 项目配置
│   │   │   ├── backend/     # 生成的Java代码
│   │   │   └── frontend/    # 生成的Vue3代码
│   │   └── project-2/
│   ├── templates/           # 模板文件
│   │   ├── spring-boot/    # Java模板
│   │   └── vue3/           # Vue3模板
│   └── cache/              # 缓存目录
│       └── ai-responses/   # AI响应缓存
└── logs/
    └── app.log            # 应用日志
```

### SQLite 数据库设计

#### 数据库表结构

```sql
-- 项目表
CREATE TABLE projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  template_type TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  config TEXT,               -- JSON配置
  project_path TEXT,         -- 项目文件路径
  created_at INTEGER,        -- Unix时间戳
  updated_at INTEGER
);

-- 代码文件表
CREATE TABLE code_files (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  file_path TEXT NOT NULL,
  content TEXT,              -- 小文件内容直接存储
  file_hash TEXT,            -- 文件哈希,用于去重
  language TEXT,
  file_size INTEGER,
  created_at INTEGER,
  updated_at INTEGER,
  UNIQUE(project_id, file_path)
);

-- AI生成记录表
CREATE TABLE ai_generations (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  prompt TEXT NOT NULL,
  response TEXT,
  model TEXT,
  tokens_used INTEGER,
  status TEXT DEFAULT 'success',
  error_message TEXT,
  metadata TEXT,             -- JSON格式的额外信息
  created_at INTEGER
);

-- 模板表
CREATE TABLE templates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,       -- spring-boot, vue3, etc.
  category TEXT,
  version TEXT,
  description TEXT,
  file_path TEXT,          -- 模板文件路径
  created_at INTEGER,
  updated_at INTEGER
);

-- 用户偏好设置表
CREATE TABLE user_preferences (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  category TEXT,
  updated_at INTEGER
);

-- 操作日志表
CREATE TABLE operation_logs (
  id TEXT PRIMARY KEY,
  operation_type TEXT NOT NULL,
  user_id TEXT,
  project_id TEXT,
  details TEXT,
  ip_address TEXT,
  created_at INTEGER
);

-- 索引
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_created_at ON projects(created_at);
CREATE INDEX idx_code_files_project_id ON code_files(project_id);
CREATE INDEX idx_code_files_hash ON code_files(file_hash);
CREATE INDEX idx_ai_generations_project_id ON ai_generations(project_id);
CREATE INDEX idx_ai_generations_created_at ON ai_generations(created_at);
CREATE INDEX idx_templates_type ON templates(type);
CREATE INDEX idx_operation_logs_created_at ON operation_logs(created_at);
```

### TypeORM 实体定义

#### Project 实体

```typescript
// apps/backend/src/entities/project.entity.ts
import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('projects')
export class Project {
  @PrimaryColumn('text')
  id: string;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text' })
  templateType: string;

  @Column({ type: 'text', default: 'active' })
  status: string;

  @Column({ type: 'json' })
  config: Record<string, any>;

  @Column({ type: 'text' })
  projectPath: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

#### CodeFile 实体

```typescript
// apps/backend/src/entities/code-file.entity.ts
import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('code_files')
export class CodeFile {
  @PrimaryColumn('text')
  id: string;

  @Column({ type: 'text' })
  projectId: string;

  @Column({ type: 'text' })
  filePath: string;

  @Column({ type: 'text', nullable: true })
  content: string; // 小文件内容直接存储

  @Column({ type: 'text', nullable: true })
  fileHash: string;

  @Column({ type: 'text', nullable: true })
  language: string;

  @Column({ type: 'integer', nullable: true })
  fileSize: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

#### AiGeneration 实体

```typescript
// apps/backend/src/entities/ai-generation.entity.ts
import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('ai_generations')
export class AiGeneration {
  @PrimaryColumn('text')
  id: string;

  @Column({ type: 'text' })
  projectId: string;

  @Column({ type: 'text' })
  prompt: string;

  @Column({ type: 'text', nullable: true })
  response: string;

  @Column({ type: 'text', nullable: true })
  model: string;

  @Column({ type: 'integer', nullable: true })
  tokensUsed: number;

  @Column({ type: 'text', default: 'success' })
  status: string;

  @Column({ type: 'text', nullable: true })
  errorMessage: string;

  @Column({ type: 'json', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;
}
```

### SQLite 配置

```typescript
// apps/backend/src/config/database.config.ts
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';

export const databaseConfig = TypeOrmModule.forRoot({
  type: 'sqlite',
  database: join(process.cwd(), 'data/database.db'),
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true, // 开发环境自动同步表结构
  logging: true,
  // SQLite性能优化
  extra: {
    busyTimeout: 5000, // 忙等待超时5秒
    connectionLimit: 1, // SQLite单连接
  },
});
```

### 文件存储服务

```typescript
// apps/backend/src/services/file-storage.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

@Injectable()
export class FileStorageService implements OnModuleInit {
  private readonly dataDir: string;
  private readonly projectsDir: string;
  private readonly templatesDir: string;
  private readonly cacheDir: string;

  constructor() {
    this.dataDir = path.join(process.cwd(), 'data');
    this.projectsDir = path.join(this.dataDir, 'projects');
    this.templatesDir = path.join(this.dataDir, 'templates');
    this.cacheDir = path.join(this.dataDir, 'cache');
  }

  onModuleInit() {
    this.ensureDirectories();
  }

  private ensureDirectories() {
    const dirs = [
      this.dataDir,
      this.projectsDir,
      this.templatesDir,
      this.cacheDir,
      path.join(this.cacheDir, 'ai-responses'),
    ];
    for (const dir of dirs) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    }
  }

  // 计算文件哈希
  private calculateHash(content: string): string {
    return crypto.createHash('md5').update(content).digest('hex');
  }

  // 保存项目代码文件
  async saveProjectFile(projectId: string, relativePath: string, content: string): Promise<string> {
    const projectPath = path.join(this.projectsDir, projectId, relativePath);
    const dir = path.dirname(projectPath);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    await fs.promises.writeFile(projectPath, content, 'utf-8');
    return this.calculateHash(content);
  }

  // 读取项目代码文件
  async readProjectFile(projectId: string, relativePath: string): Promise<string> {
    const filePath = path.join(this.projectsDir, projectId, relativePath);
    return await fs.promises.readFile(filePath, 'utf-8');
  }

  // 删除项目
  async deleteProject(projectId: string): Promise<void> {
    const projectPath = path.join(this.projectsDir, projectId);
    if (fs.existsSync(projectPath)) {
      await fs.promises.rm(projectPath, { recursive: true });
    }
  }

  // 获取项目文件列表
  async listProjectFiles(projectId: string): Promise<string[]> {
    const projectPath = path.join(this.projectsDir, projectId);
    const files: string[] = [];

    const walkDir = async (dir: string, baseDir: string = '') => {
      const entries = await fs.promises.readdir(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        const relativePath = path.join(baseDir, entry.name);

        if (entry.isDirectory()) {
          await walkDir(fullPath, relativePath);
        } else {
          files.push(relativePath);
        }
      }
    };

    if (fs.existsSync(projectPath)) {
      await walkDir(projectPath);
    }

    return files;
  }

  // 保存模板文件
  async saveTemplate(templateType: string, templateName: string, content: string): Promise<void> {
    const templateDir = path.join(this.templatesDir, templateType);
    if (!fs.existsSync(templateDir)) {
      fs.mkdirSync(templateDir, { recursive: true });
    }
    const templatePath = path.join(templateDir, `${templateName}.hbs`);
    await fs.promises.writeFile(templatePath, content, 'utf-8');
  }

  // 读取模板文件
  async readTemplate(templateType: string, templateName: string): Promise<string> {
    const templatePath = path.join(this.templatesDir, templateType, `${templateName}.hbs`);
    return await fs.promises.readFile(templatePath, 'utf-8');
  }

  // 缓存AI响应
  async cacheAiResponse(key: string, response: any): Promise<void> {
    const cachePath = path.join(this.cacheDir, 'ai-responses', `${key}.json`);
    await fs.promises.writeFile(cachePath, JSON.stringify(response, null, 2), 'utf-8');
  }

  // 读取缓存的AI响应
  async getCachedAiResponse(key: string): Promise<any | null> {
    const cachePath = path.join(this.cacheDir, 'ai-responses', `${key}.json`);
    if (!fs.existsSync(cachePath)) {
      return null;
    }
    const content = await fs.promises.readFile(cachePath, 'utf-8');
    return JSON.parse(content);
  }

  // 清理过期缓存
  async clearExpiredCache(maxAge: number = 24 * 60 * 60 * 1000): Promise<void> {
    const cacheDir = path.join(this.cacheDir, 'ai-responses');
    if (!fs.existsSync(cacheDir)) return;

    const entries = await fs.promises.readdir(cacheDir);
    const now = Date.now();

    for (const entry of entries) {
      const filePath = path.join(cacheDir, entry);
      const stats = await fs.promises.stat(filePath);

      if (now - stats.mtimeMs > maxAge) {
        await fs.promises.unlink(filePath);
      }
    }
  }
}
```

### 项目服务示例

```typescript
// apps/backend/src/services/project.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../entities/project.entity';
import { FileStorageService } from './file-storage.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    private fileStorageService: FileStorageService
  ) {}

  // 创建项目
  async createProject(projectData: {
    name: string;
    description?: string;
    templateType: string;
    config?: Record<string, any>;
  }): Promise<Project> {
    const projectId = uuidv4();
    const projectPath = path.join(this.fileStorageService['projectsDir'], projectId);

    const project = this.projectRepository.create({
      id: projectId,
      name: projectData.name,
      description: projectData.description,
      templateType: projectData.templateType,
      status: 'active',
      config: projectData.config || {},
      projectPath,
    });

    await this.fileStorageService.saveProjectFile(
      projectId,
      'config.json',
      JSON.stringify(project.config, null, 2)
    );

    return await this.projectRepository.save(project);
  }

  // 获取项目列表
  async getProjects(filter: { status?: string } = {}): Promise<Project[]> {
    const queryBuilder = this.projectRepository.createQueryBuilder('project');

    if (filter.status) {
      queryBuilder.where('project.status = :status', { status: filter.status });
    }

    return await queryBuilder.orderBy('project.createdAt', 'DESC').getMany();
  }

  // 获取项目详情
  async getProject(id: string): Promise<Project> {
    const project = await this.projectRepository.findOne({ where: { id } });
    if (!project) {
      throw new Error('Project not found');
    }
    return project;
  }

  // 更新项目
  async updateProject(id: string, updateData: Partial<Project>): Promise<Project> {
    const project = await this.getProject(id);

    Object.assign(project, updateData);

    return await this.projectRepository.save(project);
  }

  // 删除项目
  async deleteProject(id: string): Promise<void> {
    const project = await this.getProject(id);

    // 删除文件系统中的项目文件
    await this.fileStorageService.deleteProject(id);

    // 删除数据库记录
    await this.projectRepository.delete(id);
  }

  // 获取项目文件列表
  async getProjectFiles(id: string): Promise<string[]> {
    return await this.fileStorageService.listProjectFiles(id);
  }

  // 读取项目文件
  async readProjectFile(id: string, filePath: string): Promise<string> {
    return await this.fileStorageService.readProjectFile(id, filePath);
  }

  // 保存项目文件
  async saveProjectFile(id: string, filePath: string, content: string): Promise<void> {
    const fileHash = await this.fileStorageService.saveProjectFile(id, filePath, content);

    // 保存文件记录到数据库
    const codeFile = {
      id: uuidv4(),
      projectId: id,
      filePath,
      content: content.length < 10000 ? content : null, // 小文件直接存储
      fileHash,
      language: this.detectLanguage(filePath),
      fileSize: content.length,
    };

    // 这里可以集成CodeFile实体的保存逻辑
  }

  private detectLanguage(filePath: string): string {
    const ext = path.extname(filePath).toLowerCase();
    const languageMap: Record<string, string> = {
      '.java': 'java',
      '.ts': 'typescript',
      '.js': 'javascript',
      '.vue': 'vue',
      '.xml': 'xml',
      '.yml': 'yaml',
      '.yaml': 'yaml',
      '.json': 'json',
    };
    return languageMap[ext] || 'text';
  }
}
```

### 持久化方案优势

| 特性           | 纯文件系统  | 纯SQLite      | 混合方案    |
| -------------- | ----------- | ------------- | ----------- |
| **查询性能**   | ⚠️ 需要遍历 | ✅ 索引查询快 | ✅ SQLite快 |
| **读取小文件** | ✅ 直接读取 | ⚠️ 序列化开销 | ✅ 文件系统 |
| **读取大文件** | ✅ 流式读取 | ❌ 性能差     | ✅ 文件系统 |
| **写入文件**   | ✅ 直接写入 | ⚠️ 需要序列化 | ✅ 文件系统 |
| **事务操作**   | ❌ 不支持   | ✅ 完整支持   | ✅ SQLite   |
| **并发控制**   | ❌ 无       | ✅ 有         | ✅ SQLite   |
| **搜索过滤**   | ❌ 实现复杂 | ✅ SQL强大    | ✅ SQLite   |
| **版本控制**   | ✅ Git友好  | ❌ 不适合     | ✅ 文件系统 |
| **零配置**     | ✅ 开箱即用 | ✅ 开箱即用   | ✅ 开箱即用 |
| **跨平台**     | ✅ 完美支持 | ✅ 完美支持   | ✅ 完美支持 |

---

## 技术方案总结

### 最终确定的技术栈

| 层次           | 技术选型          | 说明                                 |
| -------------- | ----------------- | ------------------------------------ |
| **桌面框架**   | Electron          | 跨平台桌面应用,内置Node.js和Chromium |
| **后端**       | NestJS            | TypeScript全栈,模块化设计,企业级应用 |
| **前端**       | Vue 3             | 组合式API,性能优秀,生态完善          |
| **UI组件库**   | TDesign           | 企业级UI组件,与Vue3集成完美          |
| **代码编辑器** | Monaco Editor     | VS Code内核,功能强大                 |
| **状态管理**   | Pinia             | Vue3官方推荐,TypeScript支持优秀      |
| **元数据存储** | SQLite            | 轻量级数据库,零配置,事务支持         |
| **文件存储**   | 文件系统          | 高效文件操作,便于版本控制            |
| **ORM**        | TypeORM           | NestJS官方推荐,类型安全              |
| **AI服务**     | OpenAI/Claude API | 云端AI,代码生成能力强大              |

### 1000个生成项目的技术栈

| 层次         | 技术选型             | 说明                    |
| ------------ | -------------------- | ----------------------- |
| **后端**     | Java Spring Boot 3.x | 企业级Java框架,成熟稳定 |
| **微服务**   | Spring Cloud 2023.x  | 服务治理,分布式架构     |
| **前端**     | Vue 3 + TypeScript   | 与AI平台技术栈统一      |
| **UI组件库** | TDesign              | 企业级UI组件            |
| **数据库**   | PostgreSQL + Redis   | 企业级数据库方案        |
| **ORM**      | Spring Data JPA      | 约定优于配置,开发效率高 |

### 核心优势

1. **统一技术栈**: AI平台和生成项目的前端都使用Vue3,便于维护和迭代
2. **桌面应用体验**: Electron提供原生桌面应用体验,启动快速,使用流畅
3. **离线可用**: 完全本地运行,无需网络,数据安全
4. **跨平台支持**: Windows/macOS/Linux一次打包,多平台运行
5. **高效开发**: NestJS模块化设计,快速开发和迭代
6. **批量生成**: 支持批量生成1000个Java微服务项目
7. **模板化生成**: Handlebars模板引擎,灵活定制代码生成规则
8. **混合持久化**: SQLite + 文件系统,各取所长,性能最优
9. **零配置部署**: 无需安装数据库服务,开箱即用
10. **易于迁移**: 数据库结构清晰,文件系统透明,便于后续升级
