import { call, put, takeEvery } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import { SagaIterator } from "redux-saga";
import { deleteData, getData, postData, putData } from "../api/apiClient";
import { handleErrorMessage, ObjectKeys } from "../utils/handleMessageError";
import { PayloadWithSubId } from "../models/base/api";
import { formatPayload } from "../utils/common";

export interface BaseMapper<TApi, TModel> {
  fromApi: (data: TApi) => TModel;
  fromApiList?: (data: TApi[]) => TModel[];
  toApi?: (data: Partial<TModel>) => any;
}

function mapApiResponse<T>(response: any, mapper?: BaseMapper<any, T>) {
  if (!mapper?.fromApi) return response;

  const data = response.data;

  return {
    ...response,
    data: Array.isArray(data)
      ? mapper.fromApiList
        ? mapper.fromApiList(data)
        : data.map(mapper.fromApi)
      : mapper.fromApi(data),
  };
}

interface CreateBaseSagaParams<TData, TQuery> {
  name: ObjectKeys;
  api: string;
  mapper?: BaseMapper<any, TData>;
  actions: {
    getAllSuccess: any;
    getAllFailure: any;

    getItemSuccess: any;
    getItemFailure: any;

    addItemSuccess: any;
    addItemFailure: any;

    updateItemSuccess: any;
    updateItemFailure: any;

    deleteItemSuccess: any;
    deleteItemFailure: any;
  };

  extraSagas?: (() => Generator<any, any, any>)[]; // Mặc định là một mảng rỗng
}

export function createBaseSaga<TData = any, TQuery = any>({
  name,
  api,
  actions,
  mapper,
  extraSagas = [], // Mặc định là một mảng rỗng
}: CreateBaseSagaParams<TData, TQuery>) {
  function* getAllSaga(action: PayloadAction<TQuery>): SagaIterator {
    try {
      const response = yield call(getData, api, formatPayload(action.payload));
      const mapped = mapApiResponse<TData>(response, mapper);
      yield put(actions.getAllSuccess(mapped));
    } catch (error: any) {
      console.log({ error });
      yield put(actions.getAllFailure(handleErrorMessage(error, "get", name)));
    }
  }

  function* getItemSaga(action: PayloadAction<string | PayloadWithSubId>): SagaIterator {
    try {
      let id = action.payload;
      let url = `${api}`;
      if (typeof action.payload === "object") {
        url = url.replace(":id", `${action.payload.productId}`);
        id = action.payload.id;
      }
      const response = yield call(getData, `${url}/${id}`);
      const mapped = mapApiResponse<TData>(response, mapper);

      yield put(actions.getItemSuccess(mapped));
    } catch (error: any) {
      console.log({ error });
      yield put(actions.getItemFailure(handleErrorMessage(error, "get", name)));
    }
  }

  function* addItemSaga(action: PayloadAction<TData>): SagaIterator {
    try {
      const payload = mapper?.toApi ? mapper.toApi(action.payload) : action.payload;

      const response = yield call(postData, api, payload);
      const mapped = mapApiResponse<TData>(response, mapper);

      yield put(actions.addItemSuccess(mapped));
    } catch (error: any) {
      console.log({ error });
      yield put(actions.addItemFailure(handleErrorMessage(error, "add", name)));
    }
  }

  function* updateItemSaga(action: PayloadAction<TData>): SagaIterator {
    try {
      const id = (action.payload as any).id;
      const url = id ? `${api}/${id}` : api;

      const payload = mapper?.toApi ? mapper.toApi(action.payload) : action.payload;

      const response = yield call(putData, url, payload);
      const mapped = mapApiResponse<TData>(response, mapper);

      yield put(actions.updateItemSuccess(mapped));
    } catch (error: any) {
      console.log({ error });
      yield put(actions.updateItemFailure(handleErrorMessage(error, "update", name)));
    }
  }

  function* deleteItemSaga(action: PayloadAction<string | PayloadWithSubId>): SagaIterator {
    try {
      let id: string;
      let url = api;

      if (typeof action.payload === "object") {
        id = action.payload.id;
      } else {
        id = action.payload;
      }

      const response = yield call(deleteData, `${url}/${id}`, action.payload);

      yield put(actions.deleteItemSuccess(response));
    } catch (error: any) {
      console.log({ error });
      yield put(actions.deleteItemFailure(handleErrorMessage(error, "delete", name)));
    }
  }

  function* saga(): SagaIterator {
    yield takeEvery(`${name}/getAll`, getAllSaga);
    yield takeEvery(`${name}/getItem`, getItemSaga);
    yield takeEvery(`${name}/addItem`, addItemSaga);
    yield takeEvery(`${name}/updateItem`, updateItemSaga);
    yield takeEvery(`${name}/deleteItem`, deleteItemSaga);

    // Gọi thêm các saga mở rộng nếu có
    if (extraSagas?.length) {
      for (const extra of extraSagas) {
        yield* extra();
      }
    }
  }

  return saga;
}
