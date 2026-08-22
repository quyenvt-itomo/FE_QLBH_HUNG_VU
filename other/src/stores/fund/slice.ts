import { createSlice } from "@reduxjs/toolkit";
import { createBaseInitialState, createBaseReducers } from "../baseReducers";

import { FUND_MESSAGES } from "../../constants/message/fund";
import { FundQuery, FundResponse, IFund } from "../../models/fund";

const initialState = createBaseInitialState<IFund>();

const fundSlice = createSlice({
  name: "fund",
  initialState,
  reducers: {
    ...createBaseReducers<IFund, FundQuery, FundResponse>(FUND_MESSAGES),
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
} = fundSlice.actions;

export default fundSlice.reducer;
