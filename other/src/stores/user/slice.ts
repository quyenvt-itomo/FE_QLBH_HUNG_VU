import { createSlice } from "@reduxjs/toolkit";
import { createBaseInitialState, createBaseReducers } from "../baseReducers";
import { USER_MESSAGES } from "../../constants/message/user";
import { IUser, UserQuery, UserResponse } from "../../models/user";

const initialState = createBaseInitialState<IUser>();

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    ...createBaseReducers<IUser, UserQuery, UserResponse>(USER_MESSAGES),
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
  resetItem,
  resetNewData,
} = userSlice.actions;

export default userSlice.reducer;
