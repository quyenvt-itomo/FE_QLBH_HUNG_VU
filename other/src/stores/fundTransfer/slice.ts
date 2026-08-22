import { createSlice } from "@reduxjs/toolkit";
import { createBaseInitialState, createBaseReducers } from "../baseReducers";
import { IFundTransfer, FundTransferQuery, FundTransferResponse } from "../../models/fundTransfer";
import { FUND_TRANSFER_MESSAGES } from "../../constants/message/fund";

const initialState = createBaseInitialState<IFundTransfer>();

const fundTransferSlice = createSlice({
  name: "fundTransfer",
  initialState,
  reducers: {
    ...createBaseReducers<IFundTransfer, FundTransferQuery, FundTransferResponse>(
      FUND_TRANSFER_MESSAGES,
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
} = fundTransferSlice.actions;

export default fundTransferSlice.reducer;
