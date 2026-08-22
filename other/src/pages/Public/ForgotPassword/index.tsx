import { Button, Form, FormProps, Input } from "antd";
import React, { useEffect } from "react";
import FloatLabel from "../../../components/display/FloatLabel";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../stores";
import "./index.css";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import { icons } from "../../../assets/icons";
import { forgotPassword, resetForgotPassword } from "../../../stores/auth/slice";
import { ForgotPasswordRequest } from "../../../models/base/auth";
import { publicRoutesName } from "../../../constants/routerName";
import { setFormErrors } from "../../../utils/formUtils";

const ForgotPasswordPage: React.FC = () => {
  const [form] = Form.useForm<ForgotPasswordRequest>();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const email = Form.useWatch("email", form);

  const { isCheckForgotPassword, loading, errors } = useSelector(
    (state: RootState) => state.Auth,
    shallowEqual,
  );

  useEffect(() => {
    if (!isCheckForgotPassword) return;

    dispatch(resetForgotPassword());
    navigate(publicRoutesName.confirmOtp, {
      state: { email, type: "forgot-password" },
    });
  }, [isCheckForgotPassword]);

  useEffect(() => {
    if (!errors) return;
    setFormErrors(form, errors);
  }, [errors, form]);

  const onFinish: FormProps["onFinish"] = (values) => {
    dispatch(forgotPassword(values));
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-white">
      <div className="h-full w-full max-w-[1440px] flex justify-center items-center p-12 gap-16">
        <div className="bg-primary/5 h-full flex-1 rounded-[32px]"></div>
        <div className="w-[446px] flex-shrink-0">
          <div className="flex justify-center items-center gap-2">
            <img src={icons.logo} alt="" className="h-14" />
            <img src={icons.logoText} alt="" className="h-8" />
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
              loading={loading}
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
