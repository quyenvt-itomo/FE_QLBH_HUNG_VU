import * as productActions from "./slice";
import { apiEndpoint } from "../../constants/ApiEndpoint";
import { createBaseSaga } from "../createBaseSaga";
import { IProduct, ProductQuery, ProductResponse } from "../../models/product";
import { call, put, takeLatest } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import { deleteData } from "../../api/apiClient";
import { handleErrorMessage } from "../../utils/handleMessageError";
import { isDeepStrictEqual } from "node:util";

const {
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
  deleteItemManySuccess,
  deleteItemManyFailure,
} = productActions;

function* deleteItemManySaga(): Generator {
  yield takeLatest("product/deleteItemMany", function* (action: PayloadAction<string[]>) {
    try {
      // biết url thành url?ids[]=1&ids[]=2&ids[]=3

      const queryString = action.payload.map((id) => `ids[]=${id}`).join("&");
      const url = `${apiEndpoint.product.many}?${queryString}`;

      const response: ProductResponse = yield call(() => deleteData(url));
      yield put(deleteItemManySuccess(response));
    } catch (error: any) {
      yield put(deleteItemManyFailure(handleErrorMessage(error, "delete", "product")));
    }
  });
}

export const ProductSaga = createBaseSaga<IProduct, ProductQuery>({
  name: "product",
  api: apiEndpoint.product.base,
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
  extraSagas: [deleteItemManySaga],
});
