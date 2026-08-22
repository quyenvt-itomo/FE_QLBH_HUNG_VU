import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BaseFailurePayload, createBaseInitialState, createBaseReducers } from "../baseReducers";
import { ROLE_MESSAGES } from "../../constants/message/role";
import { IRole, RoleQuery, RoleResponse } from "../../models/store/role";
import { TypeMessage } from "../../constants/enum";

const initialState = createBaseInitialState<IRole>();

const roleSlice = createSlice({
  name: "role",
  initialState,
  reducers: {
    ...createBaseReducers<IRole, RoleQuery, RoleResponse>(ROLE_MESSAGES),
    updatePermissionItem: (state, action: PayloadAction<IRole>) => {
      state.loading = true;
    },
    updatePermissionItemSuccess: (state, action: PayloadAction<IRole>) => {
      state.loading = false;
      state.message = {
        type: TypeMessage.success,
        message: ROLE_MESSAGES.UPDATE,
      };
      state.isCheckUpdate = true;
    },
    updatePermissionItemFailure: (state, action: PayloadAction<BaseFailurePayload>) => {
      state.loading = false;
      state.errors = action.payload.errors;
      state.message = {
        type: TypeMessage.error,
        message: action.payload.message,
      };
    },
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

  updatePermissionItem,
  updatePermissionItemSuccess,
  updatePermissionItemFailure,

  deleteItem,
  deleteItemSuccess,
  deleteItemFailure,
  clearMessage,
  reset,
  resetErrors,
  resetNewData,
} = roleSlice.actions;

export default roleSlice.reducer;
