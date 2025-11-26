"use client";

import { useTranslation } from "react-i18next";

export const HomePage = () => {
  const { t } = useTranslation();
  return (
    <div className="container py-md">
      <div className="text-center">
        <h1 className="font-bold text-2xl">{t("欢迎")}</h1>
      </div>
    </div>
  );
};
