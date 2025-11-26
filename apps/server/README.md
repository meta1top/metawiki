# MetaWiki Server - RAG 后端服务

基于 NestJS 11 构建的 RAG（Retrieval-Augmented Generation）后端服务，提供知识库管理、文档处理、向量存储、智能 Agent 等核心功能。

## ✨ 核心特性

### 📚 知识库管理
- **文档上传** - 支持多种文档格式上传和处理
- **文档分割** - 基于 LangChain 的智能文档分割
- **向量化** - 文档内容向量化存储
- **检索** - 基于向量相似度的语义检索

### 🤖 智能 Agent
- **知识库 Agent** - 基于知识库的智能问答 Agent
- **检索增强生成** - RAG 模式，结合检索知识生成回答
- **多轮对话** - 支持上下文记忆的对话能力
- **可配置策略** - 灵活的检索和生成策略配置

### 🔐 用户认证
- **用户认证** - 登录、注册、Token 管理
- **OTP 支持** - 双因素认证（2FA）
- **权限控制** - 基于角色的访问控制

### 🏗️ 技术架构
- **NestJS 框架** - 企业级 Node.js 框架
- **向量存储** - Qdrant 向量数据库集成
- **文档处理** - LangChain 文档分割和嵌入
- **AI 集成** - 支持多种 LLM 模型
- **Nacos 集成** - 配置管理和服务发现
- **Redis 缓存** - 高性能缓存和会话存储
- **TypeORM** - 数据库 ORM 支持

## 🚀 快速开始

### 环境要求

- Node.js >= 18
- pnpm >= 8
- Redis >= 6.0
- MySQL >= 8.0
- Qdrant >= 1.0（向量数据库）
- Nacos >= 2.0（可选）

### 安装依赖

```bash
# 在项目根目录
pnpm install
```

### 环境变量配置

在 `apps/server/.env` 文件中配置：

```env
# 应用配置
NODE_ENV=development
PORT=3710

# Nacos 配置（必需）
NACOS_SERVER=localhost:8848
APP_NAME=metawiki-server
```

### Nacos 配置

在 Nacos 配置中心创建配置，Data ID 为 `metawiki-server`，配置格式为 YAML：

```yaml
# 数据库配置
database:
  host: localhost
  port: 3306
  username: root
  password: your-password
  database: metawiki
  synchronize: false  # 生产环境设为 false
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

# AI 配置（RAG 核心配置）
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

### 启动服务

```bash
# 开发模式（监听文件变化）
pnpm run dev:server

# 生产模式构建
pnpm run build:server

# 启动生产服务
pnpm run start:server
```

服务将在 http://localhost:3710 启动。

### 访问 Swagger 文档

启动服务后，访问 http://localhost:3710/docs 查看 API 文档。

## 📦 技术栈

### 核心框架
- **NestJS 11** - 企业级 Node.js 框架
- **TypeScript 5** - 类型安全
- **Express** - HTTP 服务器

### RAG 相关
- **@meta-1/nest-ai** - AI 能力封装模块
- **LangChain** - LLM 应用开发框架
- **Qdrant** - 向量数据库
- **OpenAI API** - LLM 模型（支持其他模型）

### 数据库和缓存
- **TypeORM** - ORM 框架
- **MySQL** - 关系型数据库（元数据存储）
- **Redis** - 缓存和会话存储
- **ioredis** - Redis 客户端

### 配置和服务发现
- **@meta-1/nest-nacos** - Nacos 集成
- **@nestjs/config** - 配置管理

### 业务库
- **@meta-1/wiki-account** - 账号管理核心模块
- **@meta-1/wiki-types** - 类型定义

### 工具库
- **@meta-1/nest-common** - 通用工具和装饰器
- **@meta-1/nest-security** - 安全认证模块
- **@meta-1/nest-message** - 邮件服务
- **@meta-1/nest-assets** - 资源管理
- **nestjs-i18n** - 国际化支持
- **@nestjs/swagger** - API 文档生成
- **nestjs-zod** - 数据验证

## 🗂️ 项目结构

```
apps/server/
├── src/
│   ├── controller/            # API 控制器
│   │   ├── assets.controller.ts      # 资源上传
│   │   ├── config.controller.ts     # 配置管理
│   │   └── mail-code.controller.ts  # 邮件验证码
│   ├── dto/                   # 数据传输对象
│   │   └── config.dto.ts
│   ├── shared/                # 共享模块
│   │   ├── app.error-code.ts     # 错误码定义
│   │   └── app.types.ts          # 类型定义
│   ├── app.module.ts          # 主模块
│   ├── app.swagger.ts         # Swagger 配置
│   └── main.ts                # 应用入口
└── tsconfig.app.json          # TypeScript 配置
```

## 🎯 核心功能

### 1. 知识库管理

#### 文档上传和处理

```typescript
// 文档上传接口
POST /api/knowledge-base/documents
Content-Type: multipart/form-data

{
  file: File,
  knowledgeBaseId: string,
  metadata?: object
}
```

#### 文档分割

文档上传后会自动进行分割处理：

```typescript
// 使用 LangChain 进行文档分割
const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 100,
});
const chunks = await splitter.splitText(documentContent);
```

#### 向量化存储

分割后的文档块会进行向量化并存储到向量数据库：

```typescript
// 生成嵌入向量
const embeddings = await embeddingsModel.embedDocuments(chunks);

