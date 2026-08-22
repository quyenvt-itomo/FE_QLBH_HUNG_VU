import * as vatActions from "./slice";
import { apiEndpoint } from "../../constants/ApiEndpoint";
import { SagaIterator } from "redux-saga";
import { call, put, takeLatest } from "redux-saga/effects";
import { getData } from "../../api/apiClient";
import { handleErrorMessage } from "../../utils/handleMessageError";
import { PayloadAction } from "@reduxjs/toolkit";
import { VatQuery } from "../../models/store/vat";

const { getVatTransactionFailure, getVatTransactionSuccess } = vatActions;

function normalizeIdsField(
  field: any[] | any | undefined,
  mapKey: string = "id",
): string[] | undefined {
  if (!field) return undefined;

  // Nếu là array object → trả về array id
  if (Array.isArray(field)) {
    return field.map((item) => {
      if (typeof item === "object") {
        return item[mapKey];
      }
      return item;
    });
  }

  // Nếu là 1 object → trả về array 1 id
  if (typeof field === "object") {
    return [field[mapKey]];
  }

  // Nếu là string / number đơn → cho vào array
  return [field];
}

function* getVatTransactionSaga(action: PayloadAction<VatQuery>): SagaIterator {
  try {
    const response = yield call(() => getData(`${apiEndpoint.vat.transaction}`, action.payload));
    yield put(getVatTransactionSuccess(response));
  } catch (error: any) {
    const errorMessage = handleErrorMessage(error);
    yield put(getVatTransactionFailure(errorMessage));
  }
}

export function* VatSaga(): SagaIterator {
  yield takeLatest("vat/getVatTransaction", getVatTransactionSaga);
}
