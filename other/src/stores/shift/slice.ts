import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BaseState, createBaseInitialState, createBaseReducers } from "../baseReducers";
import {
  CloseShiftPayload,
  IShift,
  OpenShiftPayload,
  ShiftQuery,
  ShiftResponse,
  ShiftSummary,
} from "../../models/store/shift";
import { SHIFT_MESSAGES } from "../../constants/message/shift";
import { TypeMessage } from "../../constants/enum";

const initialState: BaseState<IShift> & {
  shiftSummary: ShiftSummary | null;
} = { ...createBaseInitialState<IShift>(), shiftSummary: null };

const shiftSlice = createSlice({
  name: "shift",
  initialState,
  reducers: {
    ...createBaseReducers<IShift, ShiftQuery, ShiftResponse>(SHIFT_MESSAGES),

    getItemSummary(state: BaseState<IShift>, action: PayloadAction<string>) {
      state.loading = true;
    },
    getItemSummarySuccess(state, action) {
      state.loading = false;
      state.shiftSummary = action.payload.data;
    },
    getItemSummaryFailure(state, action) {
      state.loading = false;
      state.errors = action.payload.errors;
      state.message = {
        type: TypeMessage.error,
        message: action.payload.message,
      };
    },

    openItem(state: BaseState<IShift>, action: PayloadAction<OpenShiftPayload>) {
      state.loading = true;
    },
    openItemSuccess(state, action) {
      state.loading = false;
      state.isCheckAdd = true;
      state.newData = action.payload.data;
      state.message = { type: TypeMessage.success, message: SHIFT_MESSAGES.OPEN };
    },
    openItemFailure(state, action) {
      state.loading = false;
      state.errors = action.payload.errors;
      state.message = {
        type: TypeMessage.error,
        message: action.payload.message,
      };
    },

    closeItem(state: BaseState<IShift>, action: PayloadAction<CloseShiftPayload>) {
      state.loading = true;
    },
    closeItemSuccess(state, action) {
      state.loading = false;
      state.isCheckUpdate = true;
      state.newData = action.payload.data;
      state.message = { type: TypeMessage.success, message: SHIFT_MESSAGES.CLOSE };
    },
    closeItemFailure(state, action) {
      state.loading = false;
      state.errors = action.payload.errors;
      state.message = {
        type: TypeMessage.error,
        message: action.payload.message,
      };
    },

    setItemSummary(state, action: PayloadAction<ShiftSummary | null>) {
      state.shiftSummary = action.payload;
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

  getItemSummary,
  getItemSummarySuccess,
  getItemSummaryFailure,

  addItem,
  addItemSuccess,
  addItemFailure,

  openItem,
  openItemSuccess,
  openItemFailure,

  closeItem,
  closeItemSuccess,
  closeItemFailure,

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
  setItemSummary,
} = shiftSlice.actions;

export default shiftSlice.reducer;
