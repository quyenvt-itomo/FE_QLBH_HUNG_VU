export const EXCEL_PERMISSION_MODULES = ["product"] as const;

export type ExcelModule = (typeof EXCEL_PERMISSION_MODULES)[number];

export interface ExcelRolePermissions {
  importExcel: ExcelModule[];
  exportExcel: ExcelModule[];
}
