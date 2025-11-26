# MetaWiki - RAG 知识库平台

MetaWiki 是一个基于 RAG（Retrieval-Augmented Generation）技术的智能知识库平台，提供文档管理、向量存储、知识检索和智能 Agent 等功能。

## ✨ 核心特性

### 📚 知识库管理
- **文档上传** - 支持多种文档格式（PDF、Word、Markdown、TXT 等）
- **智能分割** - 基于语义的文档分割，支持自定义分割策略
- **向量化存储** - 使用向量数据库存储文档嵌入，支持快速相似度检索
- **知识检索** - 基于向量相似度的语义检索，精准匹配相关内容

### 🤖 智能 Agent
- **知识库 Agent** - 基于知识库的智能问答 Agent
- **上下文理解** - 结合检索到的知识片段生成准确回答
- **多轮对话** - 支持上下文记忆的多轮对话能力
- **可配置策略** - 灵活的检索策略和生成参数配置

### 🔐 用户认证
- **用户注册登录** - 完整的用户认证体系
- **OTP 双因素认证** - 增强账号安全性
- **会话管理** - JWT Token 认证和会话管理

### 🏗️ 技术架构
- **前后端分离** - Next.js 前端 + NestJS 后端
- **向量存储** - 集成 Qdrant 等向量数据库
- **文档处理** - LangChain 文档分割和嵌入
- **AI 集成** - 支持多种 LLM 模型（OpenAI、Claude 等）

## 🚀 快速开始

### 环境要求

- Node.js >= 18
- pnpm >= 8
- Redis >= 6.0（用于缓存和会话）
- MySQL >= 8.0（用于元数据存储）
- Qdrant >= 1.0（向量数据库，可选，支持其他向量数据库）
- Nacos >= 2.0（配置管理，可选）

### 安装依赖

```bash
# 克隆项目
git clone <repository-url>
cd wiki

# 安装依赖
pnpm install
```

### 环境配置

#### 1. 后端环境变量

在 `apps/server/.env` 文件中配置：

```env
# 应用配置
NODE_ENV=development
PORT=3710

# Nacos 配置（如果使用）
NACOS_SERVER=localhost:8848
APP_NAME=metawiki-server
```

#### 2. Nacos 配置（可选）

在 Nacos 配置中心创建配置，Data ID 为 `metawiki-server`：

```yaml
# 数据库配置
database:
  host: localhost
  port: 3306
  username: root
  password: your-password
  database: metawiki
  synchronize: false
  logging: false

# Redis 配置
redis:
  host: localhost
  port: 6379
  password: ""
  db: 0

# 账号配置
account:
  rsa:
    privateKey: |
      -----BEGIN RSA PRIVATE KEY-----
      your-private-key
      -----END RSA PRIVATE KEY-----
    publicKey: |
      -----BEGIN PUBLIC KEY-----
      your-public-key
      -----END PUBLIC KEY-----
  jwt:
    secret: your-jwt-secret
    expiresIn: 7d
  otp:
    issuer: MetaWiki

# AI 配置（RAG 相关）
ai:
  model:
    name: gpt-4
    apiKey: your-openai-api-key
    apiBaseUrl: https://api.openai.com/v1
    temperature: 0.7
    maxTokens: 2000
  vectorStore:
    name: qdrant
    collectionName: metawiki-documents
    options:
      url: http://localhost:6333
      apiKey: ""
  embeddings:
    name: text-embedding-ada-002
    apiKey: your-openai-api-key
    apiBaseUrl: https://api.openai.com/v1
  textSplitter:
    chunkSize: 1000
    chunkOverlap: 100
```

#### 3. 前端环境变量

在 `apps/web/.env.local` 文件中配置：

```env
# API 基础地址
NEXT_PUBLIC_API_URL=http://localhost:3710

# 公钥配置（用于 RSA 加密）
NEXT_PUBLIC_RSA_PUBLIC_KEY=your-public-key
```

### 启动服务

```bash
# 启动后端服务（开发模式）
pnpm run dev:server

# 启动前端应用（开发模式）
pnpm run dev:web
```

访问：
- 前端应用：http://localhost:3110
- API 文档：http://localhost:3710/docs
- Qdrant 控制台：http://localhost:6333（如果使用 Qdrant）

