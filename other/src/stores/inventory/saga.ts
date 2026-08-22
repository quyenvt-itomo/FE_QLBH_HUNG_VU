import * as inventoryActions from "./slice";
import { apiEndpoint } from "../../constants/ApiEndpoint";
import { SagaIterator } from "redux-saga";
import { call, put, takeLatest } from "redux-saga/effects";
import { getData } from "../../api/apiClient";
import { handleErrorMessage } from "../../utils/handleMessageError";
import { PayloadAction } from "@reduxjs/toolkit";
import { InventoryQuery } from "../../models/store/inventory";
import { formatPayload } from "../../utils/common";

const {
  getInventoryReportFailure,
  getInventoryReportSuccess,
  getInventoryTransactionFailure,
  getInventoryTransactionSuccess,
} = inventoryActions;

function* getInventoryReportSaga(action: PayloadAction<InventoryQuery>): SagaIterator {
  try {
    const response = yield call(() =>
      getData(`${apiEndpoint.inventory.report}`, formatPayload(action.payload)),
    );
    yield put(getInventoryReportSuccess(response));
  } catch (error: any) {
    const errorMessage = handleErrorMessage(error);
    yield put(getInventoryReportFailure(errorMessage));
  }
}

function* getInventoryTransactionSaga(action: PayloadAction<InventoryQuery>): SagaIterator {
  try {
    const response = yield call(() =>
      getData(`${apiEndpoint.inventory.transaction}`, action.payload),
    );
    yield put(getInventoryTransactionSuccess(response));
  } catch (error: any) {
    const errorMessage = handleErrorMessage(error);
    yield put(getInventoryTransactionFailure(errorMessage));
  }
}

export function* InventorySaga(): SagaIterator {
  yield takeLatest("inventory/getInventoryReport", getInventoryReportSaga);
  yield takeLatest("inventory/getInventoryTransaction", getInventoryTransactionSaga);
}
