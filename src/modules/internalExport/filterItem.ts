import { FilterKey, RangerItem, SortItem } from "@/shared/interfaces/common";

export const sortItems: SortItem[] = [
  { label: "Ngày xuất", value: "occurredAt", ascLabel: "Cũ nhất", descLabel: "Mới nhất" },
  { label: "Số phiếu", value: "code", ascLabel: "A → Z", descLabel: "Z → A" },
];

export const filterUses: FilterKey[] = ["productIds", "creatorIds", "storeIds"];
export const rangerItems: RangerItem[] = [
  { label: "Ngày xuất", key: "occurredAt", type: "date" },
];
