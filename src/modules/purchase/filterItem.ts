import { FilterKey, RangerItem, SortItem } from "@/shared/interfaces/common";

export const sortItems: SortItem[] = [
  { label: "Ngày đặt hàng", value: "orderAt", ascLabel: "Cũ nhất", descLabel: "Mới nhất" },
  { label: "Mã phiếu", value: "code", ascLabel: "A → Z", descLabel: "Z → A" },
  { label: "Tổng đơn", value: "totalAmount", ascLabel: "Thấp nhất", descLabel: "Cao nhất" },
];

export const rangerItems: RangerItem[] = [
  { label: "Ngày đặt hàng", key: "orderAt", type: "date" },
  { label: "Ngày hoàn thành", key: "occurredAt", type: "date" },
  { label: "Tiền hàng", key: "grossAmount" },
  { label: "Giảm giá", key: "discountAmount" },
  { label: "Tổng đơn", key: "totalAmount" },
];

export const filterUses: FilterKey[] = ["supplierIds", "creatorIds", "completerIds"];
