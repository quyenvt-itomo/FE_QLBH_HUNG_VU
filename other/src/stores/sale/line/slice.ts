import { createSlice } from "@reduxjs/toolkit";
import { createBaseInitialState, createBaseReducers } from "../../baseReducers";
import { IOrderLine, OrderLineQuery, OrderLineResponse } from "../../../models/store/orderLine";
import { SALE_LINE_MESSAGES } from "../../../constants/message/order";

const initialState = createBaseInitialState<IOrderLine>();

const saleLineSlice = createSlice({
  name: "saleLine",
  initialState,
  reducers: {
    ...createBaseReducers<IOrderLine, OrderLineQuery, OrderLineResponse>(SALE_LINE_MESSAGES),
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
} = saleLineSlice.actions;

export default saleLineSlice.reducer;
