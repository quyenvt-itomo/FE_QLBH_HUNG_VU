import { Button, Checkbox, Form, FormProps, Input } from "antd";
import React, { useEffect } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { RootState } from "../../../stores";
import { getInfo, login, resetLogin } from "../../../stores/auth/slice";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LoginRequest } from "../../../models/base/auth";
import { PageProps } from "../../../utils/types/layout";
import { privateRoutesName, publicRoutesName } from "../../../constants/routerName";
import "./index.css";
import { Icon } from "@iconify/react";
import { icons } from "../../../assets/icons";
import FloatLabel from "../../../components/display/FloatLabel";
import { setFormErrors } from "../../../utils/formUtils";
import loginImage from "../../../assets/login.jpg";

const LoginPage: React.FC<PageProps> = () => {
  const [form] = Form.useForm<LoginRequest>();
  const rememberMe = Form.useWatch("rememberMe", form);
  const [searchParams] = useSearchParams();
  // lấy auth và email từ requests do BE trả về nếu đăng nhập bằng OAuth
  const auth = searchParams.get("auth");
  const email = searchParams.get("email");
  const accessToken = searchParams.get("accessToken");
  const refreshToken = searchParams.get("refreshToken");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onFinish: FormProps["onFinish"] = (values: LoginRequest) => {
    dispatch(login(values));
  };

  const { loginData, loading, errors } = useSelector(
    (state: RootState) => state.Auth,
    shallowEqual,
  );

  useEffect(() => {
    if (!errors || errors.length === 0) return;

    setFormErrors(form, errors);
  }, [errors]);

  useEffect(() => {
    if (auth === "success" && email && accessToken && refreshToken) {
      const oauthLoginData = {
        refreshToken,
        accessToken,
        email,
      };

      localStorage.setItem("loginData", JSON.stringify(oauthLoginData));

      setTimeout(() => {
        const redirectPath = sessionStorage.getItem("redirectPath");
        if (redirectPath) {
          navigate(redirectPath);
          sessionStorage.removeItem("redirectPath");
        } else {
          navigate(privateRoutesName.dashboard);
        }
      }, 1000);

      dispatch(getInfo());
    }
  }, [auth, email, accessToken, refreshToken]);

  useEffect(() => {
    if (loginData) {
      if (rememberMe) {
        localStorage.setItem("loginData", JSON.stringify(loginData));
      } else {
        sessionStorage.setItem("loginData", JSON.stringify(loginData));
      }

      setTimeout(() => {
        const redirectPath = sessionStorage.getItem("redirectPath");
        if (redirectPath) {
          navigate(redirectPath);
          sessionStorage.removeItem("redirectPath");
        } else {
          navigate(privateRoutesName.dashboard);
        }
      }, 1000);
      dispatch(getInfo());
      dispatch(resetLogin());
    }
  }, [loginData, form]);

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-white">
      <div className="h-full w-full max-w-[1440px] flex justify-center items-center p-12 gap-16">
        <div className="bg-primary/5 h-full flex-1 rounded-[32px] flex items-center justify-center">
          <img src={icons.adminAmico} className="h-[462px]" alt="" />
        </div>

        <div className="w-[446px] flex-shrink-0">
          <div className="flex justify-center items-center gap-2">
            <img src={icons.logo} alt="" className="h-14" />
            <img src={icons.logoText} alt="" className="h-8" />
          </div>
          <div className="flex items-center gap-2 mt-24">
            <span className="font-semibold text-3xl">Xin chào</span>
            <Icon icon="noto:waving-hand" width="32" height="32" />
          </div>
          <span className="text-base text-gray-500">Vui lòng đăng nhập để sử dụng</span>

          <Form
            form={form}
            name="basic"
            initialValues={{ rememberMe: false }}
            onFinish={onFinish}
            autoComplete="off"
            layout="vertical"
            size="large"
            className="w-full login-form mt-6 flex flex-col gap-1"
          >
            <Form.Item
              name="identifier"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập Email",
                },
              ]}
              className="w-full"
            >
              <FloatLabel label="Email Address" type="primary">
                <Input className="w-full h-16 border-primary px-4" />
              </FloatLabel>
            </Form.Item>

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
                <Input.Password
                  className="w-full h-16 border-primary px-4"
                  iconRender={(visible) =>
                    visible ? (
                      <Icon icon="solar:eye-linear" width="24" height="24" />
                    ) : (
                      <Icon icon="solar:eye-closed-linear" width="24" height="24" />
                    )
                  }
                />
              </FloatLabel>
            </Form.Item>

            <div className="flex justify-between">
              <Form.Item
                name="rememberMe"
                className="flex items-center w-full"
                valuePropName="checked"
                noStyle
              >
                <Checkbox className="text-[#202224]">Giữ tôi luôn đăng nhập</Checkbox>
              </Form.Item>

              <button
                type="button"
                className="text-primary"
                onClick={() => {
                  navigate(publicRoutesName.forgotPassword);
                }}
              >
                Quên mật khẩu?
              </button>
            </div>

            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="w-full h-16 mt-8  rounded-xl"
            >
              Đăng nhập
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
