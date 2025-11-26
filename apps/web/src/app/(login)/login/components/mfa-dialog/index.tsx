import { Dialog, type DialogProps } from "@meta-1/design";
import { OTPInput } from "@/components/common/input/otp";
import { t } from "@/utils/locale.client";

export type MFADialogProps<T> = DialogProps & {
  onSubmit: (values: T, submitting?: boolean) => void;
  formData: T | null;
  isPending: boolean;
};

export const MFADialog = <T = unknown>(props: MFADialogProps<T>) => {
  const { visible, onCancel, formData, onSubmit, isPending, ...rest } = props;

  return (
    <Dialog
      className="!max-w-[360px]"
      loading={isPending}
      maskClosable={false}
      onCancel={onCancel}
      title={t("二次验证")}
      visible={visible}
      {...rest}
    >
      <div className="flex flex-col items-center gap-2 overflow-x-hidden p-xs">
        <OTPInput
          onChange={(otpCode) => {
            if (otpCode.length === 6) {
              onSubmit({ ...formData!, otpCode });
            }
          }}
        />
        <div className="text-center text-secondary-foreground text-sm">{t("请输入身份验证 App 验证码")}</div>
      </div>
    </Dialog>
  );
};
