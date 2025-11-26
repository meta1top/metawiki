# MetaWiki Web - RAG 知识库前端应用

基于 Next.js 16 和 React 19 构建的现代化 RAG 知识库管理平台前端应用。

## ✨ 核心特性

### 📚 知识库管理
- **知识库创建** - 创建和管理多个知识库
- **文档上传** - 支持拖拽上传多种格式文档
- **文档预览** - 文档内容预览和编辑
- **文档检索** - 基于语义的文档检索

### 🤖 Agent 管理
- **Agent 创建** - 创建基于知识库的智能 Agent
- **对话界面** - 与 Agent 进行多轮对话
- **历史记录** - 对话历史记录和查看
- **配置管理** - Agent 参数和策略配置

### 🔐 用户认证
- **用户登录注册** - 完整的用户认证流程
- **OTP 认证** - 双因素认证支持
- **个人设置** - 账号设置和安全配置

### 🎨 用户体验
- **现代 UI** - 基于 @meta-1/design 组件库
- **响应式设计** - 完美适配桌面端和移动端
- **主题切换** - 明暗主题支持
- **国际化** - 多语言支持（中文、英文）

## 🚀 快速开始

### 环境要求

- Node.js >= 18
- pnpm >= 8

### 安装依赖

```bash
# 在项目根目录
pnpm install
```

### 环境变量配置

创建 `apps/web/.env.local` 文件：

```env
# API 基础地址
NEXT_PUBLIC_API_URL=http://localhost:3710

# 公钥配置（用于 RSA 加密）
NEXT_PUBLIC_RSA_PUBLIC_KEY=your-public-key
```

### 开发模式

```bash
# 启动开发服务器（端口 3110）
pnpm run dev:web
```

访问 http://localhost:3110 查看应用。

### 构建

```bash
# 构建生产版本
pnpm run build:web

# 启动生产服务器
cd apps/web
pnpm start
```

## 📦 技术栈

### 核心框架
- **Next.js 16** - React 应用框架，使用 App Router
- **React 19** - 用户界面库
- **TypeScript 5** - 类型安全

### UI 组件
- **@meta-1/design** - 内部 UI 组件库
- **Tailwind CSS 4** - 原子化 CSS 框架
- **Radix UI** - 无障碍 UI 基础组件
- **next-themes** - 主题切换支持
- **lucide-react** - 图标库

### 状态和数据
- **Jotai** - 轻量级状态管理
- **TanStack Query** - 数据获取和缓存
- **Axios** - HTTP 客户端
- **nuqs** - URL 查询参数状态管理

### 国际化
- **i18next** - 国际化框架
- **react-i18next** - React i18n 集成
- **i18next-browser-languagedetector** - 自动语言检测

### 工具库
- **JSEncrypt** - RSA 加密
- **Cropper.js** - 图片裁剪
- **js-cookie** - Cookie 操作
- **input-otp** - OTP 输入组件
- **es-toolkit** - 现代工具库

## 🗂️ 项目结构

```
apps/web/
├── src/
│   ├── app/                    # Next.js App Router 页面
│   │   ├── (login)/           # 登录注册页面
│   │   │   ├── login/        # 登录
│   │   │   └── register/     # 注册
│   │   ├── (main)/            # 主应用页面
│   │   │   ├── knowledge-base/  # 知识库管理
│   │   │   ├── agent/          # Agent 管理
│   │   │   ├── profile/        # 个人资料
│   │   │   └── page.tsx        # 首页
│   │   ├── layout.tsx         # 根布局
│   │   └── page.tsx           # 首页
│   ├── components/            # React 组件
│   │   ├── layout/           # 布局组件
│   │   ├── common/           # 通用组件
│   │   └── knowledge-base/   # 知识库相关组件
│   ├── hooks/                 # 自定义 Hooks
│   ├── rest/                  # API 请求
│   ├── state/                 # 状态管理
│   ├── types/                 # TypeScript 类型定义
│   ├── utils/                 # 工具函数
│   ├── config/                # 配置文件
│   └── schema/                # 数据模式验证
├── public/                    # 静态资源
│   ├── assets/               # 图片资源
│   └── ...
├── next.config.ts            # Next.js 配置
├── tsconfig.json             # TypeScript 配置
└── package.json              # 依赖配置
```

## 🎨 主要功能

### 知识库管理

#### 创建知识库

```typescript
// 使用 API 创建知识库
const createKnowledgeBase = async (data: CreateKnowledgeBaseDto) => {
  const response = await fetch('/api/knowledge-base', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
};
```

#### 上传文档

```typescript
// 文档上传组件
const DocumentUpload = () => {
  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('knowledgeBaseId', kbId);
    
    await fetch('/api/knowledge-base/documents', {
      method: 'POST',
      body: formData,
    });
  };
  
  return <FileUpload onUpload={handleUpload} />;
};
```

#### 文档检索

```typescript
// 文档检索功能
const DocumentSearch = () => {
  const [query, setQuery] = useState('');
  
  const { data: results } = useQuery({
    queryKey: ['search', query],
    queryFn: () => searchDocuments(query),
    enabled: !!query,
  });
  
  return (
    <SearchInput
      value={query}
      onChange={setQuery}
      results={results}
    />
  );
};
```

### Agent 管理

#### Agent 对话界面

```typescript
// Agent 对话组件
const AgentChat = ({ agentId }: { agentId: string }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  
  const sendMessage = async (content: string) => {
    const response = await fetch('/api/agent/invoke', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        agentId,
        query: content,
      }),
    });
    
    const answer = await response.json();
    setMessages([...messages, { role: 'user', content }, answer]);
  };
  
  return (
    <ChatInterface
      messages={messages}
      onSend={sendMessage}
    />
  );
};
```

### 用户认证

- 用户登录（支持邮箱/用户名）
- 用户注册
- OTP 二次验证
- 会话管理

## 🔧 配置

### API 配置

在 `src/config/` 目录配置 API 端点和请求拦截器。

### 主题配置

支持明暗主题切换，配置在 `src/components/layout/` 中。

## 🌍 国际化

支持多语言配置，语言文件位于 `locales/` 目录。

切换语言：

```typescript
import { useTranslation } from 'react-i18next';

const { t, i18n } = useTranslation();
i18n.changeLanguage('zh-CN'); // 或 'en'
```

## 📝 开发规范

- 使用 TypeScript 进行类型定义
- 遵循 Biome 代码规范
- 组件使用函数式组件和 Hooks
- 使用 TanStack Query 管理服务端状态
- 使用 Jotai 管理客户端状态
- 样式使用 Tailwind CSS

## 🧪 测试

```bash
# 运行测试
pnpm test

# 运行测试覆盖率
pnpm test:cov
```

## 📄 许可证

MIT
