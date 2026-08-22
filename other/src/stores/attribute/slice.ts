import { createSlice } from "@reduxjs/toolkit";
import { createBaseInitialState, createBaseReducers } from "../baseReducers";
import { ATTRIBUTE_MESSAGES } from "../../constants/message/attribute";
import {
  IAttribute,
  AttributeQuery,
  AttributeResponse,
} from "../../models/base/attribute";

const initialState = createBaseInitialState<IAttribute>();

const attributeSlice = createSlice({
  name: "attribute",
  initialState,
  reducers: {
    ...createBaseReducers<IAttribute, AttributeQuery, AttributeResponse>(
      ATTRIBUTE_MESSAGES,
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
  resetErrors,
  resetNewData,
} = attributeSlice.actions;

export default attributeSlice.reducer;
