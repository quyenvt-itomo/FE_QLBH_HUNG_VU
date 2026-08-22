import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BaseFailurePayload, createBaseInitialState, createBaseReducers } from "../baseReducers";
import { SYSTEM_ROLE_MESSAGES } from "../../constants/message/systemRole";
import { ISystemRole, SystemRoleQuery, SystemRoleResponse } from "../../models/systemRole";
import { TypeMessage } from "../../constants/enum";

const initialState = createBaseInitialState<ISystemRole>();

const systemRoleSlice = createSlice({
  name: "systemRole",
  initialState,
  reducers: {
    ...createBaseReducers<ISystemRole, SystemRoleQuery, SystemRoleResponse>(SYSTEM_ROLE_MESSAGES),
    updatePermissionItem: (state, action: PayloadAction<Partial<ISystemRole>>) => {
      state.loading = true;
    },
    updatePermissionItemSuccess: (state, action: PayloadAction<ISystemRole>) => {
      state.loading = false;
      state.message = {
        type: TypeMessage.success,
        message: SYSTEM_ROLE_MESSAGES.UPDATE,
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
} = systemRoleSlice.actions;

export default systemRoleSlice.reducer;
