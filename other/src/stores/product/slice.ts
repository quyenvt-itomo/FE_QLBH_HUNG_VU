import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BaseState, createBaseInitialState, createBaseReducers } from "../baseReducers";
import { IProduct, ProductQuery, ProductResponse } from "../../models/product";
import { PRODUCT_MESSAGES } from "../../constants/message/product";
import { TypeMessage } from "../../constants/enum";

const initialState = createBaseInitialState<IProduct>();

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    ...createBaseReducers<IProduct, ProductQuery, ProductResponse>(PRODUCT_MESSAGES),

    deleteItemMany(state: BaseState<IProduct>, action: PayloadAction<string[]>) {
      state.loading = true;
    },
    deleteItemManySuccess(state, action) {
      state.loading = false;
      state.isCheckDelete = true;
      state.message = { type: TypeMessage.success, message: PRODUCT_MESSAGES.DELETE };
    },
    deleteItemManyFailure(state, action) {
      state.loading = false;
      state.errors = action.payload.errors;
      state.message = {
        type: TypeMessage.error,
        message: action.payload.message,
      };
    },
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
  deleteItemMany,
  deleteItemManySuccess,
  deleteItemManyFailure,
  clearMessage,
  reset,
  resetItem,
  resetNewData,
  resetErrors,
  resetDeletedId,
} = productSlice.actions;

export default productSlice.reducer;
