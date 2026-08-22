import { FilterKey, RangerItem, SearchItem, SortItem } from "../../../../models/base/interface";

export const sortItems: SortItem[] = [
  {
    label: "Ngày tạo",
    value: "createdAt",
    ascLabel: "Cũ nhất",
    descLabel: "Mới nhất",
  },
  {
    label: "Mã khách hàng",
    value: "code",
    ascLabel: "A → Z",
    descLabel: "Z → A",
  },

  {
    label: "Tên khách hàng",
    value: "name",
    ascLabel: "A → Z",
    descLabel: "Z → A",
  },

  {
    label: "Tổng doanh thu",
    value: "totalRevenue",
    ascLabel: "Thấp nhất",
    descLabel: "Cao nhất",
  },

  {
    label: "Điểm tích lũy",
    value: "loyaltyPoints",
    ascLabel: "Thấp nhất",
    descLabel: "Cao nhất",
  },
];

export const rangerItems: RangerItem[] = [
  {
    label: "Tổng doanh thu",
    key: "totalRevenue",
  },
  {
    label: "Điểm tích lũy",
    key: "loyaltyPoints",
  },
];

export const filterUses: FilterKey[] = ["customerGroupId"];
