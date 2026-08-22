import { FilterKey, RangerItem, SortItem } from "@/shared/interfaces/common";

export const sortItems: SortItem[] = [
  { label: "Ngày đặt", value: "orderedAt", ascLabel: "Từ cũ đến mới", descLabel: "Từ mới đến cũ" },
  { label: "Số đơn", value: "code", ascLabel: "A → Z", descLabel: "Z → A" },
  { label: "Tổng tiền", value: "totalAmount", ascLabel: "Thấp nhất", descLabel: "Cao nhất" },
];

export const rangerItems: RangerItem[] = [
  { label: "Tổng tiền", key: "totalAmount" },
  { label: "Đã thanh toán", key: "totalPaidAmount" },
  { label: "Còn nợ", key: "totalOutstandingAmount" },
];

export const filterUses: FilterKey[] = ["supplierIds", "creatorIds"];
