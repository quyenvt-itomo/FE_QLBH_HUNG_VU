import { Button, Form, FormProps, Input } from "antd";
import React, { useEffect } from "react";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import { ForgotPasswordRequest } from "@/shared/interfaces/auth";
import { useAuth } from "@/shared/hooks/useAuth";
import { setFormErrors } from "@/shared/utils/form.util";
import { publicRoutesName } from "@/shared/constants/routerName";
import AuthLayout from "@/shared/layout/Public/AuthLayout";
import { emailRules } from "@/shared/utils/auth.util";

const ForgotPasswordPage: React.FC = () => {
  const [form] = Form.useForm<ForgotPasswordRequest>();
  const navigate = useNavigate();
  const email = Form.useWatch("email", form);
  const { errors, forgotPasswordLoading, forgotPassword } = useAuth();

  useEffect(() => {
    if (errors && errors.length > 0) {
      setFormErrors(form, errors);
    }
  }, [errors, form]);

  const onFinish: FormProps["onFinish"] = (values: ForgotPasswordRequest) => {
    forgotPassword(values, {
      onSuccess: () => {
        navigate(publicRoutesName.confirmOtp, {
          state: { email, type: "forgot-password" },
        });
      },
    });
  };

  return (
    <AuthLayout
      showBackButton
      title="Quên mật khẩu"
      subtitle="Nhập email đã đăng ký, chúng tôi sẽ gửi mã OTP để xác nhận và đặt lại mật khẩu của bạn."
      footer={
        <span>
          Nhớ mật khẩu rồi?{" "}
          <button
            type="button"
            className="text-primary font-medium hover:underline"
            onClick={() => navigate(publicRoutesName.login)}
          >
            Đăng nhập
          </button>
        </span>
      }
    >
      <Form
        form={form}
        name="forgot-password"
        onFinish={onFinish}
        autoComplete="off"
        layout="vertical"
        size="large"
        className="flex flex-col gap-1"
      >
        <Form.Item name="email" rules={emailRules as any} className="!mb-4">
          <Input
            prefix={
              <Icon
                icon="solar:letter-linear"
                width="20"
                height="20"
                className="text-[var(--text-secondary)]"
              />
            }
            placeholder="Email"
            className="!h-12 !rounded-xl"
          />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          loading={forgotPasswordLoading}
          className="!h-12 !rounded-xl !text-base !font-medium"
          block
        >
          Gửi mã OTP
        </Button>
      </Form>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
