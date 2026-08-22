import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IOrder } from "../../models/store/order";

export interface IOrderCache extends Partial<IOrder> {}

interface SaleOrderCacheState {
  cachedOrders: IOrderCache[];
  currentCacheId?: string;
}

const initialState: SaleOrderCacheState = {
  cachedOrders: [],
  currentCacheId: undefined,
};

const saleOrderCacheSlice = createSlice({
  name: "saleOrderCache",
  initialState,
  reducers: {
    addCachedOrder: (state, action: PayloadAction<IOrderCache>) => {
      const index = state.cachedOrders.findIndex((order) => order.id === action.payload.id);
      if (index >= 0) {
        state.cachedOrders[index] = {
          ...action.payload,
          updatedAt: new Date().toISOString(),
        };
      } else {
        // Thêm vào cuối mảng thay vì đầu
        state.cachedOrders = [...state.cachedOrders, action.payload];
      }
    },
    updateCachedOrder: (state, action: PayloadAction<{ id: string; data: IOrderCache }>) => {
      const index = state.cachedOrders.findIndex((order) => order.id === action.payload.id);
      if (index >= 0) {
        state.cachedOrders[index] = {
          ...state.cachedOrders[index],
          ...action.payload.data,
          updatedAt: new Date().toISOString(),
        };
      }
    },
    removeCachedOrder: (state, action: PayloadAction<string>) => {
      state.cachedOrders = state.cachedOrders.filter((order) => order.id !== action.payload);
      if (state.currentCacheId === action.payload) {
        state.currentCacheId = undefined;
      }
    },
    setCurrentCacheId: (state, action: PayloadAction<string | undefined>) => {
      state.currentCacheId = action.payload;
    },
    clearAllCachedOrders: (state) => {
      state.cachedOrders = [];
      state.currentCacheId = undefined;
    },
  },
});

export const {
  addCachedOrder,
  updateCachedOrder,
  removeCachedOrder,
  setCurrentCacheId,
  clearAllCachedOrders,
} = saleOrderCacheSlice.actions;

export default saleOrderCacheSlice.reducer;
