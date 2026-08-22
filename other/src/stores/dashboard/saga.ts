import * as dashboardActions from "./slice";
import { apiEndpoint } from "../../constants/ApiEndpoint";
import { SagaIterator } from "redux-saga";
import { call, put, takeLatest } from "redux-saga/effects";
import { getData } from "../../api/apiClient";
import { handleErrorMessage } from "../../utils/handleMessageError";
import { PayloadAction } from "@reduxjs/toolkit";
import { DashboardQuery } from "../../models/dashboard";
import { formatPayload } from "../../utils/common";

const {
  getOverviewFailure,
  getOverviewSuccess,

  getProfitFailure,
  getProfitSuccess,

  getSalesFailure,
  getSalesSuccess,

  getProductFailure,
  getProductSuccess,

  getDetailProductFailure,
  getDetailProductSuccess,
} = dashboardActions;

function* getOverviewSaga(action: PayloadAction<DashboardQuery>): SagaIterator {
  try {
    const response = yield call(() =>
      getData(`${apiEndpoint.dashboard.overview}`, formatPayload(action.payload)),
    );
    yield put(getOverviewSuccess(response));
  } catch (error: any) {
    const errorMessage = handleErrorMessage(error);
    yield put(getOverviewFailure(errorMessage));
  }
}

function* getProfitSaga(action: PayloadAction<DashboardQuery>): SagaIterator {
  try {
    const response = yield call(() =>
      getData(`${apiEndpoint.dashboard.profit}`, formatPayload(action.payload)),
    );
    yield put(getProfitSuccess(response));
  } catch (error: any) {
    const errorMessage = handleErrorMessage(error);
    yield put(getProfitFailure(errorMessage));
  }
}

function* getSalesSaga(action: PayloadAction<DashboardQuery>): SagaIterator {
  try {
    const response = yield call(() =>
      getData(`${apiEndpoint.dashboard.sales}`, formatPayload(action.payload)),
    );
    yield put(getSalesSuccess(response));
  } catch (error: any) {
    const errorMessage = handleErrorMessage(error);
    yield put(getSalesFailure(errorMessage));
  }
}

function* getProductSaga(action: PayloadAction<DashboardQuery>): SagaIterator {
  try {
    const response = yield call(() =>
      getData(`${apiEndpoint.dashboard.product}`, formatPayload(action.payload)),
    );
    yield put(getProductSuccess(response));
  } catch (error: any) {
    const errorMessage = handleErrorMessage(error);
    yield put(getProductFailure(errorMessage));
  }
}

function* getDetailProductSaga(action: PayloadAction<DashboardQuery>): SagaIterator {
  try {
    const response = yield call(() =>
      getData(`${apiEndpoint.dashboard.detailProduct}`, formatPayload(action.payload)),
    );
    yield put(getDetailProductSuccess(response));
  } catch (error: any) {
    const errorMessage = handleErrorMessage(error);
    yield put(getDetailProductFailure(errorMessage));
  }
}

export function* DashboardSaga(): SagaIterator {
  yield takeLatest("dashboard/getOverview", getOverviewSaga);
  yield takeLatest("dashboard/getProfit", getProfitSaga);
  yield takeLatest("dashboard/getSales", getSalesSaga);
  yield takeLatest("dashboard/getProduct", getProductSaga);

  yield takeLatest("dashboard/getDetailProduct", getDetailProductSaga);
}
