import { createSlice } from "@reduxjs/toolkit";
import { createBaseInitialState, createBaseReducers } from "../baseReducers";
import {
  IInventoryAdjustment,
  InventoryAdjustmentQuery,
  InventoryAdjustmentResponse,
} from "../../models/store/inventoryAdjustment";
import { INVENTORY_ADJUSTMENT_MESSAGES } from "../../constants/message/inventory";

const initialState = createBaseInitialState<IInventoryAdjustment>();

const inventoryAdjustmentSlice = createSlice({
  name: "inventoryAdjustment",
  initialState,
  reducers: {
    ...createBaseReducers<
      IInventoryAdjustment,
      InventoryAdjustmentQuery,
      InventoryAdjustmentResponse
    >(INVENTORY_ADJUSTMENT_MESSAGES),
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
} = inventoryAdjustmentSlice.actions;

export default inventoryAdjustmentSlice.reducer;
