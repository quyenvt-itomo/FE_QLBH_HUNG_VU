import { createSlice } from "@reduxjs/toolkit";
import { createBaseInitialState, createBaseReducers } from "../baseReducers";
import { IOrder, OrderQuery, OrderResponse } from "../../models/store/order";
import { PURCHASE_MESSAGES } from "../../constants/message/order";

const initialState = createBaseInitialState<IOrder>();

const purchaseSlice = createSlice({
  name: "purchase",
  initialState,
  reducers: {
    ...createBaseReducers<IOrder, OrderQuery, OrderResponse>(PURCHASE_MESSAGES),
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
} = purchaseSlice.actions;

export default purchaseSlice.reducer;
