"use client";

import { useState } from "react";
import cloneDeep from "lodash/cloneDeep";
import { useTranslation } from "react-i18next";

import { Button, Form, FormItem, Input } from "@meta-1/design";
import { SendCodeData } from "@meta-1/nest-types";
import { RegisterData, RegisterSchema } from "@meta-1/wiki-types";
import { EmailCodeInput } from "@/components/common/input/email-code";
import { useEncrypt, useMutation } from "@/hooks";
import { register } from "@/rest/account";
import { sendEmailCode } from "@/rest/public";
import { setToken } from "@/utils/token";

export const RegisterPage = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<RegisterData | undefined>();
  const encrypt = useEncrypt();

  const { mutate, isPending } = useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      if (data) {
        setToken(data);
        location.href = "/";
      }
    },
  });

  const onSubmit = (data: RegisterData) => {
    const cloneData = cloneDeep(data);
    cloneData.password2 = "";
    cloneData.password = encrypt(cloneData.password);
    mutate(cloneData);
  };

  return (
    <div className="w-[360px]">
      <Form<RegisterData>
        onSubmit={onSubmit}
        onValuesChange={(data) => setFormData(data as RegisterData)}
        schema={RegisterSchema}
      >
        <FormItem label={t("邮箱")} name="email">
          <Input placeholder={t("请输入正确的邮箱")} />
        </FormItem>
        <FormItem label={t("邮箱验证码")} name="code">
          <EmailCodeInput<SendCodeData>
            api={sendEmailCode}
            data={{ email: formData?.email || "", action: "register" }}
            needEmail={true}
            placeholder={t("请输入邮箱验证码")}
          />
        </FormItem>
        <FormItem label={t("密码")} name="password">
          <Input placeholder={t("请输入密码")} type="password" />
        </FormItem>
        <FormItem label={t("确认密码")} name="password2">
          <Input placeholder={t("请再次输入密码")} type="password" />
        </FormItem>
        <Button className="mt-sm" loading={isPending} long type="submit">
          {t("注册")}
        </Button>
      </Form>
    </div>
  );
};
