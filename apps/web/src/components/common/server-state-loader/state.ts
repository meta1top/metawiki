import { dehydrate } from "@tanstack/react-query";

import { profile } from "@/rest/account";
import { getCommonConfig } from "@/rest/public";
import { getQueryClient, prefetchQuery } from "@/utils/query";

export const dehydratedState = async () => {
  const queryClient = getQueryClient();

  await Promise.all([
    prefetchQuery(queryClient, {
      queryKey: ["profile"],
      queryFn: () => profile(),
    }),
    prefetchQuery(queryClient, {
      queryKey: ["common:config"],
      queryFn: () => getCommonConfig(),
    }),
  ]);
  return dehydrate(queryClient);
};
