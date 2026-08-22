import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BaseFailurePayload } from "../baseReducers";
import { ApiResponse, PaginationProps, SummaryData } from "../../models/base/api";
import {
  IInventoryReport,
  IInventoryTransaction,
  InventoryQuery,
} from "../../models/store/inventory";

export interface InventoryState {
  inventoryReports: IInventoryReport[];
  pagination?: PaginationProps;
  loading: boolean;
  summary?: SummaryData | null;

  inventoryTransactions: IInventoryTransaction[];
  transactionPagination?: PaginationProps;
  transactionSummary?: SummaryData | null;
}

const initialState: InventoryState = {
  inventoryReports: [],
  pagination: {
    currentPage: 1,
    size: 10,
    totalRecords: 0,
    totalPages: 0,
  },
  loading: false,
  summary: undefined,

  inventoryTransactions: [],
  transactionPagination: undefined,
  transactionSummary: undefined,
};

const inventorySlice = createSlice({
  name: "inventory",
  initialState,
  reducers: {
    getInventoryReport: (state, action: PayloadAction<InventoryQuery>) => {
      state.loading = true;
    },
    getInventoryReportSuccess: (state, action: PayloadAction<ApiResponse<IInventoryReport[]>>) => {
      state.loading = false;
      state.inventoryReports = action.payload.data || [];
      state.pagination = action.payload.pagination;
      state.summary = action.payload.summary;
    },
    getInventoryReportFailure: (state, action: PayloadAction<BaseFailurePayload>) => {
      state.loading = false;
    },

    getInventoryTransaction: (state, action: PayloadAction<InventoryQuery>) => {
      state.loading = true;
    },
    getInventoryTransactionSuccess: (
      state,
      action: PayloadAction<ApiResponse<IInventoryTransaction[]>>,
    ) => {
      state.loading = false;
      state.inventoryTransactions = action.payload.data || [];
      state.transactionPagination = action.payload.pagination;
      state.transactionSummary = action.payload.summary;
    },
    getInventoryTransactionFailure: (state, action: PayloadAction<BaseFailurePayload>) => {
      state.loading = false;
    },
  },
});

export const {
  getInventoryReport,
  getInventoryReportSuccess,
  getInventoryReportFailure,

  getInventoryTransaction,
  getInventoryTransactionSuccess,
  getInventoryTransactionFailure,
} = inventorySlice.actions;

export default inventorySlice.reducer;
