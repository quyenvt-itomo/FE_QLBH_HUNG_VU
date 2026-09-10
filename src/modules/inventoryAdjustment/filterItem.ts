import { FilterKey, RangerItem, SortItem } from "@/shared/interfaces/common";

export const sortItems: SortItem[] = [
  {
    label: "Ngày kiểm kho",
    value: "occurredAt",
    ascLabel: "Cũ nhất",
    descLabel: "Mới nhất",
  },
  { label: "Số phiếu", value: "code", ascLabel: "A → Z", descLabel: "Z → A" },
  {
    label: "Giá trị chênh lệch",
    value: "totalAdjustmentAmount",
    ascLabel: "Thấp nhất",
    descLabel: "Cao nhất",
  },
];

export const rangerItems: RangerItem[] = [
  { label: "Ngày kiểm kho", key: "occurredAt", type: "date" },
  { label: "Số lượng chênh lệch", key: "totalAdjustmentQuantity" },
  { label: "Giá trị chênh lệch", key: "totalAdjustmentAmount" },
];

export const filterUses: FilterKey[] = ["productIds", "creatorIds", "storeIds"];