## 📦 项目结构

```
wiki/
├── apps/
│   ├── server/          # 后端服务（NestJS）
│   │   ├── src/
│   │   │   ├── controller/    # API 控制器
│   │   │   ├── service/       # 业务逻辑服务
│   │   │   └── ...
│   │   └── README.md
│   └── web/             # 前端应用（Next.js）
│       ├── src/
│       │   ├── app/           # Next.js App Router 页面
│       │   ├── components/    # React 组件
│       │   └── ...
│       └── README.md
├── libs/
│   ├── account/         # 账号管理模块
│   │   └── README.md
│   └── types/          # 共享类型定义
│       └── README.md
├── locales/            # 国际化文件
├── scripts/            # 工具脚本
└── README.md          # 本文件
```

## 🎯 核心功能模块

### 1. 知识库管理

- **文档上传**：支持多种格式文档上传
- **文档分割**：智能文档分割，提取关键信息
- **向量化**：文档内容向量化存储
- **检索**：基于向量相似度的语义检索

### 2. 智能 Agent

- **知识库 Agent**：基于知识库的问答 Agent
- **检索增强**：结合检索到的知识生成回答
- **上下文管理**：多轮对话上下文管理

### 3. 用户认证

- **注册登录**：用户注册和登录功能
- **OTP 认证**：双因素认证支持
- **权限管理**：基于角色的访问控制

## 🛠️ 技术栈

### 后端
- **NestJS 11** - Node.js 企业级框架
- **TypeORM** - ORM 框架
- **MySQL** - 关系型数据库
- **Redis** - 缓存和会话存储
- **Qdrant** - 向量数据库
- **LangChain** - LLM 应用开发框架
- **@meta-1/nest-ai** - AI 能力封装

### 前端
- **Next.js 16** - React 应用框架
- **React 19** - UI 库
- **TypeScript 5** - 类型安全
- **Tailwind CSS 4** - 样式框架
- **TanStack Query** - 数据获取和缓存

## 📖 使用指南

### 创建知识库

1. 登录系统
2. 进入知识库管理页面
3. 上传文档或创建知识库
4. 等待文档处理和向量化完成

### 使用 Agent

1. 选择或创建 Agent
2. 关联知识库
3. 开始对话，Agent 会基于知识库内容回答

### API 使用

详细的 API 文档请访问：http://localhost:3710/docs

## 🔧 开发指南

### 添加新的文档处理器

```typescript
// 在 service 中实现文档处理逻辑
@Injectable()
export class DocumentService {
  async processDocument(file: File) {
    // 1. 提取文本内容
    const content = await this.extractText(file);
    
    // 2. 分割文档
    const chunks = await this.splitDocument(content);
    
    // 3. 生成向量
    const vectors = await this.generateEmbeddings(chunks);
    
    // 4. 存储到向量数据库
    await this.storeVectors(vectors);
  }
}
```

### 自定义 Agent 策略

```typescript
@Injectable()
export class AgentService {
  async invokeAgent(query: string, knowledgeBaseId: string) {
    // 1. 检索相关知识
    const relevantDocs = await this.retrieveRelevantDocs(query, knowledgeBaseId);
    
    // 2. 构建上下文
    const context = this.buildContext(relevantDocs);
    
    // 3. 生成回答
    const answer = await this.generateAnswer(query, context);
    
    return answer;
  }
}
```

## 🧪 测试

```bash
# 运行测试
pnpm test

# 测试覆盖率
pnpm test:cov

# E2E 测试
pnpm test:e2e
```

## 📝 代码规范

```bash
# 代码检查
pnpm run lint

# 代码格式化
pnpm run format
```

## 🚀 部署

### 构建生产版本

```bash
# 构建后端
pnpm run build:server

# 构建前端
pnpm run build:web
```

### Docker 部署（示例）

```dockerfile
# 后端 Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install
COPY . .
RUN pnpm run build:server
EXPOSE 3710
CMD ["node", "dist/apps/server/main.js"]
```

## 📄 许可证

MIT

## 🤝 贡献

欢迎贡献代码！请先阅读贡献指南。

## 📞 联系方式

如有问题或建议，请提交 Issue 或联系维护者。

