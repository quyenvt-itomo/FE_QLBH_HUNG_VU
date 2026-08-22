import { createSlice } from "@reduxjs/toolkit";
import { createBaseInitialState, createBaseReducers } from "../baseReducers";
import { IFundCategory, FundCategoryQuery, FundCategoryResponse } from "../../models/fundCategory";
import { FUND_CATEGORY_MESSAGES } from "../../constants/message/fund";

const initialState = createBaseInitialState<IFundCategory>();

const fundCategorySlice = createSlice({
  name: "fundCategory",
  initialState,
  reducers: {
    ...createBaseReducers<IFundCategory, FundCategoryQuery, FundCategoryResponse>(
      FUND_CATEGORY_MESSAGES,
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
} = fundCategorySlice.actions;

export default fundCategorySlice.reducer;
