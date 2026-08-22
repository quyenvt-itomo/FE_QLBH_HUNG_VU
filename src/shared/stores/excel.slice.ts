import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ExcelEntityType, ImportJobStatus, ExportJobStatus } from "@/modules/excel/excel.enum";
import type {
  ExportJobResponse,
  ExportProgressData,
  ImportJobResponse,
  ImportProgressData,
  ImportExcelResult,
} from "@/modules/excel/excel.model";

// ============================================================
// Task types
// ============================================================

export interface ImportTask {
  jobId: string;
  status: ImportJobStatus;
  progress: number;
  message?: string;
  entityType: ExcelEntityType;
  result?: ImportExcelResult;
  createdAt: string;
}

export interface ExportTask {
  jobId: string;
  status: ExportJobStatus;
  progress: number;
  message?: string;
  entityType: ExcelEntityType;
  filename?: string;
  resultUrl?: string;
  createdAt: string;
}

// ============================================================
// State — chỉ giữ những gì ExcelTaskPanel cần
// ============================================================

interface ExcelState {
  importTasks: ImportTask[];
  exportTasks: ExportTask[];

  /** entityType → counter; mỗi lần import hoàn tất +1 → page watch để reload */
  importCompleted: Record<string, number>;
}

const initialState: ExcelState = {
  importTasks: [],
  exportTasks: [],
  importCompleted: {},
};

// ============================================================
// Slice
// ============================================================

const excelSlice = createSlice({
  name: "Excel",
  initialState,
  reducers: {
    importExcelJobStarted(
      state,
      action: PayloadAction<{ response: ImportJobResponse; entityType: ExcelEntityType }>,
    ) {
      const { response, entityType } = action.payload;
      state.importTasks.unshift({
        jobId: response.jobId,
        status: ImportJobStatus.PENDING,
        progress: 0,
        message: "Đang chờ xử lý import",
        entityType,
        createdAt: new Date().toISOString(),
      });
    },

    importExcelProgress(state, action: PayloadAction<ImportProgressData>) {
      const idx = state.importTasks.findIndex((t) => t.jobId === action.payload.jobId);
      if (idx < 0) return;

      const task = state.importTasks[idx];
      task.status = action.payload.status;
      task.progress = Math.max(0, Math.min(100, action.payload.progress ?? 0));

      if (
        action.payload.status === ImportJobStatus.COMPLETED ||
        action.payload.status === ImportJobStatus.FAILED
      ) {
        task.result = {
          totalRows: action.payload.totalRows ?? 0,
          successRows: action.payload.successRows ?? 0,
          errorRows: action.payload.errorRows ?? 0,
          skippedRows: action.payload.skippedRows ?? 0,
          errors: action.payload.errors ?? [],
          data: [],
          errorFileUrl: action.payload.errorFileUrl,
        };

        if (action.payload.status === ImportJobStatus.COMPLETED) {
          task.message = `Hoàn tất: ${task.result.successRows}/${task.result.totalRows} dòng`;
          const key = task.entityType as string;
          state.importCompleted[key] = (state.importCompleted[key] || 0) + 1;
        } else {
          task.message = `Thất bại: ${task.result.errorRows} lỗi`;
        }
      } else if (action.payload.status === ImportJobStatus.PROCESSING) {
        task.message = `Đang xử lý: ${action.payload.processedRows ?? 0}/${action.payload.totalRows ?? "?"} dòng`;
      }
    },

    removeImportTask(state, action: PayloadAction<string>) {
      state.importTasks = state.importTasks.filter((t) => t.jobId !== action.payload);
    },

    exportExcelJobStarted(
      state,
      action: PayloadAction<{
        response: ExportJobResponse;
        entityType: ExcelEntityType;
        filename?: string;
      }>,
    ) {
      const { response, entityType, filename } = action.payload;
      const existing = state.exportTasks.findIndex((t) => t.jobId === response.jobId);
      const task: ExportTask = {
        jobId: response.jobId,
        status: ExportJobStatus.PENDING,
        progress: 0,
        message: "Đang chờ xử lý export",
        entityType,
        filename,
        createdAt: new Date().toISOString(),
      };
      if (existing >= 0) state.exportTasks[existing] = task;
      else state.exportTasks.unshift(task);
    },

    exportExcelProgress(state, action: PayloadAction<ExportProgressData>) {
      const idx = state.exportTasks.findIndex((t) => t.jobId === action.payload.jobId);
      if (idx < 0) return;

      const task = state.exportTasks[idx];
      task.status = action.payload.status;
      task.progress = Math.max(0, Math.min(100, action.payload.progress ?? 0));
      task.message = action.payload.message ?? task.message;

      if (action.payload.result?.url) {
        task.resultUrl = action.payload.result.url;
        task.filename = action.payload.result.filename ?? task.filename;
      }
      if (action.payload.fileName) task.filename = action.payload.fileName;
    },

    removeExportTask(state, action: PayloadAction<string>) {
      state.exportTasks = state.exportTasks.filter((t) => t.jobId !== action.payload);
    },
  },
});

export const {
  importExcelJobStarted,
  importExcelProgress,
  removeImportTask,
  exportExcelJobStarted,
  exportExcelProgress,
  removeExportTask,
} = excelSlice.actions;

export default excelSlice.reducer;
