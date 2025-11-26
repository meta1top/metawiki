import { SendCodeData } from "@meta-1/nest-types";
import { CommonConfig } from "@meta-1/wiki-types";
import { get, post } from "@/utils/rest";

export const sendEmailCode = (data: SendCodeData) => post<void, SendCodeData>("@api/mail/code/send", data);

export const getCommonConfig = () => get<CommonConfig>("@api/config/common");
