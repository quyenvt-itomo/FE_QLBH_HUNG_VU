import { PayloadAction } from "@reduxjs/toolkit";
import { call, put, takeLatest } from "redux-saga/effects";
import { SagaIterator } from "redux-saga";
import { getData, postData } from "../../api/apiClient";

import {
  ExcelTemplateQuery,
  ExportExcelQuery,
  ExportOptions,
  ImportExcelData,
} from "../../models/base/excel";
import { handleErrorMessage, ObjectKeys } from "../../utils/handleMessageError";
import { apiEndpoint } from "../../constants/ApiEndpoint";
import {
  exportExcelFailure,
  exportExcelSuccess,
  getTemplateFailure,
  getTemplateSuccess,
  importExcelFailure,
  importExcelJobStarted,
} from "./slice";

const objectKey: ObjectKeys = "excel";

function* getTemplateSaga(action: PayloadAction<ExcelTemplateQuery>): SagaIterator {
  try {
    const { entityType, storeId, filters } = action.payload;
    let url = apiEndpoint.excel.template;

    // Thêm query params nếu có
    const queryParams: Record<string, any> = {};
    if (storeId) queryParams.storeId = storeId;
    if (filters) queryParams.filters = JSON.stringify(filters);

    const response = yield call(() => getData(url.replace(":entityType", entityType), queryParams));
    yield put(getTemplateSuccess(response));
  } catch (error: any) {
    const errorMessage = handleErrorMessage(error, "get", objectKey);
    yield put(getTemplateFailure(errorMessage));
  }
}

function* importExcelSaga(action: PayloadAction<ImportExcelData>): SagaIterator {
  try {
    const response = yield call(() => postData(apiEndpoint.excel.import, action.payload));
    // Response chứa jobId, không phải kết quả trực tiếp
    yield put(importExcelJobStarted(response));
  } catch (error: any) {
    const errorMessage = handleErrorMessage(error, "update", objectKey);
    yield put(importExcelFailure(errorMessage));
  }
}

function* exportExcelSaga(action: PayloadAction<ExportOptions>): SagaIterator {
  try {
    const response = yield call(() => postData(apiEndpoint.excel.export, action.payload));
    yield put(exportExcelSuccess(response));
  } catch (error: any) {
    const errorMessage = handleErrorMessage(error, "get", objectKey);

    yield put(exportExcelFailure(errorMessage));
  }
}

export function* ExcelSaga() {
  yield takeLatest("excel/getTemplate", getTemplateSaga);

  yield takeLatest("excel/importExcel", importExcelSaga);

  yield takeLatest("excel/exportExcel", exportExcelSaga);
}
