import { Button, Checkbox, Form, FormProps, Input } from "antd";
import React, { useEffect } from "react";
import { Icon } from "@iconify/react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { publicRoutesName } from "../../constants/routerName";
import { LoginRequest } from "@/shared/interfaces/auth";
import { useAuth } from "@/shared/hooks/useAuth";
import { setFormErrors } from "@/shared/utils/form.util";
import AuthLayout from "@/shared/layout/Public/AuthLayout";
import {
  passwordRules,
  persistLoginData,
  redirectAfterAuth,
  usernameRules,
} from "@/shared/utils/auth.util";

const LoginPage: React.FC = () => {
  const [form] = Form.useForm<LoginRequest>();
  const rememberMe = Form.useWatch("rememberMe", form);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { errors, loginLoading, login, getInfo } = useAuth();

  // Lấy tham số từ OAuth callback (nếu có)
  const auth = searchParams.get("auth");
  const email = searchParams.get("email");
  const accessToken = searchParams.get("accessToken");
  const refreshToken = searchParams.get("refreshToken");

  const onFinish: FormProps["onFinish"] = (values: LoginRequest) => {
    login(values, {
      rememberMe,
      onSuccess: (res) => {
        persistLoginData(res.data, !!rememberMe);
        // chuyển hướng ngay, không cần setTimeout vì navigate đã xử lý
        redirectAfterAuth(navigate);
      },
    });
  };

  useEffect(() => {
    if (errors && errors.length > 0) {
      setFormErrors(form, errors);
    }
  }, [errors, form]);

  // Xử lý OAuth callback
  useEffect(() => {
    if (auth !== "success" || !email || !accessToken || !refreshToken) return;

    persistLoginData({ refreshToken, accessToken, email }, true);
    getInfo();
    redirectAfterAuth(navigate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth, email, accessToken, refreshToken]);

  return (
    <AuthLayout
      title={
        <span className="flex items-center gap-2">
          Xin chào
          <Icon icon="noto:waving-hand" width="32" height="32" />
        </span>
      }
      subtitle="Vui lòng đăng nhập để tiếp tục sử dụng hệ thống"
      footer={
        <span>
          Chưa có tài khoản?{" "}
          <span className="text-primary font-medium cursor-default ml-1">
            Liên hệ quản trị viên
          </span>
        </span>
      }
    >
      <Form
        form={form}
        name="login"
        initialValues={{ rememberMe: false }}
        onFinish={onFinish}
        autoComplete="off"
        layout="vertical"
        size="large"
        className="flex flex-col gap-1 h-fit"
      >
        <Form.Item name="username" rules={usernameRules as any} className="!mb-3">
          <Input
            prefix={
              <Icon icon="solar:user-linear" width="20" height="20" className="text-gray-400" />
            }
            placeholder="Tên đăng nhập"
            className="!h-12 !rounded-xl"
            classNames={{ prefix: "!mr-2" }}
          />
        </Form.Item>

        <Form.Item name="password" rules={passwordRules as any} className="!mb-2">
          <Input.Password
            prefix={
              <Icon
                icon="solar:lock-keyhole-linear"
                width="20"
                height="20"
                className="text-gray-400"
              />
            }
            placeholder="Mật khẩu"
            className="!h-12 !rounded-xl"
            iconRender={(visible) =>
              visible ? (
                <Icon icon="solar:eye-linear" width="20" height="20" />
              ) : (
                <Icon icon="solar:eye-closed-linear" width="20" height="20" />
              )
            }
            classNames={{ prefix: "!mr-2" }}
          />
        </Form.Item>

        <div className="flex items-center justify-between mb-4">
          <Form.Item name="rememberMe" valuePropName="checked" noStyle>
            <Checkbox className={rememberMe ? "text-primary" : "text-gray-400 hover:text-primary"}>
              Ghi nhớ đăng nhập
            </Checkbox>
          </Form.Item>

          <button
            type="button"
            className="text-sm text-primary hover:underline font-medium"
            onClick={() => navigate(publicRoutesName.forgotPassword)}
          >
            Quên mật khẩu?
          </button>
        </div>

        <Button
          type="primary"
          htmlType="submit"
          loading={loginLoading}
          className="!h-12 !rounded-xl !text-base !font-medium"
          block
        >
          Đăng nhập
        </Button>
      </Form>
    </AuthLayout>
  );
};

export default LoginPage;
