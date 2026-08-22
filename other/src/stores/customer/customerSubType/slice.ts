import { createSlice } from "@reduxjs/toolkit";
import { createBaseInitialState, createBaseReducers } from "../../baseReducers";

import {
  IPartnerSubType,
  PartnerSubTypeQuery,
  PartnerSubTypeResponse,
} from "../../../models/partnerSubType";
import { SUBTYPE_MESSAGES } from "../../../constants/message/partner";

const initialState = createBaseInitialState<IPartnerSubType>();

const customerSubTypeSlice = createSlice({
  name: "customerSubType",
  initialState,
  reducers: {
    ...createBaseReducers<IPartnerSubType, PartnerSubTypeQuery, PartnerSubTypeResponse>(
      SUBTYPE_MESSAGES,
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
} = customerSubTypeSlice.actions;

export default customerSubTypeSlice.reducer;
