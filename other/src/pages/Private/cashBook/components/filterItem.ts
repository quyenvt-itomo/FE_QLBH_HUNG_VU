import { FilterKey, RangerItem, SortItem } from "../../../../models/base/interface";

export const sortItems: SortItem[] = [
  {
    label: "Ngày",
    value: "occurredAt",
    ascLabel: "Cũ nhất",
    descLabel: "Mới nhất",
  },

  {
    label: "Số phiếu",
    value: "code",
    ascLabel: "A → Z",
    descLabel: "Z → A",
  },

  {
    label: "Số tiền",
    value: "amount",
    ascLabel: "Thấp nhất",
    descLabel: "Cao nhất",
  },

  {
    label: "Loại",
    value: "type",
    ascLabel: "Ưu tiên thu tiền",
    descLabel: "Ưu tiên chi tiền",
  },
];

export const rangerItems: RangerItem[] = [
  {
    label: "Số tiền",
    key: "amount",
  },
];

export const filterUses: FilterKey[] = ["employeeIds", "fundIds", "partnerIds"];

export const searchItems = [
  {
    key: "code",
    label: "Số phiếu",
  },
];
