import { createSlice } from "@reduxjs/toolkit";
import { createBaseInitialState, createBaseReducers } from "../../baseReducers";
import { IOrderLine, OrderLineQuery, OrderLineResponse } from "../../../models/store/orderLine";
import { SALE_RETURN_LINE_MESSAGES } from "../../../constants/message/order";

const initialState = createBaseInitialState<IOrderLine>();

const saleReturnLineSlice = createSlice({
  name: "saleReturnLine",
  initialState,
  reducers: {
    ...createBaseReducers<IOrderLine, OrderLineQuery, OrderLineResponse>(SALE_RETURN_LINE_MESSAGES),
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
} = saleReturnLineSlice.actions;

export default saleReturnLineSlice.reducer;
