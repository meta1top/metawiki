import type { PresignedUploadUrlRequestData, PresignedUploadUrlResponseData } from "@meta-1/nest-types";
import { post } from "@/utils/rest";

export type PreSignData = PresignedUploadUrlRequestData;
export type PreSignResult = PresignedUploadUrlResponseData;

export const preSign = (data: PreSignData) => post<PreSignResult, PreSignData>("@api/assets/upload/pre-sign", data);
