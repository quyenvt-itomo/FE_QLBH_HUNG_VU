import * as debtActions from "./slice";
import { apiEndpoint } from "../../constants/ApiEndpoint";
import { SagaIterator } from "redux-saga";
import { call, put, takeLatest } from "redux-saga/effects";
import { getData } from "../../api/apiClient";
import { handleErrorMessage } from "../../utils/handleMessageError";
import { PayloadAction } from "@reduxjs/toolkit";
import { DebtQuery } from "../../models/store/debt";
import { formatPayload } from "../../utils/common";

const {
  getDebtReportFailure,
  getDebtReportSuccess,
  getDebtTransactionFailure,
  getDebtTransactionSuccess,
} = debtActions;

function* getDebtReportSaga(action: PayloadAction<DebtQuery>): SagaIterator {
  try {
    const response = yield call(() =>
      getData(`${apiEndpoint.debt.report}`, formatPayload(action.payload)),
    );
    yield put(getDebtReportSuccess(response));
  } catch (error: any) {
    const errorMessage = handleErrorMessage(error);
    yield put(getDebtReportFailure(errorMessage));
  }
}

function* getDebtTransactionSaga(action: PayloadAction<DebtQuery>): SagaIterator {
  try {
    const response = yield call(() => getData(`${apiEndpoint.debt.transaction}`, action.payload));
    yield put(getDebtTransactionSuccess(response));
  } catch (error: any) {
    const errorMessage = handleErrorMessage(error);
    yield put(getDebtTransactionFailure(errorMessage));
  }
}

export function* DebtSaga(): SagaIterator {
  yield takeLatest("debt/getDebtReport", getDebtReportSaga);
  yield takeLatest("debt/getDebtTransaction", getDebtTransactionSaga);
}
