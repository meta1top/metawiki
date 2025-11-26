# @meta-1/wiki-types

MetaWiki 共享类型定义和 Zod Schema，用于前后端类型共享和数据验证。支持 RAG 知识库平台的所有类型定义。

## ✨ 特性

- 🛡️ **类型安全** - 完整的 TypeScript 类型定义
- ✅ **数据验证** - 基于 Zod 的 Schema 验证
- 🔄 **共享复用** - 前后端共享类型定义
- 📝 **自动推导** - 从 Schema 自动推导 TypeScript 类型
- 🌍 **国际化** - 支持多语言错误消息
- 👥 **账号类型** - 用户、OTP、认证相关类型

## 📦 安装

此模块为 MetaWiki 项目内部模块，通过 monorepo 工作区使用。

```bash
# 在项目根目录安装依赖
pnpm install
```

## 🚀 使用

### 1. 导入类型和 Schema

```typescript
import {
  AccountSchema,
  AccountType,
  AccountOtpSchema,
  AccountOtpType,
} from '@meta-1/wiki-types';
```

### 2. 在后端使用（NestJS）

#### DTO 验证

```typescript
import { Controller, Post, Body } from '@nestjs/common';
import { createZodDto } from 'nestjs-zod';
import { AccountSchema } from '@meta-1/wiki-types';

// 创建 DTO 类
export class RegisterDto extends createZodDto(
  AccountSchema.pick({ username: true, email: true, password: true })
) {}

@Controller('auth')
export class AuthController {
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    // DTO 已经通过 Zod 验证
    return await this.authService.register(dto);
  }
}
```

#### 数据验证

```typescript
import { AccountSchema, AccountType } from '@meta-1/wiki-types';

@Injectable()
export class AccountService {
  async create(data: unknown): Promise<AccountType> {
    // 验证数据
    const validatedData = AccountSchema.parse(data);
    
    // 创建账号
    const account = await this.accountRepository.create(validatedData);
    
    return account;
  }
}
```

### 3. 在前端使用（Next.js/React）

#### 表单验证

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AccountSchema, AccountType } from '@meta-1/wiki-types';

export function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AccountType>({
    resolver: zodResolver(
      AccountSchema.pick({ username: true, email: true, password: true })
    ),
  });

  const onSubmit = async (data: AccountType) {
    // 数据已验证
    await fetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('username')} />
      {errors.username && <span>{errors.username.message}</span>}
      
      <input {...register('email')} type="email" />
      {errors.email && <span>{errors.email.message}</span>}
      
      <input {...register('password')} type="password" />
      {errors.password && <span>{errors.password.message}</span>}
      
      <button type="submit">注册</button>
    </form>
  );
}
```

#### API 调用验证

```typescript
import { AccountOtpSchema, AccountOtpType } from '@meta-1/wiki-types';

async function enableOtp(accountId: string, code: string) {
  // 验证数据
  const validatedData = AccountOtpSchema.parse({
    accountId,
    code,
  });

  // 发送请求
  const response = await fetch('/api/account/otp/enable', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(validatedData),
  });

  return response.json();
}
```

## 📝 内置类型和 Schema

### AccountSchema

账号 Schema 定义。

```typescript
import { z } from 'zod';

