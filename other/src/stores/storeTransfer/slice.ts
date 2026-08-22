import { createSlice } from "@reduxjs/toolkit";
import { createBaseInitialState, createBaseReducers } from "../baseReducers";
import {
  IStoreTransfer,
  StoreTransferQuery,
  StoreTransferResponse,
} from "../../models/storeTransfer";
import { STORE_TRANSFER_MESSAGES } from "../../constants/message/inventory";

const initialState = createBaseInitialState<IStoreTransfer>();

const storeTransferSlice = createSlice({
  name: "storeTransfer",
  initialState,
  reducers: {
    ...createBaseReducers<IStoreTransfer, StoreTransferQuery, StoreTransferResponse>(
      STORE_TRANSFER_MESSAGES,
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
} = storeTransferSlice.actions;

export default storeTransferSlice.reducer;
