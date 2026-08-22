import { useMutation } from "@tanstack/react-query";
import { apiEndpoint } from "@/shared/constants/apiEndpoint";
import { getData, postData, putData } from "@/shared/api/apiClient";
import { useErrorState } from "./useErrorState";
import { handleErrorMessage } from "../utils/handleMessageError";
import { ApiResponse, BaseFailurePayload } from "../interfaces/api";
import {
  ChangePasswordRequest,
  ConfirmPasswordRequest,
  ForgotPasswordRequest,
  LoginRequest,
  UserInfo,
  VerifyOtpRequest,
} from "../interfaces/auth";
import { useGlobalData } from "./useGlobalData";

export const useAuth = () => {
  const { handleSetInfo } = useGlobalData();
  const { notify, errors, onError } = useErrorState();

  // ===== LOGIN =====
  const loginMutation = useMutation<ApiResponse, BaseFailurePayload, LoginRequest>({
    mutationFn: (data) => postData(apiEndpoint.auth.login, data),
  });
  const login = (
    data: LoginRequest,
    opts?: {
      rememberMe?: boolean;
      onSuccess?: (res: any) => void;
    },
  ) => {
    loginMutation.mutate(data, {
      onSuccess: (res) => {
        notify("success", "Đăng nhập thành công");
        opts?.onSuccess?.(res);
        console.log({
          res,
        });
        if (opts?.rememberMe) {
          localStorage.setItem("loginData", JSON.stringify(res.data));
        } else {
          sessionStorage.setItem("loginData", JSON.stringify(res.data));
        }
        getInfo();
      },
      onError,
    });
  };

  // ===== GET INFO =====
  const getInfoMutation = useMutation<ApiResponse, BaseFailurePayload>({
    mutationFn: () => getData(apiEndpoint.auth.info),
  });
  const getInfo = (opts?: { onSuccess?: (res: any) => void }) => {
    getInfoMutation.mutate(undefined, {
      onSuccess: (res) => {
        handleSetInfo(res.data);
        opts?.onSuccess?.(res);
      },
    });
  };

  // ===== LOGOUT =====
  const logoutMutation = useMutation({
    mutationFn: (data?: any) => postData(apiEndpoint.auth.logout, data),
  });
  const logout = (data?: any, opts?: { onSuccess?: () => void }) => {
    notify("success", "Đăng xuất thành công");
    handleSetInfo(null);
    opts?.onSuccess?.();
    localStorage.removeItem("loginData");
    localStorage.removeItem("currentCompany");
    sessionStorage.removeItem("loginData");

    logoutMutation.mutate(data, {
      onError: (err: any) => {
        const errorData = handleErrorMessage(err);
        console.error({ errorData });
      },
    });
  };

  // ===== UPDATE INFO =====
  const updateInfoMutation = useMutation<ApiResponse, BaseFailurePayload, UserInfo>({
    mutationFn: (data: any) => putData(apiEndpoint.auth.updateInfo, data),
  });
  const updateInfo = (data: any, opts?: { onSuccess?: () => void }) => {
    updateInfoMutation.mutate(data, {
      onSuccess: (res) => {
        notify("success", "Cập nhật thông tin thành công");
        getInfo();
        opts?.onSuccess?.();
      },
      onError,
    });
  };

  // ===== CHANGE PASSWORD =====
  const changePasswordMutation = useMutation<
    ApiResponse,
    BaseFailurePayload,
    ChangePasswordRequest
  >({
    mutationFn: (data) => putData(apiEndpoint.auth.changePassword, data),
  });
  const changePassword = (data: ChangePasswordRequest, opts?: { onSuccess?: () => void }) => {
    changePasswordMutation.mutate(data, {
      onSuccess: () => {
        notify("success", "Đổi mật khẩu thành công");
        opts?.onSuccess?.();
      },
      onError,
    });
  };

  // ===== FORGOT PASSWORD =====
  const forgotPasswordMutation = useMutation<
    ApiResponse,
    BaseFailurePayload,
    ForgotPasswordRequest
  >({
    mutationFn: (data) => postData(apiEndpoint.auth.forgotPassword, data),
  });
  const forgotPassword = (data: ForgotPasswordRequest, opts?: { onSuccess?: () => void }) => {
    forgotPasswordMutation.mutate(data, {
      onSuccess: () => {
        notify("success", "Đã gửi yêu cầu");
        opts?.onSuccess?.();
      },
      onError,
    });
  };

  // ===== RESET PASSWORD =====
  const resetPasswordMutation = useMutation<
    ApiResponse,
    BaseFailurePayload,
    ConfirmPasswordRequest
  >({
    mutationFn: (data) => postData(apiEndpoint.auth.resetPassword, data),
  });
  const resetPassword = (data: ConfirmPasswordRequest, opts?: { onSuccess?: () => void }) => {
    resetPasswordMutation.mutate(data, {
      onSuccess: () => {
        notify("success", "Đặt lại mật khẩu thành công");
        opts?.onSuccess?.();
      },
      onError,
    });
  };

  // ===== VERIFY OTP =====
  const verifyOtpMutation = useMutation<ApiResponse, BaseFailurePayload, VerifyOtpRequest>({
    mutationFn: (data) => postData(apiEndpoint.auth.verifyOtp, data),
  });
  const verifyOtp = (data: VerifyOtpRequest, opts?: { onSuccess?: () => void }) => {
    verifyOtpMutation.mutate(data, {
      onSuccess: () => {
        notify("success", "Xác thực OTP thành công");
        opts?.onSuccess?.();
      },
      onError,
    });
  };

  // ===== RESEND OTP =====
  const resendOtpMutation = useMutation<ApiResponse, BaseFailurePayload, void>({
    mutationFn: () => postData(apiEndpoint.auth.resendOtp, {}),
  });
  const resendOtp = (opts?: { onSuccess?: () => void }) => {
    resendOtpMutation.mutate(undefined, {
      onSuccess: () => {
        notify("success", "Gửi lại mã OTP thành công");
        opts?.onSuccess?.();
      },
      onError,
    });
  };

  return {
    errors,

    login,
    loginLoading: loginMutation.isPending,

    getInfo,

    logout,
    logoutLoading: logoutMutation.isPending,

    updateInfo,
    updateInfoLoading: updateInfoMutation.isPending,

    changePassword,
    changePasswordLoading: changePasswordMutation.isPending,

    resetPassword,
    resetPasswordLoading: resetPasswordMutation.isPending,

    forgotPassword,
    forgotPasswordLoading: forgotPasswordMutation.isPending,

    verifyOtp,
    verifyOtpLoading: verifyOtpMutation.isPending,

    resendOtp,
    resendOtpLoading: resendOtpMutation.isPending,
  };
};
