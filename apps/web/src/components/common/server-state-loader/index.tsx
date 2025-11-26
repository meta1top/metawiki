"use client";

import { FC, PropsWithChildren } from "react";

import { useQuery } from "@/hooks";
import { profile } from "@/rest/account";
import { getCommonConfig } from "@/rest/public";
import { commonConfigState } from "@/state/config";
import { isLoginState, profileState } from "@/state/profile";
import { AtomsHydrate } from "../atoms-hydrate";

export type ServerStateLoaderProps = PropsWithChildren;

export const ServerStateLoader: FC<ServerStateLoaderProps> = (props) => {
  const { data: profileData } = useQuery({
    queryKey: ["profile"],
    queryFn: () => profile(),
  });
  const { data: commonConfigData } = useQuery({
    queryKey: ["common:config"],
    queryFn: () => getCommonConfig(),
  });

  return (
    <AtomsHydrate
      atomValues={[
        [isLoginState, !!profileData],
        [profileState, profileData],
        [commonConfigState, commonConfigData],
      ]}
    >
      {props.children}
    </AtomsHydrate>
  );
};