export const AccountSchema = z.object({
  id: z.string().uuid().optional(),
  username: z.string().min(3).max(20),
  email: z.string().email(),
  password: z.string().min(8),
  avatar: z.string().url().optional(),
  nickname: z.string().max(50).optional(),
  otpEnabled: z.boolean().default(false),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type AccountType = z.infer<typeof AccountSchema>;
```

**使用示例：**

```typescript
import { AccountSchema } from '@meta-1/wiki-types';

// 验证完整账号数据
const result = AccountSchema.safeParse({
  username: 'john_doe',
  email: 'john@example.com',
  password: 'SecurePass123',
  nickname: 'John',
});

if (result.success) {
  console.log('Valid account data:', result.data);
} else {
  console.log('Validation errors:', result.error.errors);
}

// 只验证部分字段
const loginSchema = AccountSchema.pick({
  username: true,
  password: true,
});

const loginData = loginSchema.parse({
  username: 'john_doe',
  password: 'SecurePass123',
});
```

### AccountOtpSchema

OTP 双因素认证 Schema。

```typescript
import { z } from 'zod';

export const AccountOtpSchema = z.object({
  id: z.string().uuid().optional(),
  accountId: z.string().uuid(),
  secret: z.string(),
  code: z.string().length(6).regex(/^\d+$/),
  enabled: z.boolean().default(false),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type AccountOtpType = z.infer<typeof AccountOtpSchema>;
```

**使用示例：**

```typescript
import { AccountOtpSchema } from '@meta-1/wiki-types';

// 验证 OTP 启用请求
const otpEnableSchema = AccountOtpSchema.pick({
  accountId: true,
  code: true,
});

const result = otpEnableSchema.safeParse({
  accountId: '123e4567-e89b-12d3-a456-426614174000',
  code: '123456',
});
```

### 常用类型

```typescript
// 通用类型
export interface CommonTypes {
  // 分页参数
  Pagination: {
    page: number;
    pageSize: number;
    total?: number;
  };

  // API 响应
  ApiResponse<T>: {
    code: number;
    success: boolean;
    message: string;
    data: T;
    timestamp: string;
  };

  // 排序
  Sort: {
    field: string;
    order: 'asc' | 'desc';
  };
}
```

### 正则表达式

```typescript
// 常用正则表达式
export const Regular = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  username: /^[a-zA-Z0-9_-]{3,20}$/,
  password: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/,
  phone: /^1[3-9]\d{9}$/,
  url: /^https?:\/\/.+/,
};
```

## 🔧 创建自定义 Schema

### 基础 Schema

```typescript
import { z } from 'zod';

// 定义 Schema
export const ProfileSchema = z.object({
  accountId: z.string().uuid(),
  bio: z.string().max(500).optional(),
  website: z.string().url().optional(),
  location: z.string().max(100).optional(),
  birthday: z.date().optional(),
});

// 自动推导类型
export type ProfileType = z.infer<typeof ProfileSchema>;
```

### 扩展现有 Schema

```typescript
import { AccountSchema } from '@meta-1/wiki-types';
import { z } from 'zod';

// 扩展账号 Schema，添加额外字段
export const ExtendedAccountSchema = AccountSchema.extend({
  role: z.enum(['user', 'admin', 'superadmin']),
  permissions: z.array(z.string()),
  lastLoginAt: z.date().optional(),
});

export type ExtendedAccountType = z.infer<typeof ExtendedAccountSchema>;
```

### 部分更新 Schema

```typescript
import { AccountSchema } from '@meta-1/wiki-types';

// 创建部分更新 Schema（所有字段可选）
export const UpdateAccountSchema = AccountSchema.partial().pick({
  nickname: true,
  avatar: true,
  email: true,
});

export type UpdateAccountType = z.infer<typeof UpdateAccountSchema>;
```

## 🌍 国际化支持

### 自定义错误消息

```typescript
import { z } from 'zod';

export const AccountSchema = z.object({
  username: z.string()
    .min(3, { message: '用户名至少 3 个字符' })
    .max(20, { message: '用户名最多 20 个字符' })
    .regex(/^[a-zA-Z0-9_-]+$/, { message: '用户名只能包含字母、数字、下划线和连字符' }),
  email: z.string()
    .email({ message: '请输入有效的邮箱地址' }),
  password: z.string()
    .min(8, { message: '密码至少 8 个字符' })
    .regex(/[A-Z]/, { message: '密码必须包含大写字母' })
    .regex(/[a-z]/, { message: '密码必须包含小写字母' })
    .regex(/[0-9]/, { message: '密码必须包含数字' }),
});
```

## 🎯 最佳实践

1. **单一职责** - 每个 Schema 只负责一种数据结构
2. **复用 Schema** - 通过组合基础 Schema 创建复杂 Schema
3. **明确错误消息** - 提供清晰的验证错误提示
4. **类型导出** - 始终导出 Schema 和对应的 TypeScript 类型
5. **验证边界** - 在数据进入系统的边界进行验证
6. **前后端共享** - 确保前后端使用相同的验证规则
7. **使用 safeParse** - 对于用户输入，使用 `.safeParse()` 而不是 `.parse()`

## 📖 API 参考

### Zod 常用方法

```typescript
// 基础类型
z.string()
z.number()
z.boolean()
z.date()
z.array(z.string())
z.object({ ... })
z.enum(['a', 'b', 'c'])
z.union([z.string(), z.number()])

// 验证方法
schema.parse(data)        // 验证并返回数据，失败抛出错误
schema.safeParse(data)    // 验证并返回 { success, data, error }

// 转换
schema.optional()         // 字段可选
schema.nullable()         // 字段可为 null
schema.default(value)     // 设置默认值
schema.transform((val) => ...) // 数据转换

// 细化
schema.pick({ ... })      // 选择字段
schema.omit({ ... })      // 排除字段
schema.partial()          // 所有字段变为可选
schema.extend({ ... })    // 扩展对象
```

## 📄 许可证

MIT

## 🤝 贡献

欢迎贡献！这是 MetaWiki 项目的内部模块。

