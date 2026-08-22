import { Button, Checkbox, Form, FormProps, Input } from "antd";
import React, { useEffect } from "react";
import { Icon } from "@iconify/react";
import { useLocation, useNavigate } from "react-router-dom";
import { publicRoutesName } from "../../constants/routerName";
import { useAuth } from "@/shared/hooks/useAuth";
import { setFormErrors } from "@/shared/utils/form.util";
import AuthLayout from "@/shared/layout/Public/AuthLayout";
import { passwordRules } from "@/shared/utils/auth.util";
import { ConfirmPasswordRequest } from "@/shared/interfaces/auth";

interface LocationState {
  email: string;
}

interface FormValues extends ConfirmPasswordRequest {
  confirmPassword: string;
}

const ConfirmPasswordPage: React.FC = () => {
  const [form] = Form.useForm<FormValues>();
  const location = useLocation();
  const navigate = useNavigate();
  const email = (location.state as LocationState | null)?.email;

  const { errors, resetPasswordLoading, resetPassword } = useAuth();

  useEffect(() => {
    if (!email) {
      navigate(publicRoutesName.login, { replace: true });
    }
  }, [email, navigate]);

  useEffect(() => {
    if (errors && errors.length > 0) {
      setFormErrors(form, errors);
    }
  }, [errors, form]);

  const onFinish: FormProps["onFinish"] = (values: FormValues) => {
    const { password, confirmPassword, isLogout } = values;
    if (password !== confirmPassword) {
      form.setFields([
        { name: "confirmPassword", errors: ["Mật khẩu nhập lại không khớp"] },
      ]);
      return;
    }

    resetPassword(
      { password, isLogout },
      {
        onSuccess: () => {
          navigate(publicRoutesName.login, { replace: true });
        },
      },
    );
  };

  return (
    <AuthLayout
      showBackButton
      title="Đặt mật khẩu mới"
      subtitle="Bạn đã hoàn tất xác thực OTP. Hãy nhập mật khẩu mới cho tài khoản của bạn."
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
        name="confirm-password"
        onFinish={onFinish}
        autoComplete="off"
        layout="vertical"
        size="large"
        className="flex flex-col gap-1"
      >
        <Form.Item name="password" rules={passwordRules as any} className="!mb-3">
          <Input.Password
            prefix={
              <Icon
                icon="solar:lock-keyhole-linear"
                width="20"
                height="20"
                className="text-[var(--text-secondary)]"
              />
            }
            placeholder="Mật khẩu mới"
            className="!h-12 !rounded-xl"
            iconRender={(visible) =>
              visible ? (
                <Icon icon="solar:eye-linear" width="20" height="20" />
              ) : (
                <Icon icon="solar:eye-closed-linear" width="20" height="20" />
              )
            }
          />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          dependencies={["password"]}
          rules={[
            { required: true, message: "Vui lòng nhập lại mật khẩu" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Mật khẩu nhập lại không khớp"));
              },
            }),
          ]}
          className="!mb-2"
        >
          <Input.Password
            prefix={
              <Icon
                icon="solar:lock-keyhole-linear"
                width="20"
                height="20"
                className="text-[var(--text-secondary)]"
              />
            }
            placeholder="Nhập lại mật khẩu"
            className="!h-12 !rounded-xl"
            iconRender={(visible) =>
              visible ? (
                <Icon icon="solar:eye-linear" width="20" height="20" />
              ) : (
                <Icon icon="solar:eye-closed-linear" width="20" height="20" />
              )
            }
          />
        </Form.Item>

        <div className="mb-4">
          <Form.Item name="isLogout" valuePropName="checked" noStyle>
            <Checkbox className="text-[var(--text-secondary)] hover:text-primary">
              Đăng xuất khỏi tất cả thiết bị
            </Checkbox>
          </Form.Item>
        </div>

        <Button
          type="primary"
          htmlType="submit"
          loading={resetPasswordLoading}
          className="!h-12 !rounded-xl !text-base !font-medium"
          block
        >
          Hoàn tất
        </Button>
      </Form>
    </AuthLayout>
  );
};

export default ConfirmPasswordPage;
