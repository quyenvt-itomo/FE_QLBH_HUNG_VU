import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { randomId } from "@/shared/utils/common.util";

export type PosOrderType = "sale" | "sale_return";
export type PosCacheMode = "create" | "edit";

export interface CachedOrder {
  id: string;
  tempId: string;
  type: PosOrderType;
  label: string;
  mode: PosCacheMode;
  sourceId?: string;
  code?: string;
  partnerId?: string | null;
  partner?: unknown;
  shipperId?: string | null;
  shipper?: unknown;
  shippingFee?: number | null;
  isFreeShipping?: boolean;
  refOrderId?: string | null;
  lines?: Record<string, unknown>[];
  returnLines?: Record<string, unknown>[];
  discountType?: "amount" | "percent";
  discountValue?: number;
  taxType?: "amount" | "percent";
  taxValue?: number;
  returnDiscountType?: "amount" | "percent";
  returnDiscountValue?: number;
  returnTaxType?: "amount" | "percent";
  returnTaxValue?: number;
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

const getTypeLabel = (type: PosOrderType) =>
  type === "sale_return" ? "Trả hàng" : "Hóa đơn";

const makeLabel = (
  state: OrderCacheState,
  type: PosOrderType,
  mode: PosCacheMode,
  code?: string,
) => {
  if (mode === "edit" && code) return `Chỉnh sửa ${code}`;

  const count = Object.values(state.cachedOrders).filter(
    (item) => item.type === type && item.mode === "create",
  ).length;
  return `${getTypeLabel(type)} ${count + 1}`;
};

const createNewCache = (
  state: OrderCacheState,
  payload: {
    type: PosOrderType;
    order?: Partial<CachedOrder>;
    mode?: PosCacheMode;
    sourceId?: string;
  },
): CachedOrder => {
  const id = randomId();
  const mode = payload.mode || "create";
  const order = payload.order || {};

  return {
    ...order,
    id,
    tempId: id,
    type: payload.type,
    mode,
    sourceId: payload.sourceId || order.id,
    label: makeLabel(state, payload.type, mode, order.code),
    lines: order.lines || [],
    returnLines: order.returnLines || [],
    discountType: order.discountType || "amount",
    discountValue: order.discountValue ?? 0,
    taxType: order.taxType || "percent",
    taxValue: order.taxValue ?? 0,
  };
};

const orderCacheSlice = createSlice({
  name: "orderCache",
  initialState,
  reducers: {
    addNewCache: {
      reducer: (state, action: PayloadAction<CachedOrder>) => {
        const cache = {
          ...action.payload,
          label: makeLabel(
            state,
            action.payload.type,
            action.payload.mode,
            action.payload.code,
          ),
        };
        state.cachedOrders[cache.id] = cache;
        state.currentCacheId = cache.id;
      },
      prepare: (payload: {
        type: PosOrderType;
        order?: Partial<CachedOrder>;
        mode?: PosCacheMode;
        sourceId?: string;
      }) => ({ payload: createNewCache(initialState, payload) }),
    },
    addOrderCache: (state, action: PayloadAction<CachedOrder>) => {
      state.cachedOrders[action.payload.id] = action.payload;
      state.currentCacheId = action.payload.id;
    },
    updateOrderCache: (
      state,
      action: PayloadAction<{ id: string; order: Partial<CachedOrder> }>,
    ) => {
      const current = state.cachedOrders[action.payload.id];
      if (!current) return;
      state.cachedOrders[action.payload.id] = {
        ...current,
        ...action.payload.order,
        id: current.id,
        tempId: current.tempId,
        type: current.type,
        mode: current.mode,
      };
    },
    removeOrderCache: (state, action: PayloadAction<string>) => {
      delete state.cachedOrders[action.payload];
      if (state.currentCacheId === action.payload) {
        const ids = Object.keys(state.cachedOrders);
        state.currentCacheId = ids.length ? ids[ids.length - 1] : null;
      }
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
  addNewCache,
  addOrderCache,
  updateOrderCache,
  removeOrderCache,
  setCurrentOrderCache,
  clearOrderCache,
} = orderCacheSlice.actions;

export default orderCacheSlice.reducer;
