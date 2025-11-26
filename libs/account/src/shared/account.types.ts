import type ms from "ms";

export type AccountConfig = {
  publicKey: string;
  privateKey: string;
  aesKey: string;
  expiresIn: ms.StringValue;
};
