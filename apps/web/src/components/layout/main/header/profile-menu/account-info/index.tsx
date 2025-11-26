import type { FC } from "react";

import { Avatar } from "@meta-1/design";
import { useProfile } from "@/hooks";

export type AccountAvatarProps = {
  className?: string;
};

export const AccountAvatar: FC<AccountAvatarProps> = (props) => {
  const { className } = props;
  const account = useProfile();
  return <Avatar alt="cover" className={className} src={account?.avatar ?? "/assets/image/avatar.jpeg"} />;
};

export const AccountInfo = () => {
  const account = useProfile();
  return (
    <div className="flex w-full items-center justify-start gap-3 p-2">
      <AccountAvatar className="size-10" />
      <div className="flex-1 break-all">
        <div className="text-md">{account?.username}</div>
        <div className="text-secondary-foreground/50 text-sm">{account?.email}</div>
      </div>
    </div>
  );
};
