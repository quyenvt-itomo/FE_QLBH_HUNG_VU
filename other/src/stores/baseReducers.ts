import { PayloadAction } from "@reduxjs/toolkit";
import {
  ApiResponse,
  FilterItem,
  MenuProps,
  PaginationProps,
  PayloadWithSubId,
  SummaryData,
} from "../models/base/api";
import { MessageToastModel } from "../models/base/interface";
import { TypeMessage } from "../constants/enum";
import z from "zod";

// ===== Types =====

export interface BaseError {
  key?: string;
  message: string;
  index_1?: number;
  index_2?: number;
  value?: number;
  elementKey?: string;
}

export interface BaseFailurePayload {
  message: string;
  errors: BaseError[];
}

export interface BaseState<T = any, TNew = { id: string }> {
  data: T[];
  dataById: T | null;
  newData: T | null;
  deletedId: string | null;
  loading: boolean;
  message: MessageToastModel;
  errors: BaseError[] | null;
  pagination?: PaginationProps | null;
  summary?: SummaryData | null;
  filterItems: FilterItem[];
  menu: MenuProps[];
  isCheckAdd?: boolean;
  isCheckUpdate?: boolean;
  isCheckDelete?: boolean;
}

// ===== Initial State Factory =====

export const createBaseInitialState = <T>(): BaseState<T> => ({
  data: [],
  dataById: null,
  newData: null,
  deletedId: null,
  loading: false,
  message: { type: TypeMessage.none },
  errors: null,
  pagination: null,
  summary: null,
  filterItems: [],
  menu: [],
  isCheckAdd: false,
  isCheckUpdate: false,
  isCheckDelete: false,
});

function mapCategoriesToFilterItem(data: any[]): FilterItem[] {
  const result: FilterItem[] = [];

  data.forEach((parent) => {
    // push cha vào
    result.push({
      id: parent.id,
      name: parent.name,
      type: parent.type,
      value: parent.total || 0,
      createdAt: parent.createdAt,
      updatedAt: parent.updatedAt,
    });

    // push con vào
    (parent.categories || []).forEach((child: any) => {
      result.push({
        id: child.id,
        name: child.name,
        type: parent.type, // dùng type cha
        value: child.total || 0,
        createdAt: child.createdAt,
        updatedAt: child.updatedAt,
      });
    });
  });

  return result;
}

export const SummaryDataModelSchema = z.any().transform(
  (dto): SummaryData => ({
    ...dto,
    totalProductAmount: Number(dto.totalSubtotal),
    totalProductDiscountAmount: Number(dto.totalProductDiscountAmount),
    totalDiscountAmount: Number(dto.totalDiscountAmount),
    totalTaxAmount: Number(dto.totalTaxAmount),
    totalOrderAmount: Number(dto.totalOrderAmount),
    totalPaidAmount: Number(dto.totalPaidAmount),
    totalOutstandingAmount: Number(dto.totalOutstandingAmount),
  }),
);

// ===== Reducers Factory =====

export function createBaseReducers<TData, TQuery, TResponse extends ApiResponse>(messages?: {
  ADD: string;
  UPDATE: string;
  DELETE: string;
}) {
  return {
    clearMessage: (state: BaseState) => {
      state.message = { type: TypeMessage.none };
    },

    reset: (state: BaseState) => {
      state.isCheckAdd = false;
      state.isCheckUpdate = false;
      state.isCheckDelete = false;
    },

    resetItem: (state: BaseState) => {
      state.dataById = null;
    },

    resetNewData: (state: BaseState) => {
      state.newData = null;
    },

    resetDeletedId: (state: BaseState) => {
      state.deletedId = null;
    },

    resetErrors: (state: BaseState) => {
      state.errors = null;
    },

    resetData: (state: BaseState) => {
      state.data = [];
    },

    addItem: (state: BaseState, action: PayloadAction<Partial<TData>>) => {
      state.loading = true;
    },
    addItemSuccess: (state: BaseState, action: PayloadAction<TResponse>) => {
      state.loading = false;
      state.newData = action.payload.data;
      state.message = { type: TypeMessage.success, message: messages?.ADD };
      state.isCheckAdd = true;
    },
    addItemFailure: (state: BaseState, action: PayloadAction<BaseFailurePayload>) => {
      state.loading = false;
      state.errors = action.payload.errors;
      state.message = {
        type: TypeMessage.error,
        message: action.payload.message,
      };
      state.isCheckAdd = false;
    },

    getAll: (state: BaseState, action: PayloadAction<TQuery>) => {
      state.loading = true;
    },
    getAllSuccess: (state: BaseState, action: PayloadAction<TResponse>) => {
      state.loading = false;
      state.data = action.payload.data;
      state.pagination = action.payload.pagination;
      state.summary = action.payload.summary
        ? SummaryDataModelSchema.parse(action.payload.summary)
        : null;
      state.menu = action.payload.menu || [];
      state.filterItems = action.payload.filterItems || [];
    },
    getAllFailure: (state: BaseState, action: PayloadAction<BaseFailurePayload>) => {
      state.loading = false;
      state.errors = action.payload.errors;
      state.message = {
        type: TypeMessage.error,
        message: action.payload.message,
      };
    },

    getItem: (state: BaseState, action: PayloadAction<string | PayloadWithSubId>) => {
      state.loading = true;
    },
    getItemSuccess: (state: BaseState, action: PayloadAction<TResponse>) => {
      state.loading = false;
      state.dataById = action.payload.data;
    },
    getItemFailure: (state: BaseState, action: PayloadAction<BaseFailurePayload>) => {
      state.loading = false;
      state.errors = action.payload.errors;
      state.message = {
        type: TypeMessage.error,
        message: action.payload.message,
      };
    },

    updateItem: (state: BaseState, action: PayloadAction<Partial<TData>>) => {
      state.loading = true;
    },
    updateItemSuccess: (state: BaseState, action: PayloadAction<TResponse>) => {
      state.loading = false;
      state.newData = action.payload.data;
      state.message = { type: TypeMessage.success, message: messages?.UPDATE };
      state.isCheckUpdate = true;
    },
    updateItemFailure: (state: BaseState, action: PayloadAction<BaseFailurePayload>) => {
      state.loading = false;
      state.errors = action.payload.errors;
      state.message = {
        type: TypeMessage.error,
        message: action.payload.message,
      };
    },

    deleteItem: (state: BaseState, action: PayloadAction<string | PayloadWithSubId>) => {
      state.loading = true;
    },
    deleteItemSuccess: (state: BaseState, action: PayloadAction<TResponse>) => {
      state.loading = false;
      state.deletedId = action.payload.data;
      state.message = { type: TypeMessage.success, message: messages?.DELETE };
      state.isCheckDelete = true;
    },
    deleteItemFailure: (state: BaseState, action: PayloadAction<BaseFailurePayload>) => {
      state.loading = false;
      state.errors = action.payload.errors;
      state.message = {
        type: TypeMessage.error,
        message: action.payload.message,
      };
    },
  };
}
