import { FilterKey, RangerItem, SortItem } from "@/shared/interfaces/common";

export const sortItems: SortItem[] = [
  {
    label: "Tên đối tác",
    value: "name",
    ascLabel: "A → Z",
    descLabel: "Z → A",
  },
  {
    label: "Mã đối tác",
    value: "code",
    ascLabel: "A → Z",
    descLabel: "Z → A",
  },
  {
    label: "Nợ đầu kỳ",
    value: "openingAmount",
    ascLabel: "Thấp nhất",
    descLabel: "Cao nhất",
  },
  {
    label: "Tăng trong kỳ",
    value: "inAmount",
    ascLabel: "Thấp nhất",
    descLabel: "Cao nhất",
  },
  {
    label: "Giảm trong kỳ",
    value: "outAmount",
    ascLabel: "Thấp nhất",
    descLabel: "Cao nhất",
  },
  {
    label: "Nợ cuối kỳ",
    value: "closingAmount",
    ascLabel: "Thấp nhất",
    descLabel: "Cao nhất",
  },
];

export const rangerItems: RangerItem[] = [
  { label: "Nợ đầu kỳ", key: "openingAmount" },
  { label: "Tăng trong kỳ", key: "inAmount" },
  { label: "Giảm trong kỳ", key: "outAmount" },
  { label: "Nợ cuối kỳ", key: "closingAmount" },
];

export const filterUses: FilterKey[] = [];
