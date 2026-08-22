import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BaseFailurePayload } from "../baseReducers";
import { ApiResponse, PaginationProps, SummaryData } from "../../models/base/api";
import {
  ILoyaltyPointReport,
  ILoyaltyPointTransaction,
  LoyaltyPointQuery,
} from "../../models/loyaltyPoint";

export interface LoyaltyPointState {
  loyaltyPointReports: ILoyaltyPointReport[];
  pagination?: PaginationProps;
  loading: boolean;
  summary?: SummaryData | null;

  loyaltyPointTransactions: ILoyaltyPointTransaction[];
  transactionSummary?: SummaryData | null;
}

const initialState: LoyaltyPointState = {
  loyaltyPointReports: [],
  pagination: {
    currentPage: 1,
    size: 10,
    totalRecords: 0,
    totalPages: 0,
  },
  loading: false,
  summary: undefined,

  loyaltyPointTransactions: [],
  transactionSummary: undefined,
};

const loyaltyPointSlice = createSlice({
  name: "loyaltyPoint",
  initialState,
  reducers: {
    getLoyaltyPointReport: (state, action: PayloadAction<LoyaltyPointQuery>) => {
      state.loading = true;
    },
    getLoyaltyPointReportSuccess: (
      state,
      action: PayloadAction<ApiResponse<ILoyaltyPointReport[]>>,
    ) => {
      state.loading = false;
      state.loyaltyPointReports = action.payload.data || [];
      state.pagination = action.payload.pagination;
      state.summary = action.payload.summary;
    },
    getLoyaltyPointReportFailure: (state, action: PayloadAction<BaseFailurePayload>) => {
      state.loading = false;
    },

    getLoyaltyPointTransaction: (state, action: PayloadAction<LoyaltyPointQuery>) => {
      state.loading = true;
    },
    getLoyaltyPointTransactionSuccess: (
      state,
      action: PayloadAction<ApiResponse<ILoyaltyPointTransaction[]>>,
    ) => {
      state.loading = false;
      state.loyaltyPointTransactions = action.payload.data || [];
      state.transactionSummary = action.payload.summary;
    },
    getLoyaltyPointTransactionFailure: (state, action: PayloadAction<BaseFailurePayload>) => {
      state.loading = false;
    },
  },
});

export const {
  getLoyaltyPointReport,
  getLoyaltyPointReportSuccess,
  getLoyaltyPointReportFailure,

  getLoyaltyPointTransaction,
  getLoyaltyPointTransactionSuccess,
  getLoyaltyPointTransactionFailure,
} = loyaltyPointSlice.actions;

export default loyaltyPointSlice.reducer;
