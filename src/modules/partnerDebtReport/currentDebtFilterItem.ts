import { FilterKey, SortItem } from "@/shared/interfaces/common";

export const sortItems: SortItem[] = [
  {
    label: "Tổng nợ",
    value: "totalDebt",
    ascLabel: "Ít nhất",
    descLabel: "Nhiều nhất",
  },
  {
    label: "Chưa đến hạn",
    value: "totalNotDue",
    ascLabel: "Ít nhất",
    descLabel: "Nhiều nhất",
  },
  {
    label: "Quá hạn",
    value: "totalOverdue",
    ascLabel: "Ít nhất",
    descLabel: "Nhiều nhất",
  },
  {
    label: "Dưới 30 ngày",
    value: "under30Days",
    ascLabel: "Ít nhất",
    descLabel: "Nhiều nhất",
  },
  {
    label: "30 - 60 ngày",
    value: "under60Days",
    ascLabel: "Ít nhất",
    descLabel: "Nhiều nhất",
  },
  {
    label: "60 - 90 ngày",
    value: "under90Days",
    ascLabel: "Ít nhất",
    descLabel: "Nhiều nhất",
  },
  {
    label: "Trên 90 ngày",
    value: "over90Days",
    ascLabel: "Ít nhất",
    descLabel: "Nhiều nhất",
  },
  {
    label: "Mã đối tác",
    value: "code",
    ascLabel: "A → Z",
    descLabel: "Z → A",
  },
  {
    label: "Tên đối tác",
    value: "name",
    ascLabel: "A → Z",
    descLabel: "Z → A",
  },
];

export const filterUses: FilterKey[] = [];
