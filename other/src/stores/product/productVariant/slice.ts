import { createSlice } from "@reduxjs/toolkit";
import { createBaseInitialState, createBaseReducers } from "../../baseReducers";
import { PRODUCT_VARIANT_MESSAGES } from "../../../constants/message/product";
import { IProductVariant, ProductPartialQuery, ProductResponse } from "../../../models/product";

const initialState = createBaseInitialState<IProductVariant>();

const productVariantSlice = createSlice({
  name: "productVariant",
  initialState,
  reducers: {
    ...createBaseReducers<IProductVariant, ProductPartialQuery, ProductResponse>(
      PRODUCT_VARIANT_MESSAGES,
    ),
  },
});

export const {
  getAll,
  getAllSuccess,
  getAllFailure,
  getItem,
  getItemSuccess,
  getItemFailure,
  addItem,
  addItemSuccess,
  addItemFailure,
  updateItem,
  updateItemSuccess,
  updateItemFailure,
  deleteItem,
  deleteItemSuccess,
  deleteItemFailure,
  clearMessage,
  reset,
  resetItem,
  resetNewData,
  resetErrors,
  resetDeletedId,
} = productVariantSlice.actions;

export default productVariantSlice.reducer;
