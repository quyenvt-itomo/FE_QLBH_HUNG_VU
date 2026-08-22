import { createSlice } from "@reduxjs/toolkit";
import { createBaseInitialState, createBaseReducers } from "../baseReducers";
import {
  IVatAdjustment,
  VatAdjustmentQuery,
  VatAdjustmentResponse,
} from "../../models/store/vatAdjustment";
import { VAT_ADJUSTMENT_MESSAGES } from "../../constants/message/vat";

const initialState = createBaseInitialState<IVatAdjustment>();

const vatAdjustmentSlice = createSlice({
  name: "vatAdjustment",
  initialState,
  reducers: {
    ...createBaseReducers<IVatAdjustment, VatAdjustmentQuery, VatAdjustmentResponse>(
      VAT_ADJUSTMENT_MESSAGES,
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
} = vatAdjustmentSlice.actions;

export default vatAdjustmentSlice.reducer;
