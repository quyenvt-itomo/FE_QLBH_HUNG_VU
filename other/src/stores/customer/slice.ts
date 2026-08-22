import { createSlice } from "@reduxjs/toolkit";
import { createBaseInitialState, createBaseReducers } from "../baseReducers";
import { CUSTOMER_MESSAGES } from "../../constants/message/partner";

import { IPartner, PartnerQuery, PartnerResponse } from "../../models/partner";

const initialState = createBaseInitialState<IPartner>();

const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    ...createBaseReducers<IPartner, PartnerQuery, PartnerResponse>(CUSTOMER_MESSAGES),
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
} = customerSlice.actions;

export default customerSlice.reducer;
