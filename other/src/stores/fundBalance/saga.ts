import * as fundBalanceActions from "./slice";
import { apiEndpoint } from "../../constants/ApiEndpoint";
import { SagaIterator } from "redux-saga";
import { call, put, takeLatest } from "redux-saga/effects";
import { getData } from "../../api/apiClient";
import { handleErrorMessage } from "../../utils/handleMessageError";
import { PayloadAction } from "@reduxjs/toolkit";
import { FundBalanceQuery } from "../../models/fundBalance";
import { formatPayload } from "../../utils/common";

const {
  getFundBalanceReportFailure,
  getFundBalanceReportSuccess,
  getFundBalanceTransactionFailure,
  getFundBalanceTransactionSuccess,
} = fundBalanceActions;

function* getFundBalanceReportSaga(action: PayloadAction<FundBalanceQuery>): SagaIterator {
  try {
    const response = yield call(() =>
      getData(`${apiEndpoint.fundBalance.report}`, formatPayload(action.payload)),
    );
    yield put(getFundBalanceReportSuccess(response));
  } catch (error: any) {
    const errorMessage = handleErrorMessage(error);
    yield put(getFundBalanceReportFailure(errorMessage));
  }
}

function* getFundBalanceTransactionSaga(action: PayloadAction<FundBalanceQuery>): SagaIterator {
  try {
    const response = yield call(() =>
      getData(`${apiEndpoint.fundBalance.transaction}`, action.payload),
    );
    yield put(getFundBalanceTransactionSuccess(response));
  } catch (error: any) {
    const errorMessage = handleErrorMessage(error);
    yield put(getFundBalanceTransactionFailure(errorMessage));
  }
}

export function* FundBalanceSaga(): SagaIterator {
  yield takeLatest("fundBalance/getFundBalanceReport", getFundBalanceReportSaga);
  yield takeLatest("fundBalance/getFundBalanceTransaction", getFundBalanceTransactionSaga);
}
