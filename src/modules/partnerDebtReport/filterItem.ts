import { FilterKey, RangerItem, SortItem } from "@/shared/interfaces/common";

export const sortItems: SortItem[] = [
  {
    label: "Tồn cuối kỳ",
    value: "closingQuantity",
    ascLabel: "Ít nhất",
    descLabel: "Nhiều nhất",
  },
  {
    label: "Giá trị tồn cuối kỳ",
    value: "closingAmount",
    ascLabel: "Ít nhất",
    descLabel: "Nhiều nhất",
  },

  {
    label: "Tồn đầu kỳ",
    value: "openingQuantity",
    ascLabel: "Ít nhất",
    descLabel: "Nhiều nhất",
  },
  {
    label: "Giá trị tồn đầu kỳ",
    value: "openingAmount",
    ascLabel: "Ít nhất",
    descLabel: "Nhiều nhất",
  },

  {
    label: "Nhập trong kỳ",
    value: "inQuantity",
    ascLabel: "Ít nhất",
    descLabel: "Nhiều nhất",
  },
  {
    label: "Giá trị nhập trong kỳ",
    value: "inAmount",
    ascLabel: "Ít nhất",
    descLabel: "Nhiều nhất",
  },

  {
    label: "Xuất trong kỳ",
    value: "outQuantity",
    ascLabel: "Ít nhất",
    descLabel: "Nhiều nhất",
  },
  {
    label: "Giá trị xuất trong kỳ",
    value: "outAmount",
    ascLabel: "Ít nhất",
    descLabel: "Nhiều nhất",
  },

  {
    label: "Mã hàng",
    value: "code",
    ascLabel: "A → Z",
    descLabel: "Z → A",
  },

  {
    label: "Tên hàng",
    value: "name",
    ascLabel: "A → Z",
    descLabel: "Z → A",
  },
];

export const rangerItems: RangerItem[] = [
  {
    label: "Tồn cuối kỳ",
    key: "closingQuantity",
  },
  {
    label: "Giá trị tồn cuối kỳ",
    key: "closingAmount",
  },

  {
    label: "Tồn đầu kỳ",
    key: "openingQuantity",
  },
  {
    label: "Giá trị tồn đầu kỳ",
    key: "openingAmount",
  },

  {
    label: "Nhập trong kỳ",
    key: "inQuantity",
  },
  {
    label: "Giá trị nhập trong kỳ",
    key: "inAmount",
  },

  {
    label: "Xuất trong kỳ",
    key: "outQuantity",
  },
  {
    label: "Giá trị xuất trong kỳ",
    key: "outAmount",
  },
];

export const filterUses: FilterKey[] = [];
