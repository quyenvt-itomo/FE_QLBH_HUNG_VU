import { FilterKey, RangerItem, SortItem } from "@/shared/interfaces/common";

export const sortItems: SortItem[] = [
  { label: "Ngày", value: "timeAt", ascLabel: "Từ cũ đến mới", descLabel: "Từ mới đến cũ" },
  { label: "Mã", value: "code", ascLabel: "Từ A đến Z", descLabel: "Từ Z đến A" },
];
export const rangerItems: RangerItem[] = [];
export const filterUses: FilterKey[] = ["employeeIds", "customerIds", "creatorIds"];
