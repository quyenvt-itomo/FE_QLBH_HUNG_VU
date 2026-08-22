import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ApiResponse, PaginationProps, SummaryData } from "../../models/base/api";
import { IDebtReport, IDebtTransaction, DebtQuery } from "../../models/store/debt";
import { BaseFailurePayload } from "../../stores/baseReducers";

export interface DebtState {
  debtReports: IDebtReport[];
  pagination?: PaginationProps;
  loading: boolean;
  summary?: SummaryData | null;

  debtTransactions: IDebtTransaction[];
}

const initialState: DebtState = {
  debtReports: [],
  pagination: {
    currentPage: 1,
    size: 10,
    totalRecords: 0,
    totalPages: 0,
  },
  loading: false,
  summary: undefined,

  debtTransactions: [],
};

const debtSlice = createSlice({
  name: "debt",
  initialState,
  reducers: {
    getDebtReport: (state, action: PayloadAction<DebtQuery>) => {
      state.loading = true;
    },
    getDebtReportSuccess: (state, action: PayloadAction<ApiResponse<IDebtReport[]>>) => {
      state.loading = false;
      state.debtReports = action.payload.data || [];
      state.pagination = action.payload.pagination;
      state.summary = action.payload.summary;
    },
    getDebtReportFailure: (state, action: PayloadAction<BaseFailurePayload>) => {
      state.loading = false;
    },

    getDebtTransaction: (state, action: PayloadAction<DebtQuery>) => {
      state.loading = true;
    },
    getDebtTransactionSuccess: (state, action: PayloadAction<ApiResponse<IDebtTransaction[]>>) => {
      state.loading = false;
      state.debtTransactions = action.payload.data || [];
    },
    getDebtTransactionFailure: (state, action: PayloadAction<BaseFailurePayload>) => {
      state.loading = false;
    },
  },
});

export const {
  getDebtReport,
  getDebtReportSuccess,
  getDebtReportFailure,

  getDebtTransaction,
  getDebtTransactionSuccess,
  getDebtTransactionFailure,
} = debtSlice.actions;

export default debtSlice.reducer;
