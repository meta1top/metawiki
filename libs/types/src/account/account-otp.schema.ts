import { z } from "zod";

import { CODE } from "../regular";

export const OTPStatusSchema = z.object({
  enable: z.boolean().describe("是否启用"),
  enableTime: z.number().nullable().optional().describe("启用时间"),
});

export type OTPStatus = z.infer<typeof OTPStatusSchema>;

export const OTPSecretSchema = z.object({
  secret: z.string().describe("密钥"),
  qrcode: z.string().describe("二维码"),
  username: z.string().describe("用户名"),
});

export type OTPSecret = z.infer<typeof OTPSecretSchema>;

export const OTPEnableSchema = z.object({
  code: z.string().regex(CODE, "请输入6位数字验证码").describe("邮箱验证码"),
  otpCode: z.string().regex(CODE, "请输入6位数字验证码").describe("身份验证 App 验证码"),
});

export type OTPEnable = z.infer<typeof OTPEnableSchema>;

export const OTPDisableSchema = z.object({
  code: z.string().regex(CODE, "请输入6位数字验证码").describe("邮箱验证码"),
});

export type OTPDisable = z.infer<typeof OTPDisableSchema>;
