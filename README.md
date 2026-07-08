# AI 编程平台

<div align="center">

**基于大语言模型的智能代码生成工具,助力高效开发企业级应用**

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)

[功能特性](#功能特性) • [快速开始](#快速开始) • [技术架构](#技术架构) • [开发文档](#开发文档) • [贡献指南](#贡献指南)

</div>

---

## 📖 简介

AI 编程平台是一个企业级智能化编程工具,通过结合大语言模型(LLM)技术和模板引擎,大幅提升企业级软件开发效率。项目采用现代化的技术栈,支持智能代码生成、项目批量生成、代码模板管理等核心功能,旨在为开发者提供完整的 AI 辅助编程解决方案。

### 🎯 核心目标

- **提升效率**: 通过 AI 辅助实现 10 倍开发效率提升
- **批量生成**: 支持企业级项目的批量生成和管理
- **质量保证**: 生成符合企业级标准和最佳实践的代码
- **技术统一**: 采用统一的技术栈和架构规范

### 🚀 应用场景

- 企业级 OA(办公自动化)系统开发
- 企业级 ERP(企业资源计划)系统开发
- CRM(客户关系管理)系统开发
- HRM(人力资源管理)系统开发
- 其他企业级应用开发

---

## ✨ 功能特性

### 智能代码生成

- 🤖 基于自然语言描述生成代码
- 🏗️ 支持多层架构代码生成(Entity/Controller/Service/Repository)
- 🧠 智能识别业务逻辑和数据结构
- 💡 提供代码优化和重构建议

### 项目批量生成

- 📦 支持批量创建多个项目
- 🎨 支持模板化配置
- 🔄 支持增量生成和更新
- 📊 项目生命周期管理

### 代码模板管理

- 📁 预置企业级代码模板
- ✏️ 支持自定义模板
- 📚 模板版本管理
- 🔌 插件化扩展机制

### AI 交互对话

- 💬 自然语言交互界面
- 🔍 代码审查和优化建议
- 💭 技术方案咨询
- 📖 编程知识问答

### 跨平台桌面应用

- 🖥️ 基于 Electron 的桌面应用
- 🔒 本地数据存储,安全可靠
- 🌐 离线可用,无网络依赖
- ⚡ 快速启动,流畅体验

---

## 🏗️ 技术架构

### AI 平台技术栈

| 层次 | 技术选型 | 说明 |
|------|---------|------|
| 桌面框架 | Electron | 跨平台桌面应用框架 |
| 后端框架 | NestJS | Node.js 企业级框架 |
| 前端框架 | Vue 3 | 渐进式 JavaScript 框架 |
| UI 组件库 | TDesign | 腾讯企业级组件库 |
| 代码编辑器 | Monaco Editor | VS Code 内核编辑器 |
| 状态管理 | Pinia | Vue 3 状态管理库 |
| 元数据存储 | SQLite | 轻量级关系型数据库 |
| 文件存储 | 本地文件系统 | 代码文件存储 |
| ORM | TypeORM | TypeScript ORM 框架 |
| AI 服务 | OpenAI / Claude API | 大语言模型接口 |
| 模板引擎 | Handlebars | JavaScript 模板引擎 |

### 生成的项目技术栈

| 层次 | 技术选型 | 版本 |
|------|---------|------|
| 后端框架 | Spring Boot | 3.x |
| 微服务框架 | Spring Cloud | 2023.x |
| 前端框架 | Vue 3 + TypeScript | Latest |
| UI 组件库 | TDesign | Latest |
| 数据库 | PostgreSQL + Redis | Latest |
| ORM | Spring Data JPA | Latest |

### 架构设计

```
┌─────────────────────────────────────────────────────────┐
│                    Electron 桌面应用                      │
├─────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  Vue 3 前端   │  │  NestJS 后端  │  │  AI 服务层    │  │
│  │              │  │              │  │              │  │
│  │  - 代码编辑器  │  │  - API 服务   │  │  - 代码生成    │  │
│  │  - 项目管理    │  │  - 业务逻辑   │  │  - 智能对话    │  │
│  │  - 对话界面    │  │  - 数据访问   │  │  - 代码审查    │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
├─────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  SQLite 元数据│  │  文件系统代码 │  │  模板引擎     │  │
│  │              │  │              │  │              │  │
│  │  - 项目配置    │  │  - 源代码     │  │  - Handlebars │  │
│  │  - AI 记录     │  │  - 模板文件   │  │  - 模板管理   │  │
│  │  - 用户偏好    │  │  - 构建产物   │  │  - 版本控制   │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## 📂 项目结构

```
aicoding-platform/
├── apps/                        # 应用层
│   ├── electron/               # Electron 主进程
│   │   ├── main/               # 主进程代码
│   │   ├── preload/            # 预加载脚本
│   │   └── resources/          # 资源文件
│   ├── backend/                # NestJS 后端
│   │   ├── src/                # 源代码
│   │   │   ├── modules/        # 业务模块
│   │   │   ├── services/       # 服务层
│   │   │   ├── controllers/    # 控制器层
│   │   │   └── database/       # 数据库配置
│   │   └── test/               # 测试代码
│   └── frontend/               # Vue 3 前端
│       ├── src/                # 源代码
│       │   ├── components/     # 组件
│       │   ├── views/          # 页面
│       │   ├── store/          # 状态管理
│       │   └── api/            # API 接口
│       └── public/             # 静态资源
├── packages/                    # 共享包
│   ├── shared-types/          # 共享类型定义
│   ├── java-templates/        # Java 代码模板
│   └── shared-utils/          # 共享工具函数
├── 01-docs/                    # 项目文档
│   ├── 01-头脑风暴-AI编程平台.md
│   ├── 02-创始人需求与目标.md
│   ├── 03-产品形态深度分析.md
│   ├── 04-本地Web平台技术方案.md
│   └── 05-1000个项目Java微服务架构方案.md
├── package.json                # 项目配置
├── pnpm-workspace.yaml         # pnpm 工作区配置
├── tsconfig.json               # TypeScript 配置
└── README.md                   # 项目说明
```

---

## 🚀 快速开始

### 环境要求

| 工具 | 版本要求 | 说明 |
|------|---------|------|
| Node.js | >= 18.0.0 | JavaScript 运行环境 |
| pnpm | >= 8.0.0 | 包管理工具 |
| Git | >= 2.0.0 | 版本控制工具 |
| JDK | >= 17 | Java 开发工具包(可选,用于生成项目) |

### 安装步骤

1. **克隆项目**

```bash
git clone https://github.com/qoobots/aicoding-platform.git
cd aicoding-platform
```

2. **安装依赖**

```bash
pnpm install
```

3. **启动开发环境**

```bash
# 启动前端(终端1)
pnpm dev

# 启动后端(终端2)
pnpm dev:backend

# 启动 Electron(终端3)
pnpm dev:electron
```

### 构建和打包

```bash
# 构建所有应用
pnpm build

# 构建前端
pnpm build:frontend

# 构建后端
pnpm build:backend

# 打包 Electron 应用
pnpm electron:win           # Windows
pnpm electron:mac           # macOS
pnpm electron:linux         # Linux
```

### Docker 部署(可选)

```bash
# 构建镜像
docker-compose build

# 启动服务
docker-compose up -d

# 查看日志
docker-compose logs -f
```

---

## 📚 开发文档

详细的技术方案和架构设计请查看 `01-docs/` 目录:

- [01-头脑风暴-AI编程平台.md](./01-docs/01-头脑风暴-AI编程平台.md) - 核心功能模块和业务模型
- [02-创始人需求与目标.md](./01-docs/02-创始人需求与目标.md) - 创始人具体需求和效率分析
- [03-产品形态深度分析.md](./01-docs/03-产品形态深度分析.md) - 产品形态对比分析
- [04-本地Web平台技术方案.md](./01-docs/04-本地Web平台技术方案.md) - 完整技术架构和实现方案
- [05-1000个项目Java微服务架构方案.md](./01-docs/05-1000个项目Java微服务架构方案.md) - 微服务架构设计
- [06-业务架构设计.md](./01-docs/06-业务架构设计.md) - 业务架构和流程设计

---

## 🎨 技术亮点

### 1. 混合持久化方案

- **SQLite** 存储元数据(项目配置、AI 记录、用户偏好)
- **文件系统** 存储代码文件(生成的代码、模板文件)
- 各取所长,性能最优

### 2. Electron 桌面应用

- 跨平台支持(Windows/macOS/Linux)
- 内置 Node.js 和 Chromium,无需额外配置
- 优秀的用户体验,快速启动

### 3. Monorepo 架构

- 统一管理前后端代码
- 共享 TypeScript 类型定义
- 便于版本控制和发布

### 4. TypeScript 全栈

- 前后端统一使用 TypeScript
- 类型安全,减少运行时错误
- 完善的开发体验

### 5. 模板化代码生成

- 预置 Spring Boot 和 Vue3 企业级模板
- 支持 Handlebars 模板引擎
- 灵活定制生成规则

---

## 📊 1000 个开源项目规划

### 项目分类

| 类别 | 数量 | 说明 |
|------|------|------|
| 基础服务 | 20 | 用户中心、权限管理、消息服务等 |
| OA 系统 | 300 | 审批流程、考勤管理、文档管理等 |
| ERP 系统 | 400 | 采购管理、库存管理、财务管理等 |
| CRM 系统 | 100 | 客户管理、销售管理、市场营销等 |
| HRM 系统 | 80 | 人事管理、薪酬管理、绩效考核等 |
| 其他应用 | 100 | 数据分析、报表工具、第三方集成等 |

### 技术统一性

- 所有项目采用 Java Spring Boot + Spring Cloud 微服务架构
- 前端统一使用 Vue 3 + TDesign
- 数据库统一使用 PostgreSQL + Redis
- 代码风格和架构规范统一

---

## 🌟 核心优势

1. **效率提升**: 通过 AI 辅助,开发效率提升 10 倍
2. **质量保证**: 生成的代码符合企业级标准和最佳实践
3. **技术统一**: 1000 个项目采用统一技术栈,便于维护
4. **快速迭代**: 支持快速生成和修改代码
5. **易于扩展**: 模块化设计,便于功能扩展
6. **离线可用**: 本地运行,无需网络,数据安全
7. **跨平台**: 支持主流操作系统

---

## 📈 开发进度

### 已完成 ✅

- [x] 技术方案设计
- [x] 架构设计
- [x] 项目结构搭建

### 进行中 🚧

- [ ] Electron 桌面应用开发
- [ ] NestJS 后端开发
- [ ] Vue 3 前端开发

### 待开发 ⏳

- [ ] AI 服务集成
- [ ] 代码模板开发
- [ ] 项目生成功能
- [ ] 测试和优化

---

## 🤝 贡献指南

### 开发规范

1. **代码风格**
   - 遵循 ESLint 配置
   - 使用 TypeScript 类型检查
   - 编写有意义的提交信息

2. **提交规范**
   ```bash
   feat: 新功能
   fix: 修复 bug
   docs: 文档更新
   style: 代码格式调整
   refactor: 重构
   test: 测试相关
   chore: 构建/工具相关
   ```

3. **Pull Request**
   - 提交前确保代码通过测试
   - 更新相关文档
   - 提供清晰的描述说明

### 报告问题

如果您发现了 Bug 或有功能建议,请通过以下方式反馈:

- 创建 [Issue](https://github.com/qoobots/aicoding-platform/issues)
- 描述问题的详细情况
- 提供复现步骤和环境信息
- 附上相关的日志或截图

---

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

---

## 🔗 相关链接

- **项目地址**: https://github.com/qoobots/aicoding-platform
- **文档中心**: [01-docs/](./01-docs/)
- **问题反馈**: [Issues](https://github.com/your-org/aicoding-platform/issues)
- **更新日志**: [CHANGELOG.md](CHANGELOG.md)

---

## 💖 致谢

感谢以下开源项目和社区:

- [Electron](https://www.electronjs.org/) - 跨平台桌面应用框架
- [NestJS](https://nestjs.com/) - Node.js 企业级框架
- [Vue.js](https://vuejs.org/) - 渐进式 JavaScript 框架
- [TDesign](https://tdesign.tencent.com/) - 腾讯企业级设计体系
- [OpenAI](https://openai.com/) - AI 能力支持
- [Spring Boot](https://spring.io/projects/spring-boot) - Java 微服务框架
- [Spring Cloud](https://spring.io/projects/spring-cloud) - 微服务解决方案

---

<div align="center">

**如果这个项目对您有帮助,请给一个 ⭐️ Star 支持一下!**

Made with ❤️ by Founder

</div>
