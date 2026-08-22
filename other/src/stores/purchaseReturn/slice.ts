import { createSlice } from "@reduxjs/toolkit";
import { createBaseInitialState, createBaseReducers } from "../baseReducers";
import { IOrder, OrderQuery, OrderResponse } from "../../models/store/order";
import { PURCHASE_RETURN_MESSAGES } from "../../constants/message/order";

const initialState = createBaseInitialState<IOrder>();

const purchaseReturnSlice = createSlice({
  name: "purchaseReturn",
  initialState,
  reducers: {
    ...createBaseReducers<IOrder, OrderQuery, OrderResponse>(PURCHASE_RETURN_MESSAGES),
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
} = purchaseReturnSlice.actions;

export default purchaseReturnSlice.reducer;