// 存储到 Qdrant
await vectorStore.addDocuments(
  chunks.map((chunk, index) => ({
    pageContent: chunk,
    id: uuid(),
    metadata: {
      documentId: documentId,
      chunkIndex: index,
      ...metadata,
    },
  }))
);
```

### 2. 智能 Agent

#### 检索增强生成（RAG）

```typescript
// Agent 调用流程
async invokeAgent(query: string, knowledgeBaseId: string) {
  // 1. 检索相关知识
  const relevantDocs = await this.retrieveRelevantDocs(
    query,
    knowledgeBaseId,
    { topK: 5 }
  );
  
  // 2. 构建上下文
  const context = this.buildContext(relevantDocs);
  
  // 3. 生成回答
  const answer = await this.llm.generate({
    prompt: this.buildPrompt(query, context),
    temperature: 0.7,
  });
  
  return answer;
}
```

#### 向量检索

```typescript
// 基于向量相似度检索
async retrieveRelevantDocs(
  query: string,
  knowledgeBaseId: string,
  options: { topK: number }
) {
  // 1. 查询向量化
  const queryVector = await this.embeddingsModel.embedQuery(query);
  
  // 2. 向量相似度搜索
  const results = await this.vectorStore.similaritySearchWithScore(
    queryVector,
    options.topK,
    {
      knowledgeBaseId,
    }
  );
  
  return results;
}
```

### 3. 用户认证

使用 `@meta-1/wiki-account` 模块提供的认证功能：

- 用户注册和登录
- JWT Token 管理
- OTP 双因素认证
- 权限控制

## 🔧 开发指南

### 添加新的文档处理器

```typescript
import { Injectable } from '@nestjs/common';
import { DocumentService } from './document.service';

@Injectable()
export class CustomDocumentProcessor {
  constructor(private readonly documentService: DocumentService) {}
  
  async processDocument(file: File) {
    // 1. 提取文本
    const content = await this.extractText(file);
    
    // 2. 自定义处理逻辑
    const processedContent = await this.customProcess(content);
    
    // 3. 分割和向量化
    await this.documentService.processAndStore(processedContent);
  }
}
```

### 自定义 Agent 策略

```typescript
import { Injectable } from '@nestjs/common';
import { AgentService } from './agent.service';

@Injectable()
export class CustomAgentStrategy {
  constructor(private readonly agentService: AgentService) {}
  
  async invokeWithCustomStrategy(query: string) {
    // 自定义检索策略
    const docs = await this.customRetrieve(query);
    
    // 自定义生成策略
    const answer = await this.customGenerate(query, docs);
    
    return answer;
  }
}
```

### 配置向量数据库

支持多种向量数据库，通过配置切换：

```yaml
ai:
  vectorStore:
    name: qdrant  # 或 pinecone, weaviate 等
    collectionName: metawiki-documents
    options:
      url: http://localhost:6333
      apiKey: ""
```

## 📖 API 文档

启动服务后访问：
- Swagger UI: http://localhost:3710/docs
- JSON 格式: http://localhost:3710/docs-json

### 主要 API 端点

#### 知识库管理
- `POST /api/knowledge-base` - 创建知识库
- `GET /api/knowledge-base` - 获取知识库列表
- `POST /api/knowledge-base/:id/documents` - 上传文档
- `GET /api/knowledge-base/:id/documents` - 获取文档列表

#### Agent 相关
- `POST /api/agent/invoke` - 调用 Agent
- `GET /api/agent/:id` - 获取 Agent 信息
- `POST /api/agent` - 创建 Agent

#### 用户认证
- `POST /api/account/register` - 用户注册
- `POST /api/account/login` - 用户登录
- `GET /api/account/profile` - 获取用户信息

## 🧪 测试

```bash
# 单元测试
pnpm test

# 监听模式
pnpm test:watch

# 测试覆盖率
pnpm test:cov

# E2E 测试
pnpm test:e2e
```

## 📝 代码规范

### 使用 Biome 检查和格式化

```bash
# 检查代码
pnpm run lint

# 格式化代码
pnpm run format
```

## 🚀 部署

### 构建生产版本

```bash
pnpm run build:server
```

构建文件将输出到 `dist/apps/server/` 目录。

### 运行生产版本

```bash
pnpm run start:server
```

### Docker 部署（示例）

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install

COPY . .
RUN pnpm run build:server

EXPOSE 3710

CMD ["node", "dist/apps/server/main.js"]
```

## 🛠️ 故障排查

### Qdrant 连接失败

检查 Qdrant 服务是否启动：
```bash
curl http://localhost:6333/health
```

确保配置中的 Qdrant URL 正确。

### 向量化失败

检查 OpenAI API 密钥是否正确配置，以及 API 配额是否充足。

### Redis 连接失败

检查 Redis 服务是否启动：
```bash
redis-cli ping
```

确保 `.env` 中的 Redis 配置正确。

### Nacos 连接失败

确保 Nacos 服务运行在配置的地址，可以通过浏览器访问：
http://localhost:8848/nacos

## 📄 许可证

MIT
