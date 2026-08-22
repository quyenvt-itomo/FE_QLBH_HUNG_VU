import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CachedOrder {
  id?: string;
  code?: string;
  [key: string]: unknown;
}

interface OrderCacheState {
  cachedOrders: Record<string, CachedOrder>;
  currentCacheId: string | null;
}

const initialState: OrderCacheState = {
  cachedOrders: {},
  currentCacheId: null,
};

const orderCacheSlice = createSlice({
  name: "orderCache",
  initialState,
  reducers: {
    addOrderCache: (state, action: PayloadAction<{ id: string; order: CachedOrder }>) => {
      state.cachedOrders[action.payload.id] = action.payload.order;
    },
    updateOrderCache: (state, action: PayloadAction<{ id: string; order: Partial<CachedOrder> }>) => {
      state.cachedOrders[action.payload.id] = {
        ...state.cachedOrders[action.payload.id],
        ...action.payload.order,
      };
    },
    removeOrderCache: (state, action: PayloadAction<string>) => {
      delete state.cachedOrders[action.payload];
      if (state.currentCacheId === action.payload) state.currentCacheId = null;
    },
    setCurrentOrderCache: (state, action: PayloadAction<string | null>) => {
      state.currentCacheId = action.payload;
    },
    clearOrderCache: (state) => {
      state.cachedOrders = {};
      state.currentCacheId = null;
    },
  },
});

export const {
  addOrderCache,
  updateOrderCache,
  removeOrderCache,
  setCurrentOrderCache,
  clearOrderCache,
} = orderCacheSlice.actions;

export default orderCacheSlice.reducer;
