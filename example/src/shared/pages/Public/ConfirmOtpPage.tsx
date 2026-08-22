import { Button, Form, FormProps, Input } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { VerifyOtpRequest } from "@/shared/interfaces/auth";
import { publicRoutesName } from "@/shared/constants/routerName";
import { useAuth } from "@/shared/hooks/useAuth";
import { setFormErrors } from "@/shared/utils/form.util";
import AuthLayout from "@/shared/layout/Public/AuthLayout";

const OTP_EXPIRE_TIME = 60;
const OTP_LENGTH = 6;

interface LocationState {
  email: string;
  type: "register" | "forgot-password";
}

const ConfirmOtpPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = (location.state as LocationState | null) ?? null;
  const email = state?.email;
  const type = state?.type;

  const [form] = Form.useForm<VerifyOtpRequest>();
  const { errors, verifyOtpLoading, verifyOtp, resendOtpLoading, resendOtp } = useAuth();
  const [countdown, setCountdown] = useState<number>(OTP_EXPIRE_TIME);

  // Nếu thiếu state bắt buộc thì đẩy về login
  useEffect(() => {
    if (!email || !type) {
      navigate(publicRoutesName.login, { replace: true });
    }
  }, [email, type, navigate]);

  // Countdown chỉ chạy khi > 0, tự cleanup
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  useEffect(() => {
    if (errors && errors.length > 0) {
      setFormErrors(form, errors);
    }
  }, [errors, form]);

  const onFinish: FormProps["onFinish"] = (values: VerifyOtpRequest) => {
    verifyOtp(values, {
      onSuccess: () => {
        navigate(publicRoutesName.confirmPassword, {
          state: { email, type },
        });
      },
    });
  };

  const handleResendOtp = () => {
    if (resendOtpLoading) return;
    setCountdown(OTP_EXPIRE_TIME);
    resendOtp();
    form.resetFields(["otp"]);
  };

  const subtitle = useMemo(
    () => (
      <span>
        Chúng tôi đã gửi mã OTP gồm {OTP_LENGTH} chữ số tới email{" "}
        <strong className="text-[var(--text-primary)]">{email}</strong>. Vui lòng kiểm tra hộp
        thư đến.
      </span>
    ),
    [email],
  );

  return (
    <AuthLayout
      showBackButton
      title="Nhập mã OTP"
      subtitle={subtitle}
      footer={
        <span>
          Không nhận được mã? Kiểm tra thư mục spam hoặc{" "}
          <button
            type="button"
            disabled={countdown > 0}
            onClick={handleResendOtp}
            className="text-primary font-medium hover:underline disabled:text-[var(--text-secondary)] disabled:cursor-not-allowed disabled:no-underline"
          >
            gửi lại
          </button>
        </span>
      }
    >
      <Form
        form={form}
        name="confirm-otp"
        onFinish={onFinish}
        autoComplete="off"
        layout="vertical"
        className="flex flex-col gap-1"
      >
        <Form.Item
          name="otp"
          rules={[
            { required: true, message: "Vui lòng nhập mã OTP" },
            { len: OTP_LENGTH, message: `Mã OTP gồm ${OTP_LENGTH} chữ số` },
          ]}
          className="!mb-2"
        >
          <Input.OTP length={OTP_LENGTH} size="large" />
        </Form.Item>

        <div className="text-center mb-4">
          {countdown > 0 ? (
            <span className="text-sm text-[var(--text-secondary)]">
              Gửi lại mã sau{" "}
              <strong className="text-primary tabular-nums">{countdown}s</strong>
            </span>
          ) : (
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={resendOtpLoading}
              className="text-sm text-primary font-medium hover:underline disabled:opacity-60"
            >
              {resendOtpLoading ? "Đang gửi lại..." : "Gửi lại mã OTP"}
            </button>
          )}
        </div>

        <Button
          type="primary"
          htmlType="submit"
          loading={verifyOtpLoading}
          className="!h-12 !rounded-xl !text-base !font-medium"
          block
        >
          Xác nhận
        </Button>
      </Form>
    </AuthLayout>
  );
};

export default ConfirmOtpPage;
