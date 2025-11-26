import { z } from "zod";

// 业务层特定的配置 Schema
export const CommonConfigSchema = z.object({
  publicKey: z.string().describe("公钥"),
});

export type CommonConfig = z.infer<typeof CommonConfigSchema>;