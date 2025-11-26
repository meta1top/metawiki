# @meta-1/wiki-account

MetaWiki 账号管理核心模块，提供用户认证、授权、OTP 双因素认证等功能。作为 RAG 知识库平台的用户认证基础模块。

## ✨ 特性

- 👥 **用户管理** - 用户 CRUD 操作
- 🔐 **认证服务** - 登录、注册、Token 管理
- 🔒 **OTP 管理** - 双因素认证（2FA）管理
- 🛡️ **权限控制** - 基于角色的访问控制（RBAC）
- 📊 **应用管理** - 多应用支持
- 🔄 **会话管理** - 用户会话跟踪
- 🔐 **密码加密** - RSA 加密传输保护
- 📝 **数据验证** - 基于 Zod Schema 验证

## 📦 安装

此模块为 MetaWiki 项目内部模块，通过 monorepo 工作区使用。

```bash
# 在项目根目录安装依赖
pnpm install
```

## 🚀 使用

### 1. 模块导入

在 NestJS 应用中导入模块：

```typescript
import { Module } from '@nestjs/common';
import { AccountModule } from '@meta-1/wiki-account';

@Module({
  imports: [AccountModule],
})
export class AppModule {}
```

### 2. 账号服务

#### 用户注册

```typescript
import { Injectable } from '@nestjs/common';
import { AccountService } from '@meta-1/wiki-account';

@Injectable()
export class AuthService {
  constructor(private readonly accountService: AccountService) {}

  async register(data: RegisterDto) {
    // 创建新用户
    const account = await this.accountService.register({
      username: data.username,
      email: data.email,
      password: data.password, // RSA 加密后的密码
    });

    return account;
  }
}
```

#### 用户登录

```typescript
@Injectable()
export class AuthService {
  constructor(private readonly accountService: AccountService) {}

  async login(credentials: LoginDto) {
    // 验证用户凭证
    const account = await this.accountService.login({
      username: credentials.username,
      password: credentials.password, // RSA 加密后的密码
    });

    if (!account) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 创建 Token
    const token = await this.accountService.createToken(account);

    return { account, token };
  }
}
```

#### 获取用户信息

```typescript
@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get('profile')
  async getProfile(@CurrentUser() user: SessionUser) {
    const account = await this.accountService.findById(user.id);
    return account;
  }

  @Put('profile')
  async updateProfile(
    @CurrentUser() user: SessionUser,
    @Body() updateDto: UpdateAccountDto
  ) {
    const account = await this.accountService.update(user.id, updateDto);
    return account;
  }
}
```

### 3. OTP 双因素认证

#### 启用 OTP

```typescript
import { AccountOtpService } from '@meta-1/wiki-account';

@Injectable()
export class SecurityService {
  constructor(private readonly otpService: AccountOtpService) {}

  async enableOtp(accountId: string) {
    // 生成 OTP 密钥和二维码
    const { secret, qrCode } = await this.otpService.generateSecret(accountId);
    
    return {
      secret,
      qrCode, // 用于展示给用户扫描
    };
  }

  async verifyAndEnableOtp(accountId: string, code: string) {
    // 验证用户输入的 OTP 代码
    const isValid = await this.otpService.verifyCode(accountId, code);
    
    if (!isValid) {
      throw new BadRequestException('Invalid OTP code');
    }

    // 启用 OTP
    await this.otpService.enable(accountId);
    
    return { enabled: true };
  }
}
```

#### 验证 OTP

```typescript
@Injectable()
export class AuthService {
  constructor(private readonly otpService: AccountOtpService) {}

  async validateOtp(accountId: string, code: string) {
    const isValid = await this.otpService.verifyCode(accountId, code);
    
    if (!isValid) {
      throw new UnauthorizedException('Invalid OTP code');
    }
    
    return true;
  }
}
```

### 4. 认证守卫

使用内置的认证守卫保护路由：

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@meta-1/wiki-account';
import { Public } from '@meta-1/nest-security';

