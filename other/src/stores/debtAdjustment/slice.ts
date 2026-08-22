import { createSlice } from "@reduxjs/toolkit";
import { createBaseInitialState, createBaseReducers } from "../baseReducers";
import {
  IDebtAdjustment,
  DebtAdjustmentQuery,
  DebtAdjustmentResponse,
} from "../../models/store/debtAdjustment";
import { DEBT_ADJUSTMENT_MESSAGES } from "../../constants/message/debt";

const initialState = createBaseInitialState<IDebtAdjustment>();

const debtAdjustmentSlice = createSlice({
  name: "debtAdjustment",
  initialState,
  reducers: {
    ...createBaseReducers<IDebtAdjustment, DebtAdjustmentQuery, DebtAdjustmentResponse>(
      DEBT_ADJUSTMENT_MESSAGES,
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
} = debtAdjustmentSlice.actions;

export default debtAdjustmentSlice.reducer;
