import { ExcelEntityType } from "./excel.enum";
import { ExcelModule } from "./excel.permission.model";

export function mapEntityTypeToModule(
  entityType: ExcelEntityType,
): ExcelModule | undefined {
  const map: Partial<Record<ExcelEntityType, ExcelModule>> = {
    [ExcelEntityType.PRODUCT]: "product",
    [ExcelEntityType.PARTNER]: "partner",
  };
  return map[entityType];
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