@Controller('api')
@UseGuards(AuthGuard)
export class ApiController {
  // 需要认证的路由
  @Get('protected')
  protected() {
    return { message: 'This route is protected' };
  }

  // 公开路由
  @Public()
  @Get('public')
  public() {
    return { message: 'This route is public' };
  }
}
```

### 5. 应用管理

#### 创建应用

```typescript
@Injectable()
export class AppService {
  constructor(private readonly accountService: AccountService) {}

  async createApp(ownerId: string, data: CreateAppDto) {
    const app = await this.accountService.createApp({
      name: data.name,
      description: data.description,
      ownerId,
    });

    return app;
  }
}
```

#### 应用成员管理

```typescript
@Injectable()
export class AppMemberService {
  constructor(private readonly accountService: AccountService) {}

  async addMember(appId: string, accountId: string, role: string) {
    await this.accountService.addAppMember(appId, accountId, role);
  }

  async removeMember(appId: string, accountId: string) {
    await this.accountService.removeAppMember(appId, accountId);
  }

  async getMembers(appId: string) {
    return await this.accountService.getAppMembers(appId);
  }
}
```

## 📝 数据模型

### Account 实体

```typescript
interface Account {
  id: string;
  username: string;
  email: string;
  password: string; // 加密后的密码
  avatar?: string;
  nickname?: string;
  otpEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### AccountOtp 实体

```typescript
interface AccountOtp {
  id: string;
  accountId: string;
  secret: string; // OTP 密钥
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### App 实体

```typescript
interface App {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### AppAccount 实体（应用成员）

```typescript
interface AppAccount {
  id: string;
  appId: string;
  accountId: string;
  role: string; // owner, admin, member
  createdAt: Date;
}
```

## 🔐 安全特性

### 密码加密

- 前端使用 RSA 公钥加密密码
- 后端使用 RSA 私钥解密
- 解密后使用 bcrypt 哈希存储

### OTP 双因素认证

- 基于 TOTP（Time-based One-Time Password）
- 支持 Google Authenticator、Microsoft Authenticator 等
- 生成二维码供用户扫描
- 6 位数字验证码，30 秒有效期

### Token 管理

- JWT Token 认证
- Token 自动刷新
- Redis 会话存储
- Token 过期自动处理

## 📖 API 参考

### AccountService

- `register(data): Promise<Account>` - 注册新用户
- `login(credentials): Promise<Account>` - 用户登录验证
- `findById(id): Promise<Account>` - 根据 ID 查找用户
- `findByUsername(username): Promise<Account>` - 根据用户名查找
- `findByEmail(email): Promise<Account>` - 根据邮箱查找
- `update(id, data): Promise<Account>` - 更新用户信息
- `updatePassword(id, password): Promise<void>` - 更新密码
- `delete(id): Promise<void>` - 删除用户

### AccountOtpService

- `generateSecret(accountId): Promise<{ secret, qrCode }>` - 生成 OTP 密钥
- `verifyCode(accountId, code): Promise<boolean>` - 验证 OTP 代码
- `enable(accountId): Promise<void>` - 启用 OTP
- `disable(accountId): Promise<void>` - 禁用 OTP
- `isEnabled(accountId): Promise<boolean>` - 检查是否启用

### AuthGuard

- 全局认证守卫
- 自动验证 JWT Token
- 注入当前用户信息到请求
- 支持 `@Public()` 装饰器跳过认证

## 🔧 配置

### 模块配置

在 `app.module.ts` 中配置：

```typescript
@Module({
  imports: [
    AccountModule.forRoot({
      rsa: {
        privateKey: process.env.RSA_PRIVATE_KEY,
        publicKey: process.env.RSA_PUBLIC_KEY,
      },
      otp: {
        issuer: 'MetaWiki',
        algorithm: 'sha1',
        digits: 6,
        period: 30,
      },
    }),
  ],
})
export class AppModule {}
```

## 🧪 测试

```bash
# 运行测试
pnpm test

# 测试覆盖率
pnpm test:cov
```

## 📄 许可证

MIT

## 🤝 贡献

欢迎贡献！这是 MetaWiki 项目的内部模块。

