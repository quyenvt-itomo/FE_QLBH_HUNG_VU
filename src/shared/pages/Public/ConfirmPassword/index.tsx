import { Button, Checkbox, Form, FormProps, Input } from "antd";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { publicRoutesName } from "../../../constants/routerName";
import "./index.css";
import { Icon } from "@iconify/react";
import { icons } from "../../../assets/icons";
import { FloatLabel } from "@/shared/components";
import { useAuth } from "@/shared/hooks/useAuth";
import { APP_NAME } from "@/shared/constants/enum";

const ConfirmPasswordPage: React.FC = () => {
  const [form] = Form.useForm<{
    password: string;
    confirmPassword: string;
    isLogout?: boolean;
  }>();
  const [showPassword, setShowPassword] = useState(false);
  const { email } =
    (useLocation()?.state as {
      email: string;
    }) || {};

  const navigate = useNavigate();

  const { errors, resetPasswordLoading, resetPassword } = useAuth();

  useEffect(() => {
    if (!email) {
      navigate(publicRoutesName.login);
    }
  }, []);

  const onFinish: FormProps["onFinish"] = (values: {
    password: string;
    confirmPassword: string;
    isLogout?: boolean;
    storeCode?: string;
    storeName?: string;
  }) => {
    const { password, confirmPassword, isLogout } = values;
    if (password !== confirmPassword) {
      form.setFields([
        {
          name: "confirmPassword",
          errors: ["Mật khẩu nhập lại không khớp"],
        },
      ]);
      return;
    }
    resetPassword(values, {
      onSuccess: () => {
        setTimeout(() => {
          navigate(publicRoutesName.login);
        }, 1000);
      },
    });
  };

  const subText =
    "Bạn đã hoàn tất bước xác thực OTP. Vui lòng nhập mật khẩu mới cho tài khoản của bạn";

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-panel">
      <div className="h-full w-full max-w-[1440px] flex justify-center items-center p-12 gap-16">
        <div className="bg-primary/5 h-full flex-1 rounded-[32px]"></div>

        <div className="w-[446px] flex-shrink-0">
          <div className="flex justify-center items-center gap-2">
            <img src="/logo.png" alt="" className="h-10" />
            <span className="text-4xl font-bold">{APP_NAME}</span>
          </div>
          <div className="flex items-center gap-2 mt-24">
            <span className="font-semibold text-3xl">Hoàn tất đăng ký</span>
          </div>
          <span className="text-base text-gray-500">{subText}</span>
          <Form
            form={form}
            name="basic"
            onFinish={onFinish}
            autoComplete="off"
            layout="vertical"
            size="large"
            className="w-full confirm-password-form mt-6 flex flex-col gap-1"
          >
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập mật khẩu",
                },
                {
                  min: 6,
                  message: "Mật khẩu cần tối thiểu 6 ký tự",
                },
                {
                  pattern: /^\S*$/,
                  message: "Mật khẩu không được chứa khoảng trắng",
                },
              ]}
              className="w-full"
            >
              <FloatLabel label="Mật khẩu" type="primary">
                <Input
                  type={showPassword ? "text" : "password"}
                  className="w-full h-16 border-primary px-4"
                  suffix={
                    <button
                      tabIndex={-1}
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-primary hover:text-primary/80"
                    >
                      {showPassword ? (
                        <Icon icon="solar:eye-linear" width="24" height="24" />
                      ) : (
                        <Icon icon="solar:eye-closed-linear" width="24" height="24" />
                      )}
                    </button>
                  }
                />
              </FloatLabel>
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập lại mật khẩu",
                },
              ]}
              className="w-full"
            >
              <FloatLabel label="Nhập lại mật khẩu" type="primary">
                <Input
                  type={showPassword ? "text" : "password"}
                  className="w-full h-16 border-primary px-4"
                />
              </FloatLabel>
            </Form.Item>
            <div className="flex justify-between">
              <Form.Item
                name="isLogout"
                className="flex items-center w-full"
                valuePropName="checked"
                noStyle
              >
                <Checkbox className="text-[#202224] hover:text-primary transition-colors ease-in-out">
                  Đăng xuất khỏi tất cả thiết bị
                </Checkbox>
              </Form.Item>
            </div>

            <Button
              type="primary"
              htmlType="submit"
              loading={resetPasswordLoading}
              className="w-full h-16 mt-8  rounded-xl"
            >
              Hoàn tất
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ConfirmPasswordPage;
