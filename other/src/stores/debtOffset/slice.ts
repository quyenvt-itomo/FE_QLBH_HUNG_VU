import { createSlice } from "@reduxjs/toolkit";
import { createBaseInitialState, createBaseReducers } from "../baseReducers";
import { IDebtOffset, DebtOffsetQuery, DebtOffsetResponse } from "../../models/store/debtOffset";
import { DEBT_OFFSET_MESSAGES } from "../../constants/message/debt";

const initialState = createBaseInitialState<IDebtOffset>();

const debtOffsetSlice = createSlice({
  name: "debtOffset",
  initialState,
  reducers: {
    ...createBaseReducers<IDebtOffset, DebtOffsetQuery, DebtOffsetResponse>(DEBT_OFFSET_MESSAGES),
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
} = debtOffsetSlice.actions;

export default debtOffsetSlice.reducer;
