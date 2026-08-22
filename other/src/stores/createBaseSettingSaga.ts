import { PayloadAction } from "@reduxjs/toolkit";
import { handleErrorMessage, ObjectKeys } from "../utils/handleMessageError";
import { SagaIterator } from "redux-saga";
import { call, put, takeLatest } from "redux-saga/effects";
import { getData, putData } from "../api/apiClient";

interface CreateBaseSettingSagaParams<TUpdate> {
  name: ObjectKeys;
  api: string;
  actions: {
    getItemSuccess: any;
    getItemFailure: any;

    updateItemSuccess: any;
    updateItemFailure: any;
  };
}

export function createBaseSettingSaga<TUpdate = any>({
  name,
  api,
  actions,
}: CreateBaseSettingSagaParams<TUpdate>) {
  function* getItemSaga(action: PayloadAction<void>): SagaIterator {
    try {
      const response = yield call(() => getData(api));
      yield put(actions.getItemSuccess(response));
    } catch (error: any) {
      yield put(actions.getItemFailure(handleErrorMessage(error, "get", name)));
    }
  }

  function* updateItemSaga(action: PayloadAction<TUpdate>): SagaIterator {
    try {
      const response = yield call(() => putData(api, action.payload));
      yield put(actions.updateItemSuccess(response.data));
    } catch (error: any) {
      yield put(
        actions.updateItemFailure(handleErrorMessage(error, "update", name)),
      );
    }
  }

  function* saga(): SagaIterator {
    yield takeLatest(`${name}/getItem`, getItemSaga);
    yield takeLatest(`${name}/updateItem`, updateItemSaga);
  }

  return saga;
}
