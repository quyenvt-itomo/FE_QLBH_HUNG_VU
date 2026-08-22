import { createSlice } from "@reduxjs/toolkit";
import { createBaseInitialState, createBaseReducers } from "../../baseReducers";
import { IOrderLine, OrderLineQuery, OrderLineResponse } from "../../../models/store/orderLine";
import { PURCHASE_LINE_MESSAGES } from "../../../constants/message/order";

const initialState = createBaseInitialState<IOrderLine>();

const purchaseLineSlice = createSlice({
  name: "purchaseLine",
  initialState,
  reducers: {
    ...createBaseReducers<IOrderLine, OrderLineQuery, OrderLineResponse>(PURCHASE_LINE_MESSAGES),
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
} = purchaseLineSlice.actions;

export default purchaseLineSlice.reducer;
