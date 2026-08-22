import { createSlice } from "@reduxjs/toolkit";
import { createBaseInitialState, createBaseReducers } from "../../baseReducers";
import {
  IStoreTransferLine,
  StoreTransferLineQuery,
  StoreTransferLineResponse,
} from "../../../models/storeTransferLine";
import { STORE_TRANSFER_LINE_MESSAGES } from "../../../constants/message/inventory";

const initialState = createBaseInitialState<IStoreTransferLine>();

const storeTransferLineSlice = createSlice({
  name: "storeTransferLine",
  initialState,
  reducers: {
    ...createBaseReducers<IStoreTransferLine, StoreTransferLineQuery, StoreTransferLineResponse>(
      STORE_TRANSFER_LINE_MESSAGES,
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
} = storeTransferLineSlice.actions;

export default storeTransferLineSlice.reducer;
