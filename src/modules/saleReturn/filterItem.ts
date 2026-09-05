import { FilterKey, RangerItem, SortItem } from "@/shared/interfaces/common";

export const sortItems: SortItem[] = [
  { label: "Ngày trả hàng", value: "orderAt", ascLabel: "Cũ nhất", descLabel: "Mới nhất" },
  { label: "Mã phiếu", value: "code", ascLabel: "A → Z", descLabel: "Z → A" },
  { label: "Tổng tiền", value: "totalAmount", ascLabel: "Thấp nhất", descLabel: "Cao nhất" },
];

export const rangerItems: RangerItem[] = [
  { label: "Ngày trả hàng", key: "orderAt", type: "date" },
  { label: "Ngày hoàn thành", key: "occurredAt", type: "date" },
  { label: "Tiền hàng", key: "grossAmount" },
  { label: "Giảm giá", key: "discountAmount" },
  { label: "Tổng tiền", key: "totalAmount" },
];

export const filterUses: FilterKey[] = [
  "customerIds",
  "creatorIds",
  "completerIds",
  "shipperIds",
  "productIds",
  "fundIds",
];
