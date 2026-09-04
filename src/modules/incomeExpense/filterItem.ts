import { FilterKey, RangerItem, SortItem } from "@/shared/interfaces/common";

export const sortItems: SortItem[] = [
  { label: "Ngày giao dịch", value: "occurredAt", ascLabel: "Cũ nhất", descLabel: "Mới nhất" },
  { label: "Số phiếu", value: "code", ascLabel: "A → Z", descLabel: "Z → A" },
  { label: "Số tiền", value: "amount", ascLabel: "Thấp nhất", descLabel: "Cao nhất" },
  { label: "Loại chứng từ", value: "type", ascLabel: "Phiếu thu trước", descLabel: "Phiếu chi trước" },
];
export const rangerItems: RangerItem[] = [{ label: "Số tiền", key: "amount" }];
export const filterUses: FilterKey[] = [
  "partnerIds",
  "customerIds",
  "supplierIds",
  "customerGroupIds",
  "supplierGroupIds",
  "fundIds",
  "creatorIds",
];
