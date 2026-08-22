import { createSlice } from "@reduxjs/toolkit";
import { createBaseSettingInitialState, createBaseSettingReducers } from "../baseSettingReducers";
import { FormatData, FormatResponse } from "../../models/base/format";
import { FORMAT_MESSAGES } from "../../constants/message/format";

const initialState = createBaseSettingInitialState<FormatData>();

const settingSlice = createSlice({
  name: "setting",
  initialState,
  reducers: {
    ...createBaseSettingReducers<FormatData, FormatResponse>(FORMAT_MESSAGES),
  },
});

export const {
  getItem,
  getItemSuccess,
  getItemFailure,
  updateItem,
  updateItemSuccess,
  updateItemFailure,
  clearMessage,
  resetErrors,
  reset,
} = settingSlice.actions;

export default settingSlice.reducer;
