"use client";

import "@/plugin/rest.client";
import "@/plugin/locales";
import "@/plugin/formatters";

import { type FC, type PropsWithChildren } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import i18next from "i18next";
import { ThemeProvider } from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { I18nextProvider } from "react-i18next";

import { ConfigProvider } from "@meta-1/design";
import locales from "@/config/locale";
import { getQueryClient } from "@/utils/query";
import "@/plugin/locales";
import { Provider } from "jotai";

import { AtomsHydrate } from "@/components/common/atoms-hydrate";
import { ThemeSyncProvider } from "@/components/common/theme-sync-provider";
import { localeState } from "@/state/public";

export type RootLayoutProps = PropsWithChildren<{
  locale: string;
  theme: string;
}>;

export const RootLayout: FC<RootLayoutProps> = (props) => {
  const { locale, theme, children } = props;

  i18next.changeLanguage(locale);
  const queryClient = getQueryClient();

  return (
    <Provider>
      <AtomsHydrate atomValues={[[localeState, locale]]}>
        <NuqsAdapter>
          <I18nextProvider defaultNS="translation" i18n={i18next}>
            <ConfigProvider locale={locales[locale]}>
              <ThemeProvider attribute="class" defaultTheme={theme} enableSystem>
                <ThemeSyncProvider>
                  <QueryClientProvider client={queryClient}>
                    {children}
                    <ReactQueryDevtools initialIsOpen={false} />
                  </QueryClientProvider>
                </ThemeSyncProvider>
              </ThemeProvider>
            </ConfigProvider>
          </I18nextProvider>
        </NuqsAdapter>
      </AtomsHydrate>
    </Provider>
  );
};
