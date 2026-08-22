import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BaseFailurePayload } from "../baseReducers";
import { ApiResponse } from "../../models/base/api";
import {
  DashboardOverviewData,
  DashboardProfitData,
  DashboardSalesData,
  DashboardQuery,
  DashboardProductData,
  DashboardDetailProductData,
} from "../../models/dashboard";

export interface DashboardState {
  overviewData: DashboardOverviewData | null;
  profitData: DashboardProfitData | null;
  salesData: DashboardSalesData | null;
  productData: DashboardProductData | null;

  detailProductData: DashboardDetailProductData | null;
  loading: boolean;
}

const initialState: DashboardState = {
  overviewData: null,
  profitData: null,
  salesData: null,
  productData: null,
  detailProductData: null,
  loading: false,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    getOverview: (state, action: PayloadAction<DashboardQuery>) => {
      state.loading = true;
    },
    getOverviewSuccess: (state, action: PayloadAction<ApiResponse>) => {
      state.loading = false;
      state.overviewData = action.payload.data || null;
    },
    getOverviewFailure: (state, action: PayloadAction<BaseFailurePayload>) => {
      state.loading = false;
    },

    getProfit: (state, action: PayloadAction<DashboardQuery>) => {
      state.loading = true;
    },
    getProfitSuccess: (state, action: PayloadAction<ApiResponse>) => {
      state.loading = false;
      state.profitData = action.payload.data || null;
    },
    getProfitFailure: (state, action: PayloadAction<BaseFailurePayload>) => {
      state.loading = false;
    },

    getSales: (state, action: PayloadAction<DashboardQuery>) => {
      state.loading = true;
    },
    getSalesSuccess: (state, action: PayloadAction<ApiResponse>) => {
      state.loading = false;
      state.salesData = action.payload.data || null;
    },
    getSalesFailure: (state, action: PayloadAction<BaseFailurePayload>) => {
      state.loading = false;
    },

    getProduct: (state, action: PayloadAction<DashboardQuery>) => {
      state.loading = true;
    },
    getProductSuccess: (state, action: PayloadAction<ApiResponse>) => {
      state.loading = false;
      state.productData = action.payload.data || null;
    },
    getProductFailure: (state, action: PayloadAction<BaseFailurePayload>) => {
      state.loading = false;
    },

    getDetailProduct: (state, action: PayloadAction<DashboardQuery>) => {
      state.loading = true;
    },
    getDetailProductSuccess: (state, action: PayloadAction<ApiResponse>) => {
      state.loading = false;
      state.detailProductData = action.payload.data || null;
    },
    getDetailProductFailure: (state, action: PayloadAction<BaseFailurePayload>) => {
      state.loading = false;
    },
  },
});

export const {
  getOverview,
  getOverviewSuccess,
  getOverviewFailure,

  getProfit,
  getProfitSuccess,
  getProfitFailure,

  getSales,
  getSalesSuccess,
  getSalesFailure,

  getProduct,
  getProductSuccess,
  getProductFailure,

  getDetailProduct,
  getDetailProductSuccess,
  getDetailProductFailure,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
