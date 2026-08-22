import { createSlice } from "@reduxjs/toolkit";
import { createBaseInitialState, createBaseReducers } from "../baseReducers";
import {
  IIncomeExpense,
  IncomeExpenseQuery,
  IncomeExpenseResponse,
} from "../../models/store/incomeExpense";
import { INCOME_EXPENSE_MESSAGES } from "../../constants/message/fund";

const initialState = createBaseInitialState<IIncomeExpense>();

const incomeExpenseSlice = createSlice({
  name: "incomeExpense",
  initialState,
  reducers: {
    ...createBaseReducers<IIncomeExpense, IncomeExpenseQuery, IncomeExpenseResponse>(
      INCOME_EXPENSE_MESSAGES,
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
} = incomeExpenseSlice.actions;

export default incomeExpenseSlice.reducer;
