import Link from "next/link";
import { useTranslation } from "react-i18next";

import { DropdownMenuContent, DropdownMenuItem } from "@meta-1/design";
export const Profile = () => {
  const { t } = useTranslation();

  return (
    <DropdownMenuContent align="start" className="w-48">
      <Link href="/profile/security/mfa">
        <DropdownMenuItem>{t("OTP设置")}</DropdownMenuItem>
      </Link>
    </DropdownMenuContent>
  );
};
