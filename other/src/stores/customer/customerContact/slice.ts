import { createSlice } from "@reduxjs/toolkit";
import { createBaseInitialState, createBaseReducers } from "../../baseReducers";
import { IContact, ContactQuery, ContactResponse } from "../../../models/partnerContact";
import { CONTACT_MESSAGES } from "../../../constants/message/partner";

const initialState = createBaseInitialState<IContact>();

const customerContactSlice = createSlice({
  name: "customerContact",
  initialState,
  reducers: {
    ...createBaseReducers<IContact, ContactQuery, ContactResponse>(CONTACT_MESSAGES),
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
} = customerContactSlice.actions;

export default customerContactSlice.reducer;
