import { OTPEnable, OTPSecret, OTPStatus } from "@meta-1/wiki-types";
import { get, post } from "@/utils/rest";

export const otpSecret = () => get<OTPSecret>("@api/account/otp/secret");

export const otpStatus = () => get<OTPStatus>("@api/account/otp/status");

export const otpEnable = (data: OTPEnable) => post<unknown, OTPEnable>("@api/account/otp/enable", data);

export type OTPDisableData = {
  code: string;
};
export const otpDisable = (data: OTPDisableData) => post<unknown, OTPDisableData>("@api/account/otp/disable", data);
