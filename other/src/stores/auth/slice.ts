import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  ChangePasswordRequest,
  LoginRequest,
  UserInfo,
  LoginData,
  VerifyOtpRequest,
  ConfirmPasswordRequest,
  SettingData,
} from "../../models/base/auth";
import { BaseError, BaseFailurePayload } from "../baseReducers";
import { MessageToastModel } from "../../models/base/interface";
import { TypeMessage } from "../../constants/enum";
import { ApiResponse, PaginationProps, SummaryData } from "../../models/base/api";
import { AUTH_MESSAGES } from "../../constants/message/auth";
import { IShift, ShiftQuery, ShiftResponse } from "../../models/store/shift";

export interface AuthState {
  loginData: LoginData | null;
  settingData: SettingData | null;
  loading: boolean;
  errors: BaseError[] | null;
  message: MessageToastModel;
  userInfo: UserInfo | null;
  isCheckUpdateInfo: boolean;
  isCheckUnAuthor: boolean;
  isCheckChangePassword: boolean;
  isCheckForgotPassword: boolean;
  isCheckVerifyOtp: boolean;
  isCheckResetPassword?: boolean;
  isCheckResendOtp?: boolean;

  shiftData: IShift[];
  shiftLoading: boolean;
  shiftPagination?: PaginationProps | null;
  shiftSummary?: SummaryData | null;
}

