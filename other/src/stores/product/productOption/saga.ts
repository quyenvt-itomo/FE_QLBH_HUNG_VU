import * as productActions from "./slice";
import { apiEndpoint } from "../../../constants/ApiEndpoint";
import { createBaseSaga } from "../../createBaseSaga";
import {
  ChangeOptionIndexPayload,
  CreateManyOptionDto,
  IProductOption,
  ProductPartialQuery,
  ProductResponse,
} from "../../../models/product";
import { call, put, takeLatest } from "redux-saga/effects";
import { deleteData, postData, putData } from "../../../api/apiClient";
import { PayloadAction } from "@reduxjs/toolkit";
import { PayloadWithSubId } from "../../../models/base/api";
import { handleErrorMessage } from "../../../utils/handleMessageError";

const {
  getAllSuccess,
  getAllFailure,
  getItemSuccess,
  getItemFailure,
  addItemSuccess,
  addItemFailure,
  addManyItemSuccess,
  addManyItemFailure,
  changeIndexSuccess,
  changeIndexFailure,
  updateItemSuccess,
  updateItemFailure,
  deleteItemSuccess,
  deleteItemFailure,
  deleteItemsSuccess,
  deleteItemsFailure,
} = productActions;

function* addManyItemSaga(): Generator {
  yield takeLatest(
    "productOption/addManyItem",
    function* (action: PayloadAction<CreateManyOptionDto>) {
      try {
        const { productId } = action.payload;
        const url = apiEndpoint.product.manyOption.replace(":productId", productId!);
        const response: ProductResponse = yield call(() => postData(url, action.payload));
        yield put(addManyItemSuccess(response));
      } catch (error: any) {
        yield put(addManyItemFailure(handleErrorMessage(error, "delete", "productOption")));
      }
    },
  );
}

function* changeIndexSaga(): Generator {
  yield takeLatest(
    "productOption/changeIndex",
    function* (action: PayloadAction<ChangeOptionIndexPayload>) {
      try {
        const { productId, data } = action.payload;
        const url = apiEndpoint.product.changeOptionIndex.replace(":productId", productId);
        const response: ProductResponse = yield call(() =>
          putData(url, {
            data,
          }),
        );
        yield put(changeIndexSuccess(response));
      } catch (error: any) {
        yield put(changeIndexFailure(handleErrorMessage(error, "delete", "productOption")));
      }
    },
  );
}

function* deleteItemsSaga(): Generator {
  yield takeLatest(
    "productOption/deleteItems",
    function* (action: PayloadAction<PayloadWithSubId>) {
      try {
        const { id, productId } = action.payload;
        const url = apiEndpoint.product.manyOption.replace(":productId", productId);
        const response: ProductResponse = yield call(() => deleteData(`${url}/${id}`));
        yield put(deleteItemsSuccess(response));
      } catch (error: any) {
        yield put(deleteItemsFailure(handleErrorMessage(error, "delete", "productOption")));
      }
    },
  );
}

export const ProductOptionSaga = createBaseSaga<IProductOption, ProductPartialQuery>({
  name: "productOption",
  api: apiEndpoint.product.option,
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
  extraSagas: [addManyItemSaga, changeIndexSaga, deleteItemsSaga],
});
