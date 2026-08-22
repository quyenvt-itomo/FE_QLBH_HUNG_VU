import { createSlice } from "@reduxjs/toolkit";
import { createBaseInitialState, createBaseReducers } from "../../baseReducers";
import {
  IInventoryAdjustmentLine,
  InventoryAdjustmentLineQuery,
  InventoryAdjustmentLineResponse,
} from "../../../models/store/inventoryAdjustmentLine";
import { INVENTORY_ADJUSTMENT_LINE_MESSAGES } from "../../../constants/message/inventory";

const initialState = createBaseInitialState<IInventoryAdjustmentLine>();

const inventoryAdjustmentLineSlice = createSlice({
  name: "inventoryAdjustmentLine",
  initialState,
  reducers: {
    ...createBaseReducers<
      IInventoryAdjustmentLine,
      InventoryAdjustmentLineQuery,
      InventoryAdjustmentLineResponse
    >(INVENTORY_ADJUSTMENT_LINE_MESSAGES),
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
} = inventoryAdjustmentLineSlice.actions;

export default inventoryAdjustmentLineSlice.reducer;