const initialState: AuthState = {
  loginData: null,
  settingData: null,
  loading: false,
  errors: null,
  message: { type: TypeMessage.none },
  userInfo: null,
  isCheckUpdateInfo: false,
  isCheckUnAuthor: false,
  isCheckChangePassword: false,
  isCheckForgotPassword: false,
  isCheckVerifyOtp: false,
  isCheckResetPassword: false,
  isCheckResendOtp: false,

  shiftData: [],
  shiftLoading: false,
  shiftPagination: null,
  shiftSummary: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearMessage: (state) => {
      state.message = {
        type: TypeMessage.none,
      };
    },

    getShift(state, action: PayloadAction<ShiftQuery>) {
      state.shiftLoading = true;
    },
    getShiftSuccess(state, action: PayloadAction<ShiftResponse>) {
      state.shiftData = action.payload.data;
      state.shiftPagination = action.payload.pagination;
      state.shiftLoading = false;
    },
    getShiftFailure(state, action: PayloadAction<BaseFailurePayload>) {
      state.shiftLoading = false;
      state.errors = action.payload.errors;
      state.message = {
        type: TypeMessage.error,
        message: action.payload.message,
      };
    },

    resetErrors: (state) => {
      state.errors = null;
    },

    resetLogin: (state) => {
      state.loginData = null;
    },

    //login
    login: (state, _action: PayloadAction<LoginRequest>) => {
      state.loading = true;
    },
    loginSuccess: (state, action: PayloadAction<ApiResponse<LoginData>>) => {
      state.loading = false;
      state.loginData = action.payload?.data || null;
      state.message = {
        type: TypeMessage.success,
        message: AUTH_MESSAGES.LOGIN,
      };
    },
    loginFailure: (state, action: PayloadAction<BaseFailurePayload>) => {
      state.loading = false;
      state.errors = action.payload.errors;
      state.message = {
        type: TypeMessage.error,
        message: action.payload.message,
      };
    },

    getInfo: (state) => {
      state.loading = true;
    },
    getInfoSuccess: (state, action: PayloadAction<ApiResponse<UserInfo>>) => {
      state.loading = false;
      state.userInfo = action.payload.data || null;
    },
    getInfoFailure: (state, action: PayloadAction<BaseFailurePayload>) => {
      state.loading = false;
      state.errors = action.payload.errors;
      state.message = {
        type: TypeMessage.error,
        message: action.payload.message,
      };
    },

    updateInfo: (state, action: PayloadAction<UserInfo>) => {
      state.loading = true;
    },
    updateInfoSuccess: (state, action: PayloadAction<ApiResponse>) => {
      state.loading = false;
      state.message = {
        type: TypeMessage.success,
        message: AUTH_MESSAGES.UPDATE,
      };
      state.isCheckUpdateInfo = true;
    },
    updateInfoFailure: (state, action: PayloadAction<BaseFailurePayload>) => {
      state.loading = false;
      state.message = {
        type: TypeMessage.error,
        message: action.payload.message,
      };
      state.errors = action.payload.errors;
    },

    getSetting: (state) => {
      state.loading = true;
    },
    getSettingSuccess: (state, action: PayloadAction<ApiResponse>) => {
      state.loading = false;
      state.settingData = action.payload.data;
    },
    getSettingFailure: (state, action: PayloadAction<BaseFailurePayload>) => {
      state.loading = false;
      state.message = {
        type: TypeMessage.error,
        message: action.payload.message,
      };
      state.errors = action.payload.errors;
    },

    updateSetting: (state, action: PayloadAction<SettingData>) => {
      state.loading = true;
    },
    updateSettingSuccess: (state, action: PayloadAction<ApiResponse>) => {
      state.loading = false;
      state.message = {
        type: TypeMessage.success,
        message: AUTH_MESSAGES.UPDATE,
      };
      state.isCheckUpdateInfo = true;
    },
    updateSettingFailure: (state, action: PayloadAction<BaseFailurePayload>) => {
      state.loading = false;
      state.message = {
        type: TypeMessage.error,
        message: action.payload.message,
      };
      state.errors = action.payload.errors;
    },

    changePassword: (state, action: PayloadAction<ChangePasswordRequest>) => {
      state.loading = true;
    },
    changePasswordSuccess: (state, action: PayloadAction<ApiResponse>) => {
      state.loading = false;
      state.message = {
        type: TypeMessage.success,
        message: AUTH_MESSAGES.CHANGE_PASSWORD,
      };
      state.isCheckChangePassword = true;
    },
    changePasswordFailure: (state, action: PayloadAction<BaseFailurePayload>) => {
      state.loading = false;
      state.message = {
        type: TypeMessage.error,
        message: action.payload.message,
      };
      state.errors = action.payload.errors;
    },

    //logout
    logout: (state) => {
      state.loading = true;
    },
    logoutSuccess: (state: AuthState, action: PayloadAction<ApiResponse>) => {
      state.loading = false;
      state.message = {
        type: TypeMessage.success,
        message: AUTH_MESSAGES.LOGOUT,
      };
      state.loginData = null;
      state.userInfo = null;
    },
    logoutFailure: (state: AuthState, action: PayloadAction<BaseFailurePayload>) => {
      state.loading = false;
      state.errors = action.payload.errors;
      state.message = {
        type: TypeMessage.error,
        message: action.payload.message,
      };
    },

    forgotPassword: (state, _action: PayloadAction<string>) => {
      state.loading = true;
    },
    forgotPasswordSuccess: (state, action: PayloadAction<ApiResponse>) => {
      state.loading = false;
      state.isCheckForgotPassword = true;
    },
    forgotPasswordFailure: (state, action: PayloadAction<BaseFailurePayload>) => {
      state.loading = false;
      state.errors = action.payload.errors;
      state.message = {
        type: TypeMessage.error,
        message: action.payload.message,
      };
    },

    verifyOTP: (state, _action: PayloadAction<VerifyOtpRequest>) => {
      state.loading = true;
    },
    verifyOTPSuccess: (state, action: PayloadAction<ApiResponse>) => {
      state.loading = false;
      state.isCheckVerifyOtp = true;
      state.message = {
        type: TypeMessage.success,
        message: AUTH_MESSAGES.VERIFY_OTP,
      };
    },
    verifyOTPFailure: (state, action: PayloadAction<BaseFailurePayload>) => {
      state.loading = false;
      state.errors = action.payload.errors;
      state.message = {
        type: TypeMessage.error,
        message: action.payload.message,
      };
    },

    resendOTP: (state) => {
      state.loading = true;
    },
    resendOTPSuccess: (state, action: PayloadAction<ApiResponse>) => {
      state.loading = false;
      state.isCheckResendOtp = true;
      state.message = {
        type: TypeMessage.success,
        message: AUTH_MESSAGES.RESEND_OTP,
      };
    },
    resendOTPFailure: (state, action: PayloadAction<BaseFailurePayload>) => {
      state.loading = false;
      state.errors = action.payload.errors;
      state.message = {
        type: TypeMessage.error,
        message: action.payload.message,
      };
    },

    resetPassword: (state, _action: PayloadAction<ConfirmPasswordRequest>) => {
      state.loading = true;
    },
    resetPasswordSuccess: (state, action: PayloadAction<ApiResponse>) => {
      state.loading = false;
      state.isCheckResetPassword = true;
      state.message = {
        type: TypeMessage.success,
        message: AUTH_MESSAGES.RESET_PASSWORD,
      };
    },
    resetPasswordFailure: (state, action: PayloadAction<BaseFailurePayload>) => {
      state.loading = false;
      state.errors = action.payload.errors;
      state.message = {
        type: TypeMessage.error,
        message: action.payload.message,
      };
    },

    // TODO: reset states
    resetUpdateInfo: (state) => {
      state.isCheckUpdateInfo = false;
    },
    resetChangePassword: (state) => {
      state.isCheckChangePassword = false;
    },
    resetForgotPassword: (state) => {
      state.isCheckForgotPassword = false;
    },
    resetVerifyOtp: (state) => {
      state.isCheckVerifyOtp = false;
    },
    resetCheckResetPassword: (state) => {
      state.isCheckResetPassword = false;
    },
    resetResendOtp: (state) => {
      state.isCheckResendOtp = false;
    },
  },
});

export const {
  login,
  loginSuccess,
  loginFailure,
  logout,
  logoutSuccess,
  logoutFailure,
  getInfo,
  getInfoSuccess,
  getInfoFailure,
  updateInfo,
  updateInfoFailure,
  updateInfoSuccess,
  getSetting,
  getSettingSuccess,
  getSettingFailure,
  updateSetting,
  updateSettingSuccess,
  updateSettingFailure,
  changePassword,
  changePasswordFailure,
  changePasswordSuccess,
  forgotPassword,
  forgotPasswordSuccess,
  forgotPasswordFailure,
  verifyOTP,
  verifyOTPSuccess,
  verifyOTPFailure,
  resendOTP,
  resendOTPFailure,
  resendOTPSuccess,
  resetPassword,
  resetPasswordSuccess,
  resetPasswordFailure,

  resetUpdateInfo,
  resetLogin,
  resetChangePassword,
  resetForgotPassword,
  resetVerifyOtp,
  resetCheckResetPassword,
  resetResendOtp,

  getShift,
  getShiftSuccess,
  getShiftFailure,

  resetErrors,
  clearMessage,
} = authSlice.actions;

export default authSlice.reducer;
