import { createSlice } from "@reduxjs/toolkit";
import { createBaseInitialState, createBaseReducers } from "../baseReducers";
import { IOrder, OrderQuery, OrderResponse } from "../../models/store/order";
import { SALE_RETURN_MESSAGES } from "../../constants/message/order";

const initialState = createBaseInitialState<IOrder>();

const saleReturnSlice = createSlice({
  name: "saleReturn",
  initialState,
  reducers: {
    ...createBaseReducers<IOrder, OrderQuery, OrderResponse>(SALE_RETURN_MESSAGES),
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
} = saleReturnSlice.actions;

export default saleReturnSlice.reducer;
