import { FilterKey, RangerItem, SortItem } from "../../../../../models/base/interface";

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
    label: "Số dư hệ thống",
    value: "countedAmount",
    ascLabel: "Thấp nhất",
    descLabel: "Cao nhất",
  },

  {
    label: "Số dư thực tế",
    value: "expectedAmount",
    ascLabel: "Thấp nhất",
    descLabel: "Cao nhất",
  },

  {
    label: "Chênh lệch",
    value: "deltaAmount",
    ascLabel: "Thấp nhất",
    descLabel: "Cao nhất",
  },

  {
    label: "Loại",
    value: "direction",
    ascLabel: "Ưu tiên tăng",
    descLabel: "Ưu tiên giảm",
  },
];

export const rangerItems: RangerItem[] = [
  {
    label: "Số dư hệ thống",
    key: "countedAmount",
  },

  {
    label: "Số dư thực tế",
    key: "expectedAmount",
  },

  {
    label: "Chênh lệch",
    key: "deltaAmount",
  },
];

export const filterUses: FilterKey[] = ["fundIds"];

export const searchItems = [
  {
    key: "code",
    label: "Số phiếu",
  },
];
