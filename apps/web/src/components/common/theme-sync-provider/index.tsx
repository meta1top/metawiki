import { type PropsWithChildren, useEffect } from "react";
import { setCookie } from "cookies-next";
import { useTheme } from "next-themes";

import { getRootDomain, isServer } from "@/utils";

export const ThemeSyncProvider = ({ children }: PropsWithChildren) => {
  const { theme } = useTheme();

  if (!isServer) {
    localStorage.removeItem("theme");
  }

  useEffect(() => {
    if (theme) {
      setCookie("theme", theme, {
        domain: getRootDomain(window.location.hostname),
      });
    }
  }, [theme]);
  return children;
};
