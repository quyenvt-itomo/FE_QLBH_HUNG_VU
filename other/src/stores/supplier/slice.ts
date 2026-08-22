import { createSlice } from "@reduxjs/toolkit";
import { createBaseInitialState, createBaseReducers } from "../baseReducers";

import { IPartner, PartnerQuery, PartnerResponse } from "../../models/partner";
import { SUPPLIER_MESSAGES } from "../../constants/message/partner";

const initialState = createBaseInitialState<IPartner>();

const supplierSlice = createSlice({
  name: "supplier",
  initialState,
  reducers: {
    ...createBaseReducers<IPartner, PartnerQuery, PartnerResponse>(SUPPLIER_MESSAGES),
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
} = supplierSlice.actions;

export default supplierSlice.reducer;
