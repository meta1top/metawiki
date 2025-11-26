import type { AxiosResponse } from "axios";

import type { RestResult } from "@meta-1/nest-types";

/**
 * REST 客户端配置（前端特有）
 */
export type RestConfig = {
  // biome-ignore lint/suspicious/noExplicitAny: RestResult
  onResponse?: (data: RestResult<any>, response: AxiosResponse) => void;
};
