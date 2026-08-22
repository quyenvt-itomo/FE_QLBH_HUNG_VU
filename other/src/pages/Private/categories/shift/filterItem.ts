import { FilterKey, RangerItem, SortItem } from "../../../../models/base/interface";

export const sortItems: SortItem[] = [
  {
    label: "Ngày",
    value: "startAt",
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
    label: "Tổng tiền mặt đầu ca",
    value: "openingCash",
    ascLabel: "Tăng dần",
    descLabel: "Giảm dần",
  },

  {
    label: "Tổng tiền mặt cuối ca",
    value: "closingCash",
    ascLabel: "Tăng dần",
    descLabel: "Giảm dần",
  },

  {
    label: "Chênh lệch tiền mặt",
    value: "difference",
    ascLabel: "Tăng dần",
    descLabel: "Giảm dần",
  },
];

export const rangerItems: RangerItem[] = [
  {
    label: "Tổng tiền mặt đầu ca",
    key: "openingCash",
  },

  {
    label: "Tổng tiền mặt cuối ca",
    key: "closingCash",
  },

  {
    label: "Chênh lệch tiền mặt",
    key: "difference",
  },
];

export const filterUses: FilterKey[] = ["userIds"];
