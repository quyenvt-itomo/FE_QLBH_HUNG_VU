import { Button, Form, FormProps, Input } from "antd";
import React, { useEffect } from "react";
import FloatLabel from "../../../components/display/FloatLabel";
import "./index.css";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import { ForgotPasswordRequest } from "@/shared/interfaces/auth";
import { useAuth } from "@/shared/hooks/useAuth";
import { setFormErrors } from "@/shared/utils/form.util";
import { publicRoutesName } from "@/shared/constants/routerName";
import { icons } from "@/shared/assets/icons";
import { APP_NAME } from "@/shared/constants/enum";

const ForgotPasswordPage: React.FC = () => {
  const [form] = Form.useForm<ForgotPasswordRequest>();
  const navigate = useNavigate();

  const email = Form.useWatch("email", form);

  const { errors, forgotPasswordLoading, forgotPassword } = useAuth();

  useEffect(() => {
    if (!errors) return;
    setFormErrors(form, errors);
  }, [errors, form]);

  const onFinish: FormProps["onFinish"] = (values) => {
    forgotPassword(values, {
      onSuccess: () => {
        navigate(publicRoutesName.confirmOtp, {
          state: { email, type: "forgot-password" },
        });
      },
    });
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="h-full w-full max-w-[1440px] flex justify-center items-center p-12 gap-16">
        <div className="bg-primary/5 h-full flex-1 rounded-[32px] flex items-center justify-center">
          <img src={icons.adminAmico} className="h-[462px]" alt="" />
        </div>
        <div className="w-[446px] flex-shrink-0">
          <div className="flex justify-center items-center gap-2">
            <img src="/logo.png" alt="" className="h-10" />
            <span className="text-4xl font-bold">{APP_NAME}</span>
          </div>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center text-base hover:text-primary transition-colors ease-in-out mt-24"
          >
            <Icon icon="solar:alt-arrow-left-linear" width="24" height="24" />
            Quay lại
          </button>
          <div className="font-semibold text-3xl mt-4">Quên mật khẩu</div>
          <span className="text-base text-gray-500">Vui lòng đăng nhập để sử dụng</span>
          <Form
            form={form}
            onFinish={onFinish}
            autoComplete="off"
            layout="vertical"
            className="w-full mt-6 flex flex-col gap-1 forgot-password-form"
            size="large"
          >
            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập tên Email",
                },
              ]}
              className="w-full"
            >
              <FloatLabel label="Email Address" type="primary">
                <Input className="w-full h-16 border-primary px-4" />
              </FloatLabel>
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              loading={forgotPasswordLoading}
              className="w-full h-16 mt-4  rounded-xl"
            >
              Gửi mã OTP
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
