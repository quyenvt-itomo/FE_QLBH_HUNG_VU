import { FilterKey, RangerItem, SortItem } from "@/shared/interfaces/common";

export const sortItems: SortItem[] = [
  { label: "Ngày bán", value: "orderAt", ascLabel: "Cũ nhất", descLabel: "Mới nhất" },
  { label: "Mã đơn", value: "code", ascLabel: "A → Z", descLabel: "Z → A" },
  { label: "Tổng đơn", value: "totalAmount", ascLabel: "Thấp nhất", descLabel: "Cao nhất" },
];

export const rangerItems: RangerItem[] = [
  { label: "Ngày bán", key: "orderAt", type: "date" },
  { label: "Ngày hoàn thành", key: "occurredAt", type: "date" },
  { label: "Tiền hàng", key: "grossAmount" },
  { label: "Giảm giá", key: "discountAmount" },
  { label: "Tổng đơn", key: "totalAmount" },
];

export const filterUses: FilterKey[] = [
  "customerIds",
  "creatorIds",
  "completerIds",
  "shipperIds",
  "productIds",
  "fundIds",
];
