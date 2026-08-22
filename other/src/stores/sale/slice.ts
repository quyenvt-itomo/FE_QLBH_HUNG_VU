import { createSlice } from "@reduxjs/toolkit";
import { createBaseInitialState, createBaseReducers } from "../baseReducers";
import { IOrder, OrderQuery, OrderResponse } from "../../models/store/order";
import { SALE_MESSAGES } from "../../constants/message/order";

const initialState = createBaseInitialState<IOrder>();

const saleSlice = createSlice({
  name: "sale",
  initialState,
  reducers: {
    ...createBaseReducers<IOrder, OrderQuery, OrderResponse>(SALE_MESSAGES),
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
} = saleSlice.actions;

export default saleSlice.reducer;
