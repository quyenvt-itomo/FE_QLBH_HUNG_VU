import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BaseError, BaseFailurePayload } from "../baseReducers";
import { MessageToastModel } from "../../models/base/interface";
import { TypeMessage } from "../../constants/enum";
import { ApiResponse, PaginationProps, SummaryData } from "../../models/base/api";
import {
  FundBalanceQuery,
  IFundBalanceReport,
  IFundBalanceTransaction,
} from "../../models/fundBalance";

export interface FundBalanceState {
  fundBalanceReports: IFundBalanceReport[];
  pagination?: PaginationProps;
  loading: boolean;
  summary?: SummaryData | null;

  fundBalanceTransactions: IFundBalanceTransaction[];
}

const initialState: FundBalanceState = {
  fundBalanceReports: [],
  pagination: {
    currentPage: 1,
    size: 10,
    totalRecords: 0,
    totalPages: 0,
  },
  loading: false,
  summary: undefined,

  fundBalanceTransactions: [],
};

const fundBalanceSlice = createSlice({
  name: "fundBalance",
  initialState,
  reducers: {
    getFundBalanceReport: (state, action: PayloadAction<FundBalanceQuery>) => {
      state.loading = true;
    },
    getFundBalanceReportSuccess: (
      state,
      action: PayloadAction<ApiResponse<IFundBalanceReport[]>>,
    ) => {
      state.loading = false;
      state.fundBalanceReports = action.payload.data || [];
      state.pagination = action.payload.pagination;
      state.summary = action.payload.summary;
    },
    getFundBalanceReportFailure: (state, action: PayloadAction<BaseFailurePayload>) => {
      state.loading = false;
    },

    getFundBalanceTransaction: (state, action: PayloadAction<FundBalanceQuery>) => {
      state.loading = true;
    },
    getFundBalanceTransactionSuccess: (
      state,
      action: PayloadAction<ApiResponse<IFundBalanceTransaction[]>>,
    ) => {
      state.loading = false;
      state.fundBalanceTransactions = action.payload.data || [];
      // state.summary = action.payload.summary;
    },
    getFundBalanceTransactionFailure: (state, action: PayloadAction<BaseFailurePayload>) => {
      state.loading = false;
    },
  },
});

export const {
  getFundBalanceReport,
  getFundBalanceReportSuccess,
  getFundBalanceReportFailure,

  getFundBalanceTransaction,
  getFundBalanceTransactionSuccess,
  getFundBalanceTransactionFailure,
} = fundBalanceSlice.actions;

export default fundBalanceSlice.reducer;
