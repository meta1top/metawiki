import type { AppErrorCode } from "@meta-1/nest-common";

export const ErrorCode: Record<string, AppErrorCode> = {
  MAIL_CODE_ERROR: { code: 1000, message: "验证码错误" },
  ACCOUNT_EXISTS: { code: 1001, message: "账号已存在" },
  LOGIN_ERROR: { code: 1002, message: "登录失败" },
  ACCOUNT_CONFIG_NOT_FOUND: { code: 1003, message: "账号配置未找到" },
  ACCOUNT_NOT_FOUND: { code: 1004, message: "账号未找到" },
  OTP_SECRET_NOT_FOUND: { code: 1005, message: "OTP 密钥未找到" },
  OTP_ENABLE_ERROR: { code: 1006, message: "OTP 启用失败" },
  OTP_CODE_INVALID: { code: 1007, message: "OTP 验证码错误" },
  OTP_CODE_REQUIRED: { code: 1008, message: "需要输入OTP验证码" },
  APP_KEY_EXISTS: { code: 1009, message: "应用标识已存在" },
  APP_NOT_FOUND: { code: 1010, message: "应用未找到" },
  NO_PERMISSION: { code: 1011, message: "无操作权限" },
} as const;
