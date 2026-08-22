import { FilterKey, RangerItem, SearchItem, SortItem } from "../../../models/base/interface";

export const sortItems: SortItem[] = [
  {
    label: "Ngày tạo",
    value: "createdAt",
    ascLabel: "Cũ nhất",
    descLabel: "Mới nhất",
  },
  {
    label: "Mã sản phẩm",
    value: "code",
    ascLabel: "A → Z",
    descLabel: "Z → A",
  },

  {
    label: "Tên sản phẩm",
    value: "name",
    ascLabel: "A → Z",
    descLabel: "Z → A",
  },

  // {
  //   label: "Giá vốn",
  //   value: "productVariants.costPrice",
  //   ascLabel: "Thấp nhất",
  //   descLabel: "Cao nhất",
  // },

  // {
  //   label: "Giá bán",
  //   value: "productVariants.price",
  //   ascLabel: "Thấp nhất",
  //   descLabel: "Cao nhất",
  // },

  {
    label: "Tồn kho",
    value: "totalStockQty",
    ascLabel: "Thấp nhất",
    descLabel: "Cao nhất",
  },

  {
    label: "Giá trị tồn kho",
    value: "totalStockValue",
    ascLabel: "Thấp nhất",
    descLabel: "Cao nhất",
  },
];

export const rangerItems: RangerItem[] = [
  {
    label: "Thuế VAT",
    key: "taxRate",
  },
  {
    label: "Giá vốn",
    key: "costPrice",
  },
  { label: "Giá bán", key: "price" },
  {
    label: "Tồn kho",
    key: "totalStockQty",
  },
  {
    label: "Giá trị tồn kho",
    key: "totalStockValue",
  },
];

export const filterUses: FilterKey[] = ["productCategoryIds", "unitIds"];

export const searchItems: SearchItem[] = [
  {
    label: "Mã sản phẩm",
    key: "code",
  },
  {
    label: "Tên sản phẩm",
    key: "name",
  },
  {
    label: "Mô tả",
    key: "description",
  },
];
