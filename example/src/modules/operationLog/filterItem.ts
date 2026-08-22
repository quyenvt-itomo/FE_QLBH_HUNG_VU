import { FilterKey, RangerItem, SortItem } from "@/shared/interfaces/common";

export const sortItems: SortItem[] = [
  { label: "Thời gian", value: "createdAt", ascLabel: "Từ cũ đến mới", descLabel: "Từ mới đến cũ" },
  { label: "Hành động", value: "action", ascLabel: "A → Z", descLabel: "Z → A" },
  { label: "Module", value: "targetEntity", ascLabel: "A → Z", descLabel: "Z → A" },
];

export const rangerItems: RangerItem[] = [];
export const filterUses: FilterKey[] = [];
