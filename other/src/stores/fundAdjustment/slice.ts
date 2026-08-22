import { createSlice } from "@reduxjs/toolkit";
import { createBaseInitialState, createBaseReducers } from "../baseReducers";
import {
  IFundAdjustment,
  FundAdjustmentQuery,
  FundAdjustmentResponse,
} from "../../models/fundAdjustment";
import { FUND_ADJUSTMENT_MESSAGES } from "../../constants/message/fund";

const initialState = createBaseInitialState<IFundAdjustment>();

const fundAdjustmentSlice = createSlice({
  name: "fundAdjustment",
  initialState,
  reducers: {
    ...createBaseReducers<IFundAdjustment, FundAdjustmentQuery, FundAdjustmentResponse>(
      FUND_ADJUSTMENT_MESSAGES,
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
} = fundAdjustmentSlice.actions;

export default fundAdjustmentSlice.reducer;
