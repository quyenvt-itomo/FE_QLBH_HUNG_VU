import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BaseFailurePayload, createBaseInitialState, createBaseReducers } from "../baseReducers";
import { IStore, StoreQuery, StoreResponse } from "../../models/store";
import { TypeMessage } from "../../constants/enum";
import { STORE_MESSAGES } from "../../constants/message/store";

const initialState = createBaseInitialState<IStore>();

const storeSlice = createSlice({
  name: "store",
  initialState,
  reducers: {
    ...createBaseReducers<IStore, StoreQuery, StoreResponse>(STORE_MESSAGES),
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
} = storeSlice.actions;

export default storeSlice.reducer;
