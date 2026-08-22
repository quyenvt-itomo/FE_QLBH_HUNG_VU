import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BaseFailurePayload } from "../baseReducers";
import { ApiResponse, PaginationProps, SummaryData } from "../../models/base/api";
import { IVatTransaction, VatQuery } from "../../models/store/vat";

export interface VatState {
  vatTransactions: IVatTransaction[];
  pagination?: PaginationProps;
  loading: boolean;
  summary?: SummaryData | null;
}

const initialState: VatState = {
  vatTransactions: [],
  pagination: {
    currentPage: 1,
    size: 10,
    totalRecords: 0,
    totalPages: 0,
  },
  loading: false,
  summary: undefined,
};

const vatSlice = createSlice({
  name: "vat",
  initialState,
  reducers: {
    getVatTransaction: (state, action: PayloadAction<VatQuery>) => {
      state.loading = true;
    },
    getVatTransactionSuccess: (state, action: PayloadAction<ApiResponse<IVatTransaction[]>>) => {
      state.loading = false;
      state.vatTransactions = action.payload.data || [];
      state.summary = action.payload.summary;
    },
    getVatTransactionFailure: (state, action: PayloadAction<BaseFailurePayload>) => {
      state.loading = false;
    },
  },
});

export const { getVatTransaction, getVatTransactionSuccess, getVatTransactionFailure } =
  vatSlice.actions;

export default vatSlice.reducer;
