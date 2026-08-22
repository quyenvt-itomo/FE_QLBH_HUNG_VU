import { FilterKey, RangerItem, SortItem } from "../../../models/base/interface";

export const sortItems: SortItem[] = [
  {
    label: "Tồn cuối kỳ",
    value: "closingQty",
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
    value: "openingQty",
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
    value: "increaseQty",
    ascLabel: "Ít nhất",
    descLabel: "Nhiều nhất",
  },
  {
    label: "Giá trị nhập trong kỳ",
    value: "increaseAmount",
    ascLabel: "Ít nhất",
    descLabel: "Nhiều nhất",
  },

  {
    label: "Xuất trong kỳ",
    value: "decreaseQty",
    ascLabel: "Ít nhất",
    descLabel: "Nhiều nhất",
  },
  {
    label: "Giá trị xuất trong kỳ",
    value: "decreaseAmount",
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
    key: "closingQty",
  },
  {
    label: "Giá trị tồn cuối kỳ",
    key: "closingAmount",
  },

  {
    label: "Tồn đầu kỳ",
    key: "openingQty",
  },
  {
    label: "Giá trị tồn đầu kỳ",
    key: "openingAmount",
  },

  {
    label: "Nhập trong kỳ",
    key: "increaseQty",
  },
  {
    label: "Giá trị nhập trong kỳ",
    key: "increaseAmount",
  },

  {
    label: "Xuất trong kỳ",
    key: "decreaseQty",
  },
  {
    label: "Giá trị xuất trong kỳ",
    key: "decreaseAmount",
  },
];

export const filterUses: FilterKey[] = ["productCategoryIds", "unitIds"];
