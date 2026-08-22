import { PayloadAction } from "@reduxjs/toolkit";
import { BaseError, BaseFailurePayload } from "./baseReducers";
import { MessageToastModel } from "../models/base/interface";
import { TypeMessage } from "../constants/enum";
import { ApiResponse } from "../models/base/api";

// ===== Types =====

export interface BaseSettingState<T = any> {
  data: T | null;
  loading: boolean;
  message: MessageToastModel;
  errors: BaseError[] | null;
  isCheckUpdate?: boolean;
}

// ===== Initial State Factory =====

export const createBaseSettingInitialState = <T>(): BaseSettingState<T> => ({
  data: null,
  loading: false,
  message: { type: TypeMessage.none },
  errors: null,
  isCheckUpdate: false,
});

// ===== Reducers Factory =====

export function createBaseSettingReducers<
  TData,
  TResponse extends ApiResponse,
>(messages: { UPDATE: string }) {
  return {
    clearMessage: (state: BaseSettingState) => {
      state.message = { type: TypeMessage.none };
    },

    resetErrors: (state: BaseSettingState) => {
      state.errors = null;
    },

    reset: (state: BaseSettingState) => {
      state.isCheckUpdate = false;
    },

    getItem: (state: BaseSettingState) => {
      state.loading = true;
    },
    getItemSuccess: (
      state: BaseSettingState,
      action: PayloadAction<TResponse>,
    ) => {
      state.loading = false;
      state.data = action.payload.data;
    },
    getItemFailure: (
      state: BaseSettingState,
      action: PayloadAction<BaseFailurePayload>,
    ) => {
      state.loading = false;
      state.errors = action.payload.errors;
      state.message = {
        type: TypeMessage.error,
        message: action.payload.message,
      };
    },

    updateItem: (state: BaseSettingState, action: PayloadAction<TData>) => {
      state.loading = true;
    },
    updateItemSuccess: (state: BaseSettingState) => {
      state.loading = false;
      state.message = { type: TypeMessage.success, message: messages.UPDATE };
      state.isCheckUpdate = true;
    },
    updateItemFailure: (
      state: BaseSettingState,
      action: PayloadAction<BaseFailurePayload>,
    ) => {
      state.loading = false;
      state.errors = action.payload.errors;
      state.message = {
        type: TypeMessage.error,
        message: action.payload.message,
      };
    },
  };
}
