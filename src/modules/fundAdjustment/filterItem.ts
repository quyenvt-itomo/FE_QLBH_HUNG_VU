import { FilterKey, RangerItem, SortItem } from "@/shared/interfaces/common";

export const sortItems: SortItem[] = [
  { label: "Ngày điều chỉnh", value: "occurredAt", ascLabel: "Cũ nhất", descLabel: "Mới nhất" },
  { label: "Số phiếu", value: "code", ascLabel: "A → Z", descLabel: "Z → A" },
  { label: "Chênh lệch", value: "deltaAmount", ascLabel: "Thấp nhất", descLabel: "Cao nhất" },
];
export const rangerItems: RangerItem[] = [{ label: "Chênh lệch", key: "deltaAmount" }];
export const filterUses: FilterKey[] = ["fundIds", "creatorIds"];
