import { ExcelEntityType } from "./excel.enum";
import { Module } from "@/shared/constants/permission";

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
