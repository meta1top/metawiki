import { get } from "@/utils/headers.server";
// Rest 配置
import { alias } from "@/utils/rest";

// 别名配置
alias({
  "@api": {
    url: "/api",
    headers: get,
  },
});
