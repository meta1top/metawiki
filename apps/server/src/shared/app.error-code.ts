import type { AppErrorCode } from "@meta-1/nest-common";

export const ErrorCode: Record<string, AppErrorCode> = {
  COMMON_CONFIG_NOT_FOUND: { code: 1000, message: "Common config not found" },
};
