import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BaseFailurePayload } from "../baseReducers";
import { ApiResponse, PaginationProps, SummaryData } from "../../models/base/api";
import { IDebtReport, IDebtTransaction, DebtQuery } from "../../models/store/debt";

export interface DebtState {
  debtReports: IDebtReport[];
  pagination?: PaginationProps;
  loading: boolean;
  summary?: SummaryData | null;

  debtTransactions: IDebtTransaction[];
  transactionSummary?: SummaryData | null;
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
  transactionSummary: undefined,
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
      state.transactionSummary = action.payload.summary;
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
