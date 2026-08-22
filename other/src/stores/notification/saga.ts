import { PayloadAction } from "@reduxjs/toolkit";
import { call, put, takeLatest } from "redux-saga/effects";
import { SagaIterator } from "redux-saga";
import {
  getNotificationSuccess,
  getNotificationFailure,
  seenNotificationSuccess,
  seenNotificationFailure,
  seenAllNotificationSuccess,
  seenAllNotificationFailure,
} from "./slice";

import { getData, putData } from "../../api/apiClient";

import { handleErrorMessage } from "../../utils/handleMessageError";
import { apiEndpoint } from "../../constants/ApiEndpoint";
import { NotificationQuery } from "../../models/base/notification";

function* getNotificationSaga(
  action: PayloadAction<NotificationQuery>,
): SagaIterator {
  try {
    const response = yield call(() =>
      getData(apiEndpoint.auth.notification.base, action.payload),
    );
    yield put(getNotificationSuccess(response));
  } catch (error: any) {
    const errorMessage = handleErrorMessage(error);
    yield put(getNotificationFailure(errorMessage));
  }
}

function* seenNotificationSaga(
  action: PayloadAction<NotificationQuery>,
): SagaIterator {
  try {
    const response = yield call(() =>
      putData(apiEndpoint.auth.notification.base, action.payload),
    );
    yield put(seenNotificationSuccess(response));
  } catch (error: any) {
    const errorMessage = handleErrorMessage(error);
    yield put(seenNotificationFailure(errorMessage));
  }
}

function* seenAllNotificationSaga(
  action: PayloadAction<NotificationQuery>,
): SagaIterator {
  try {
    const response = yield call(() =>
      putData(apiEndpoint.auth.notification.all, action.payload),
    );
    yield put(seenAllNotificationSuccess(response));
  } catch (error: any) {
    const errorMessage = handleErrorMessage(error);
    yield put(seenAllNotificationFailure(errorMessage));
  }
}

export function* NotificationSaga() {
  // yield takeLatest("notification/getNotification", getNotificationSaga);
  // yield takeLatest("notification/seenNotification", seenNotificationSaga);
  // yield takeLatest("notification/seenAllNotification", seenAllNotificationSaga);
}
