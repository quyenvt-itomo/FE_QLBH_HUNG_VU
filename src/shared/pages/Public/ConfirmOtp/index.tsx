import { Button, Form, FormProps, Input } from "antd";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import "./index.css";
import { Icon } from "@iconify/react";
import { useLocation, useNavigate } from "react-router-dom";
import { VerifyOtpRequest } from "@/shared/interfaces/auth";
import { publicRoutesName } from "@/shared/constants/routerName";
import { useAuth } from "@/shared/hooks/useAuth";
import { setFormErrors } from "@/shared/utils/form.util";
import { icons } from "@/shared/assets/icons";
import { APP_NAME } from "@/shared/constants/enum";

const OTP_EXPIRE_TIME = 60;

const ConfirmOtpPage: React.FC = () => {
  const { email, type } =
    (useLocation()?.state as {
      email: string;
      type: "register" | "forgot-password";
    }) || {};

  const [form] = Form.useForm<VerifyOtpRequest>();
  const { errors, verifyOtpLoading, verifyOtp, resendOtpLoading, resendOtp } = useAuth();
  const navigate = useNavigate();

  const [countdown, setCountdown] = useState<number>(OTP_EXPIRE_TIME);

  useEffect(() => {
    if (!email || !type) {
      navigate(publicRoutesName.login);
    }
  }, []);

  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  useEffect(() => {
    if (!errors) return;
    setFormErrors(form, errors);
  }, [errors, form]);

  const onFinish: FormProps["onFinish"] = (values) => {
    verifyOtp(values);
  };

  const handleResendOtp = () => {
    setCountdown(OTP_EXPIRE_TIME);

    resendOtp();

    form.resetFields(["otp"]);
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-panel">
      <div className="h-full w-full max-w-[1440px] flex justify-center items-center p-12 gap-16">
        <div className="bg-primary/5 h-full flex-1 rounded-[32px]" />

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

          <div className="font-semibold text-3xl mt-4">Nhập mã OTP</div>
          <span className="text-base text-gray-500">
            Chúng tôi đã gửi mã OTP đến email <strong>{email}</strong>, vui lòng kiểm tra hộp thư
            đến.
          </span>

          <Form
            form={form}
            onFinish={onFinish}
            autoComplete="off"
            layout="vertical"
            className="w-full mt-6 flex flex-col gap-1 confirm-otp-form"
            size="large"
          >
            <Form.Item
              name="otp"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập mã OTP",
                },
              ]}
              className="w-full"
            >
              <Input.OTP size="large" />
            </Form.Item>

            {/* ⏱ Countdown / Resend */}
            <div className="text-center mt-2">
              {countdown > 0 ? (
                <span className="text-gray-500 text-sm">
                  Gửi lại OTP sau <strong>{countdown}s</strong>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="text-primary text-sm font-medium hover:underline"
                >
                  Gửi lại mã OTP
                </button>
              )}
            </div>

            <Button
              type="primary"
              htmlType="submit"
              loading={verifyOtpLoading}
              className="w-full h-16 mt-4  rounded-xl"
            >
              Xác nhận
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ConfirmOtpPage;
