# AI 编程平台

> 基于大语言模型的智能代码生成工具,助力高效开发 1000 个企业级开源项目

## 项目简介

AI 编程平台是一个由 15 年资深架构师独立开发的智能化编程工具,旨在通过结合大语言模型(LLM)技术和模板引擎,大幅提升企业级软件开发效率。

### 核心目标

- **提升效率**: 目标提升 10 倍开发效率
- **批量生成**: 支持 1000 个企业级项目的批量生成
- **质量保证**: 生成符合企业级标准的代码
- **技术统一**: 生成的项目采用统一的技术栈

### 应用场景

- 企业级 OA(办公自动化)系统开发
- 企业级 ERP(企业资源计划)系统开发
- CRM(客户关系管理)系统开发
- HRM(人力资源管理)系统开发
- 其他企业级应用开发

## 技术架构

### AI 平台技术栈

| 层次 | 技术选型 |
|------|---------|
| 桌面框架 | Electron (跨平台桌面应用) |
| 后端框架 | NestJS (Node.js + TypeScript) |
| 前端框架 | Vue 3 + TypeScript |
| UI 组件库 | TDesign (腾讯企业级组件) |
| 代码编辑器 | Monaco Editor (VS Code 内核) |
| 状态管理 | Pinia |
| 元数据存储 | SQLite (轻量级数据库) |
| 文件存储 | 本地文件系统 |
| ORM | TypeORM |
| AI 服务 | OpenAI / Claude API |
| 模板引擎 | Handlebars |

### 生成的项目技术栈

| 层次 | 技术选型 |
|------|---------|
| 后端框架 | Java Spring Boot 3.x |
| 微服务框架 | Spring Cloud 2023.x |
| 前端框架 | Vue 3 + TypeScript |
| UI 组件库 | TDesign |
| 数据库 | PostgreSQL + Redis |
| ORM | Spring Data JPA |

## 核心功能

### 1. 智能代码生成
- 基于自然语言描述生成代码
- 支持多层架构代码生成(Entity/Controller/Service/Repository)
- 智能识别业务逻辑和数据结构

### 2. 项目批量生成
- 支持批量创建多个项目
- 支持模板化配置
- 支持增量生成和更新

### 3. 代码模板管理
- 预置企业级代码模板
- 支持自定义模板
- 模板版本管理

### 4. AI 交互对话
- 自然语言交互界面
- 代码审查和优化建议
- 技术方案咨询

### 5. 项目管理
- 项目生命周期管理
- 代码文件管理
- 版本控制集成

## 项目结构

```
aicoding-platform/
├── apps/
│   ├── electron/              # Electron 主进程
│   ├── backend/               # NestJS 后端
│   └── frontend/             # Vue 3 前端
├── packages/
│   ├── shared-types/         # 共享类型定义
│   ├── java-templates/       # Java 代码模板
│   └── shared-utils/         # 共享工具函数
├── 01-docs/                 # 项目文档
└── README.md
```

## 快速开始

### 环境要求

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- Git

### 安装步骤

```bash
# 克隆项目
git clone https://github.com/your-org/aicoding-platform.git
cd aicoding-platform

# 安装依赖
pnpm install

# 启动开发环境
pnpm dev                    # 启动前端
pnpm dev:backend            # 启动后端(新终端)
pnpm dev:electron           # 启动 Electron(新终端)
```

### 构建和打包

```bash
# 构建所有应用
pnpm build

# 打包 Electron 应用
pnpm electron:win           # Windows
pnpm electron:mac           # macOS
pnpm electron:linux         # Linux
```

## 开发文档

详细的技术方案和架构设计请查看 `01-docs/` 目录:

- [01-头脑风暴-AI编程平台.md](./01-docs/01-头脑风暴-AI编程平台.md) - 核心功能模块和业务模型
- [02-创始人需求与目标.md](./01-docs/02-创始人需求与目标.md) - 创始人具体需求和效率分析
- [03-产品形态深度分析.md](./01-docs/03-产品形态深度分析.md) - 产品形态对比分析
- [04-本地Web平台技术方案.md](./01-docs/04-本地Web平台技术方案.md) - 完整技术架构和实现方案
- [05-1000个项目Java微服务架构方案.md](./01-docs/05-1000个项目Java微服务架构方案.md) - 1000 个项目的架构设计

## 技术亮点

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

## 1000 个开源项目规划

### 项目分类
- **基础服务**: 20 个
- **OA 系统**: 300 个
- **ERP 系统**: 400 个
- **CRM 系统**: 100 个
- **HRM 系统**: 80 个
- **其他应用**: 100 个

### 技术统一性
- 所有项目采用 Java Spring Boot + Spring Cloud 微服务架构
- 前端统一使用 Vue 3 + TDesign
- 数据库统一使用 PostgreSQL + Redis
- 代码风格和架构规范统一

## 核心优势

1. **效率提升**: 通过 AI 辅助,开发效率提升 10 倍
2. **质量保证**: 生成的代码符合企业级标准和最佳实践
3. **技术统一**: 1000 个项目采用统一技术栈,便于维护
4. **快速迭代**: 支持快速生成和修改代码
5. **易于扩展**: 模块化设计,便于功能扩展
6. **离线可用**: 本地运行,无需网络,数据安全
7. **跨平台**: 支持主流操作系统

## 开发进度

- [x] 技术方案设计
- [x] 架构设计
- [ ] 项目初始化
- [ ] Electron 桌面应用开发
- [ ] NestJS 后端开发
- [ ] Vue 3 前端开发
- [ ] AI 服务集成
- [ ] 代码模板开发
- [ ] 项目生成功能
- [ ] 测试和优化

## 贡献指南

本项目由创始人独立开发,暂不接受外部贡献。

## 许可证

待定

## 联系方式

- 项目地址: https://github.com/your-org/aicoding-platform
- 文档地址: [01-docs/](./01-docs/)

## 致谢

感谢以下开源项目:
- Electron
- NestJS
- Vue.js
- TDesign
- OpenAI
- Spring Boot
- Spring Cloud

---

**创始人**: 15 年资深架构师
**项目目标**: 开发 1000 个企业级开源项目
**开发工具**: AI 编程平台
**创建时间**: 2026-03-06
