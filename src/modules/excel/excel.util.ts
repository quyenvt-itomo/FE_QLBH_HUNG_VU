import { Module } from "@/shared/constants/permission";
import { ExcelEntityType } from "./excel.enum";

export function mapEntityTypeToModule(entityType: ExcelEntityType): Module | string {
  const map: Record<ExcelEntityType, Module | string> = {
    [ExcelEntityType.PARTNER]: "partner",
    [ExcelEntityType.EMPLOYEE]: "employee",
    [ExcelEntityType.USER]: "user",
    [ExcelEntityType.PRODUCT]: "product",
    [ExcelEntityType.SERVICE]: "service",
    [ExcelEntityType.JOB_POSITION]: "jobPosition",
    [ExcelEntityType.WAREHOUSE]: "warehouse",
    [ExcelEntityType.PRICE_HISTORY]: "priceHistory",
  };
  return map[entityType];
}

export function checkShowButton(entityType: ExcelEntityType, availableModules?: Module[]): boolean {
  if (!availableModules || availableModules.length === 0) return false;
  const module = mapEntityTypeToModule(entityType);
  return availableModules.includes(module as Module);
}

export const entityTypeLabel: Record<ExcelEntityType, string> = {
  [ExcelEntityType.PARTNER]: "Đối tác",
  [ExcelEntityType.EMPLOYEE]: "Nhân viên",
  [ExcelEntityType.USER]: "Người dùng",
  [ExcelEntityType.PRODUCT]: "Hàng hóa",
  [ExcelEntityType.SERVICE]: "Dịch vụ",
  [ExcelEntityType.JOB_POSITION]: "Vị trí công việc",
  [ExcelEntityType.WAREHOUSE]: "Kho",
  [ExcelEntityType.PRICE_HISTORY]: "Lịch sử giá",
};
