import * as loyaltyPointActions from "./slice";
import { apiEndpoint } from "../../constants/ApiEndpoint";
import { SagaIterator } from "redux-saga";
import { call, put, takeLatest } from "redux-saga/effects";
import { getData } from "../../api/apiClient";
import { handleErrorMessage } from "../../utils/handleMessageError";
import { PayloadAction } from "@reduxjs/toolkit";
import { LoyaltyPointQuery } from "../../models/loyaltyPoint";
import { formatPayload } from "../../utils/common";

const {
  getLoyaltyPointReportFailure,
  getLoyaltyPointReportSuccess,
  getLoyaltyPointTransactionFailure,
  getLoyaltyPointTransactionSuccess,
} = loyaltyPointActions;

function* getLoyaltyPointReportSaga(action: PayloadAction<LoyaltyPointQuery>): SagaIterator {
  try {
    const response = yield call(() =>
      getData(`${apiEndpoint.loyaltyPoint.report}`, formatPayload(action.payload)),
    );
    yield put(getLoyaltyPointReportSuccess(response));
  } catch (error: any) {
    const errorMessage = handleErrorMessage(error);
    yield put(getLoyaltyPointReportFailure(errorMessage));
  }
}

function* getLoyaltyPointTransactionSaga(action: PayloadAction<LoyaltyPointQuery>): SagaIterator {
  try {
    const response = yield call(() =>
      getData(`${apiEndpoint.loyaltyPoint.transaction}`, action.payload),
    );
    yield put(getLoyaltyPointTransactionSuccess(response));
  } catch (error: any) {
    const errorMessage = handleErrorMessage(error);
    yield put(getLoyaltyPointTransactionFailure(errorMessage));
  }
}

export function* LoyaltyPointSaga(): SagaIterator {
  yield takeLatest("loyaltyPoint/getLoyaltyPointReport", getLoyaltyPointReportSaga);
  yield takeLatest("loyaltyPoint/getLoyaltyPointTransaction", getLoyaltyPointTransactionSaga);
}
