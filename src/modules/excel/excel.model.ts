import {
  ExcelEntityType,
  ImportDuplicateHandling,
  ImportErrorHandling,
  ImportJobStatus,
  ExportJobStatus,
} from "./excel.enum";

// ============================================================
// Đồng bộ với BE: excel.types.ts
// ============================================================

export interface ExportColumnConfig {
  field: string;
  header: string;
  width?: number;
  required?: boolean;
  type?: "string" | "number" | "boolean" | "date";
  /** Nhóm cột vào sheet phụ (dành cho entity có nhiều sheet) */
  sheet?: string;
  numberFormat?: string;
  options?: string[];
}

export interface ExportOptions {
  entityType: ExcelEntityType;
  branchId?: string;
  columns?: ExportColumnConfig[];
  extraUnitColumns?: ExportColumnConfig[];
  businessStoreColumns?: ExportColumnConfig[];
  sheetColumns?: Record<string, ExportColumnConfig[]>;
  filters?: Record<string, any>;
  filename?: string;
}

export interface ExportExcelResult {
  url: string;
  filename: string;
  expiresAt: Date;
}

export interface ImportOptions {
  entityType: ExcelEntityType;
  fileId: string;
  branchId?: string;
  errorHandling: ImportErrorHandling;
  duplicateHandling: ImportDuplicateHandling;
  uniqueFields?: string[];
}

export interface ImportError {
  row: number;
  message: string;
  data?: Record<string, any>;
}

export interface ImportExcelResult {
  totalRows: number;
  successRows: number;
  errorRows: number;
  skippedRows: number;
  errors: ImportError[];
  data: any[];
  errorFileUrl?: string;
}

export interface ImportJobProgress extends ImportExcelResult {
  jobId: string;
  status: "pending" | "processing" | "completed" | "failed";
  progress: number;
  layers: string[];
}

export interface ImportJobResponse {
  jobId: string;
}

export interface TemplateResult {
  url: string;
  filename: string;
  entityType: ExcelEntityType;
}

export interface ImportProgressData {
  jobId: string;
  status: ImportJobStatus;
  progress: number;
  totalRows?: number;
  processedRows?: number;
  successRows?: number;
  errorRows?: number;
  skippedRows?: number;
  errors?: ImportError[];
  data?: any[];
  errorFileUrl?: string;
}

// ============================================================
// Export job types
// ============================================================

export interface ExportJobResponse {
  jobId: string;
}

export interface ExportProgressData {
  jobId: string;
  status: ExportJobStatus;
  progress: number;
  message?: string;
  startedAt?: string;
  completedAt?: string;
  fileName?: string;
  result?: {
    url: string;
    filename: string;
  };
}
