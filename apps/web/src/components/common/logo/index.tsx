import { type PropsWithChildren } from "react";
import classNames from "classnames";

export type LogoType = "normal" | "light" | "dark";

interface LogoProps extends PropsWithChildren {
  className?: string;
}

const Logo = (props: LogoProps) => {
  const { className } = props;

  return (
    <div
      className={classNames(
        "bg-[url(@/assets/image/logo/light.png)] dark:bg-[url(@/assets/image/logo/dark.png)]",
        "bg-center bg-contain bg-no-repeat",
        className,
      )}
    />
  );
};

export default Logo;
