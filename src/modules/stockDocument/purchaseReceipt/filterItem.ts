import { FilterKey, RangerItem, SortItem } from "@/shared/interfaces/common";
import { stockDocumentStatusOptionsWithoutExported } from "../stockDocument.model";

export const sortItems: SortItem[] = [
  { label: "Ngày", value: "timeAt", ascLabel: "Từ cũ đến mới", descLabel: "Từ mới đến cũ" },
  { label: "Số phiếu", value: "code", ascLabel: "Từ A đến Z", descLabel: "Từ Z đến A" },
];
export const rangerItems: RangerItem[] = [];
export const filterUses: FilterKey[] = ["employeeIds", "supplierIds", "creatorIds"];

export const statusItems = [
  { label: "Tất cả", value: "all" },
  ...stockDocumentStatusOptionsWithoutExported,
];
