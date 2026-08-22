import { PayloadAction } from "@reduxjs/toolkit";
import { call, put, takeLatest } from "redux-saga/effects";
import { SagaIterator } from "redux-saga";
import {
  getShiftSuccess,
  getShiftFailure,
  loginSuccess,
  loginFailure,
  logoutSuccess,
  logoutFailure,
  getInfoSuccess,
  getInfoFailure,
  updateInfoSuccess,
  updateInfoFailure,
  getSettingSuccess,
  getSettingFailure,
  updateSettingSuccess,
  updateSettingFailure,
  changePasswordSuccess,
  changePasswordFailure,
  forgotPasswordSuccess,
  forgotPasswordFailure,
  verifyOTPSuccess,
  verifyOTPFailure,
  resetPasswordSuccess,
  resetPasswordFailure,
  resendOTPSuccess,
  resendOTPFailure,
} from "./slice";
import { getData, postData, putData } from "../../api/apiClient";
import { apiEndpoint } from "../../constants/ApiEndpoint";
import {
  ChangePasswordRequest,
  ForgotPasswordRequest,
  LoginRequest,
  LogoutRequest,
  ConfirmPasswordRequest,
  UserInfo,
  VerifyOtpRequest,
  SettingData,
} from "../../models/base/auth";
import { handleErrorMessage } from "../../utils/handleMessageError";
import { ShiftQuery } from "../../models/store/shift";

function* getShiftSaga(action: PayloadAction<ShiftQuery>): SagaIterator {
  try {
    const response = yield call(() => getData(apiEndpoint.auth.shift.base, action.payload));
    yield put(getShiftSuccess(response));
  } catch (error: any) {
    const errorMessage = handleErrorMessage(error);
    yield put(getShiftFailure(errorMessage));
  }
}

function* loginSaga(action: PayloadAction<LoginRequest>): SagaIterator {
  try {
    const response = yield call(() => postData(apiEndpoint.auth.login, action.payload));

    yield put(loginSuccess(response));
  } catch (error: any) {
    yield put(loginFailure(handleErrorMessage(error, "add", "auth")));
  }
}

function* logoutSaga(action: PayloadAction<LogoutRequest>): SagaIterator {
  try {
    const response = yield call(() => postData(apiEndpoint.auth.logout, action.payload));
    yield put(logoutSuccess(response));
  } catch (error: any) {
    yield put(logoutFailure(handleErrorMessage(error, "add", "auth")));
  }
}

function* getInfoSaga(): SagaIterator {
  try {
    const response = yield call(() => getData(`${apiEndpoint.auth.info}`));
    yield put(getInfoSuccess(response));
  } catch (error: any) {
    const errorMessage = handleErrorMessage(error);
    yield put(getInfoFailure(errorMessage));
  }
}

function* changePasswordSaga(action: PayloadAction<ChangePasswordRequest>): SagaIterator {
  try {
    const response = yield call(() =>
      putData(`${apiEndpoint.auth.changePassword}`, action.payload),
    );
    yield put(changePasswordSuccess(response));
  } catch (error: any) {
    const errorMessage = handleErrorMessage(error, "update", "auth");
    yield put(changePasswordFailure(errorMessage));
  }
}

function* updateInfoSaga(action: PayloadAction<UserInfo>): SagaIterator {
  try {
    const response = yield call(() => putData(`${apiEndpoint.auth.updateInfo}`, action.payload));
    yield put(updateInfoSuccess(response.data));
  } catch (error: any) {
    const errorMessage = handleErrorMessage(error);

    yield put(updateInfoFailure(errorMessage));
  }
}

function* getSettingSaga(): SagaIterator {
  try {
    const response = yield call(() => getData(`${apiEndpoint.auth.setting}`));
    yield put(getSettingSuccess(response));
  } catch (error: any) {
    const errorMessage = handleErrorMessage(error);
    yield put(getSettingFailure(errorMessage));
  }
}

function* updateSettingSaga(action: PayloadAction<SettingData>): SagaIterator {
  try {
    const response = yield call(() => putData(`${apiEndpoint.auth.setting}`, action.payload));
    yield put(updateSettingSuccess(response.data));
  } catch (error: any) {
    const errorMessage = handleErrorMessage(error);

    yield put(updateSettingFailure(errorMessage));
  }
}

function* forgotPasswordSaga(action: PayloadAction<ForgotPasswordRequest>): SagaIterator {
  try {
    const response = yield call(() =>
      postData(`${apiEndpoint.auth.forgotPassword}`, action.payload),
    );
    yield put(forgotPasswordSuccess(response.data));
  } catch (error: any) {
    const errorMessage = handleErrorMessage(error, "add", "auth");
    yield put(forgotPasswordFailure(errorMessage));
  }
}

function* verifyOTPSaga(action: PayloadAction<VerifyOtpRequest>): SagaIterator {
  try {
    const response = yield call(() => postData(`${apiEndpoint.auth.verifyOtp}`, action.payload));
    yield put(verifyOTPSuccess(response.data));
  } catch (error: any) {
    const errorMessage = handleErrorMessage(error, "add", "auth");
    yield put(verifyOTPFailure(errorMessage));
  }
}

function* resendOTPSaga(): SagaIterator {
  try {
    const response = yield call(() => postData(`${apiEndpoint.auth.resendOtp}`, {}));
    yield put(resendOTPSuccess(response.data));
  } catch (error: any) {
    const errorMessage = handleErrorMessage(error, "add", "auth");
    yield put(resendOTPFailure(errorMessage));
  }
}

function* resetPasswordSaga(action: PayloadAction<ConfirmPasswordRequest>): SagaIterator {
  try {
    const response = yield call(() =>
      postData(`${apiEndpoint.auth.resetPassword}`, action.payload),
    );
    yield put(resetPasswordSuccess(response.data));
  } catch (error: any) {
    const errorMessage = handleErrorMessage(error, "add", "auth");
    yield put(resetPasswordFailure(errorMessage));
  }
}

export function* AuthSaga() {
  yield takeLatest("auth/getShift", getShiftSaga);
  yield takeLatest("auth/login", loginSaga);
  yield takeLatest("auth/logout", logoutSaga);
  yield takeLatest("auth/getInfo", getInfoSaga);
  yield takeLatest("auth/changePassword", changePasswordSaga);
  yield takeLatest("auth/updateInfo", updateInfoSaga);
  yield takeLatest("auth/getSetting", getSettingSaga);
  yield takeLatest("auth/updateSetting", updateSettingSaga);
  yield takeLatest("auth/forgotPassword", forgotPasswordSaga);
  yield takeLatest("auth/verifyOTP", verifyOTPSaga);
  yield takeLatest("auth/resendOTP", resendOTPSaga);
  yield takeLatest("auth/resetPassword", resetPasswordSaga);
}
