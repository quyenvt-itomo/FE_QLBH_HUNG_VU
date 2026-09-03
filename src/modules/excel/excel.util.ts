import { ExcelEntityType } from "./excel.enum";
import { Module } from "@/shared/constants/permission";

export const excelFileNamePrefixes: Partial<
  Record<ExcelEntityType, { template: string; export: string }>
> = {
  [ExcelEntityType.PRODUCT]: {
    template: "bieu_mau_hang_hoa",
    export: "danh_sach_hang_hoa",
  },
  [ExcelEntityType.CUSTOMER]: {
    template: "bieu_mau_khach_hang",
    export: "danh_sach_khach_hang",
  },
  [ExcelEntityType.SUPPLIER]: {
    template: "bieu_mau_nha_cung_cap",
    export: "danh_sach_nha_cung_cap",
  },
};

export function getExcelFileNamePrefix(
  entityType: ExcelEntityType | string,
  kind: "template" | "export",
): string {
  return (
    excelFileNamePrefixes[entityType as ExcelEntityType]?.[kind] ||
    (kind === "template" ? "bieu_mau_excel" : "danh_sach_excel")
  );
}

export function mapEntityTypeToModule(
  entityType: ExcelEntityType,
): Module | undefined {
  const map: Partial<Record<ExcelEntityType, Module>> = {
    [ExcelEntityType.PRODUCT]: "product",
    [ExcelEntityType.CUSTOMER]: "customer",
    [ExcelEntityType.SUPPLIER]: "supplier",
  };
  return map[entityType];
}

export const entityTypeLabel: Record<ExcelEntityType, string> = {
  [ExcelEntityType.CUSTOMER]: "Khách hàng",
  [ExcelEntityType.SUPPLIER]: "Nhà cung cấp",
  [ExcelEntityType.EMPLOYEE]: "Nhân viên",
  [ExcelEntityType.USER]: "Người dùng",
  [ExcelEntityType.PRODUCT]: "Hàng hóa",
  [ExcelEntityType.SERVICE]: "Dịch vụ",
  [ExcelEntityType.JOB_POSITION]: "Vị trí công việc",
  [ExcelEntityType.WAREHOUSE]: "Kho",
  [ExcelEntityType.PRICE_HISTORY]: "Lịch sử giá",
};
