import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  ExcelTemplateData,
  ExcelTemplateQuery,
  ImportExcelData,
  ImportExcelResult,
  ImportJobResponse,
  ImportProgressData,
  ImportJobStatus,
  ExportOptions,
  ExportExcelResult,
} from "../../models/base/excel";
import { BaseError, BaseFailurePayload } from "../baseReducers";
import { MessageToastModel } from "../../models/base/interface";
import { TypeMessage } from "../../constants/enum";

interface ExcelState {
  loading: boolean;
  uploadingFile: boolean; // Loading cho upload file
  importingData: boolean; // Loading cho import data
  message: MessageToastModel;
  errors: BaseError[] | null;
  template: ExcelTemplateData | null;
  importResult: ImportExcelResult | null;
  exportResult: ExportExcelResult | null;
  isCheckAdd: boolean;
  // Job-based import
  currentJobId: string | null;
  importProgress: ImportProgressData | null;
}

const initialState: ExcelState = {
  loading: false,
  uploadingFile: false,
  importingData: false,
  message: {
    type: TypeMessage.none,
  },
  errors: null,
  template: null,
  importResult: null,
  exportResult: null,
  isCheckAdd: false,
  currentJobId: null,
  importProgress: null,
};

const excelSlice = createSlice({
  name: "excel",
  initialState,
  reducers: {
    clearMessage: (state: ExcelState) => {
      state.message = { type: TypeMessage.none };
    },
    // TODO: Get template
    getTemplate: (state, action: PayloadAction<ExcelTemplateQuery>) => {},
    getTemplateSuccess: (state, action: PayloadAction<{ data: ExcelTemplateData }>) => {
      state.template = action.payload.data;
    },
    getTemplateFailure: (state, action: PayloadAction<BaseFailurePayload>) => {
      state.errors = action.payload.errors;
      state.message = {
        type: TypeMessage.error,
        message: action.payload.message,
      };
    },

    // TODO: Import (Job-based)
    importExcel: (state, _action: PayloadAction<ImportExcelData>) => {
      state.importingData = true;
      state.loading = true;
      state.importProgress = null;
    },
    importExcelJobStarted: (state, action: PayloadAction<ImportJobResponse>) => {
      state.currentJobId = action.payload.data.jobId;
      state.message = {
        type: TypeMessage.info,
        message: "Đã nhận yêu cầu import. Bạn sẽ nhận thông báo khi hoàn tất.",
      };
    },
    importExcelProgress: (state, action: PayloadAction<ImportProgressData>) => {
      state.importProgress = action.payload;

      // Khi completed, cập nhật result
      if (action.payload.status === ImportJobStatus.COMPLETED) {
        state.importingData = false;
        state.loading = false;
        state.importResult = {
          totalRows: action.payload.totalRows || 0,
          successRows: action.payload.successRows || 0,
          errorRows: action.payload.errorRows || 0,
          skippedRows: action.payload.skippedRows || 0,
          errors: action.payload.errors || [],
          errorFileUrl: action.payload.errorFileUrl,
        };
        state.isCheckAdd = true;
        state.message = {
          type: TypeMessage.success,
          message: "Nhập dữ liệu thành công",
        };
      } else if (action.payload.status === ImportJobStatus.FAILED) {
        state.importingData = false;
        state.loading = false;
        state.message = {
          type: TypeMessage.error,
          message: "Import thất bại",
        };
        state.isCheckAdd = false;
      }
    },
    importExcelFailure: (state, action: PayloadAction<BaseFailurePayload>) => {
      state.importingData = false;
      state.loading = false;
      state.errors = action.payload.errors;
      state.message = {
        type: TypeMessage.error,
        message: action.payload.message,
      };
      state.importResult = null;
      state.isCheckAdd = false;
      state.currentJobId = null;
      state.importProgress = null;
    },

    // TODO: Delete
    exportExcel: (state, action: PayloadAction<ExportOptions>) => {
      state.loading = true;
    },
    exportExcelSuccess: (state, action: PayloadAction<{ data: ExportExcelResult }>) => {
      state.loading = false;
      state.message = {
        type: TypeMessage.success,
        message: "Hoàn tất",
      };
      state.exportResult = action.payload.data;
    },
    exportExcelFailure: (state, action: PayloadAction<BaseFailurePayload>) => {
      state.loading = false;
      state.errors = action.payload.errors;
      state.message = {
        type: TypeMessage.error,
        message: action.payload.message,
      };
      state.exportResult = null;
    },

    // TODO: Reset
    resetExcel: (state) => {
      return { ...initialState };
    },

    reset: (state: ExcelState) => {
      state.isCheckAdd = false;
    },

    resetErrors: (state: ExcelState) => {
      state.errors = null;
    },
  },
});

export const {
  clearMessage,

  getTemplate,
  getTemplateFailure,
  getTemplateSuccess,

  importExcel,
  importExcelJobStarted,
  importExcelProgress,
  importExcelFailure,

  exportExcel,
  exportExcelFailure,
  exportExcelSuccess,

  reset,
  resetErrors,
  resetExcel,
} = excelSlice.actions;

export default excelSlice.reducer;
