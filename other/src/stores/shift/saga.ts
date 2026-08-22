import * as shiftActions from "./slice";
import { apiEndpoint } from "../../constants/ApiEndpoint";
import { createBaseSaga } from "../createBaseSaga";
import {
  CloseShiftPayload,
  IShift,
  OpenShiftPayload,
  ShiftQuery,
  ShiftResponse,
} from "../../models/store/shift";
import { call, put, takeLatest } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import { getData, postData } from "../../api/apiClient";
import { handleErrorMessage } from "../../utils/handleMessageError";

const {
  getAllSuccess,
  getAllFailure,
  getItemSuccess,
  getItemFailure,
  getItemSummarySuccess,
  getItemSummaryFailure,
  addItemSuccess,
  addItemFailure,
  openItemSuccess,
  openItemFailure,
  closeItemSuccess,
  closeItemFailure,
  updateItemSuccess,
  updateItemFailure,
  deleteItemSuccess,
  deleteItemFailure,
} = shiftActions;

function* getItemSummarySaga(): Generator {
  yield takeLatest("shift/getItemSummary", function* (action: PayloadAction<string>) {
    try {
      const url = apiEndpoint.shift.summary.replace(":id", action.payload);
      const response: ShiftResponse = yield call(() => getData(url));
      yield put(getItemSummarySuccess(response));
    } catch (error: any) {
      yield put(getItemSummaryFailure(handleErrorMessage(error, "action", "shift")));
    }
  });
}

function* openItemSaga(): Generator {
  yield takeLatest("shift/openItem", function* (action: PayloadAction<OpenShiftPayload>) {
    try {
      const response: ShiftResponse = yield call(() =>
        postData(apiEndpoint.shift.open, action.payload),
      );
      yield put(openItemSuccess(response));
    } catch (error: any) {
      yield put(openItemFailure(handleErrorMessage(error, "action", "shift")));
    }
  });
}

function* closeItemSaga(): Generator {
  yield takeLatest("shift/closeItem", function* (action: PayloadAction<CloseShiftPayload>) {
    try {
      const url = apiEndpoint.shift.close.replace(":id", action.payload.id);
      const response: ShiftResponse = yield call(() => postData(url, action.payload));
      yield put(closeItemSuccess(response));
    } catch (error: any) {
      yield put(closeItemFailure(handleErrorMessage(error, "action", "shift")));
    }
  });
}

export const ShiftSaga = createBaseSaga<IShift, ShiftQuery>({
  name: "shift",
  api: apiEndpoint.shift.base,
  actions: {
    getAllSuccess,
    getAllFailure,
    getItemSuccess,
    getItemFailure,
    addItemSuccess,
    addItemFailure,
    updateItemSuccess,
    updateItemFailure,
    deleteItemSuccess,
    deleteItemFailure,
  },
  extraSagas: [getItemSummarySaga, openItemSaga, closeItemSaga],
});
