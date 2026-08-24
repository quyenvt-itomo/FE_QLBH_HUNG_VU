import { FilterKey, RangerItem, SortItem } from "@/shared/interfaces/common";

export const sortItems: SortItem[] = [
  { label: "Ngày", value: "timeAt", ascLabel: "Từ cũ đến mới", descLabel: "Từ mới đến cũ" },
  { label: "Mã", value: "code", ascLabel: "Từ A đến Z", descLabel: "Từ Z đến A" },
  { label: "Tổng tiền", value: "totalAmount", ascLabel: "Thấp nhất", descLabel: "Cao nhất" },
];
export const rangerItems: RangerItem[] = [{ label: "Tổng tiền", key: "totalAmount" }];
export const filterUses: FilterKey[] = ["userIds", "customerIds", "creatorIds"];
