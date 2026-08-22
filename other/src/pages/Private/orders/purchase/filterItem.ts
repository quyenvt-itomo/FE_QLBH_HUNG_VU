import { FilterKey, RangerItem, SortItem } from "../../../../models/base/interface";

export const sortItems: SortItem[] = [
  {
    label: "Ngày",
    value: "orderAt",
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
    label: "Tổng tiền hàng",
    value: "grossAmount",
    ascLabel: "Tăng dần",
    descLabel: "Giảm dần",
  },

  {
    label: "Giảm giá sản phẩm",
    value: "lineDiscountAmount",
    ascLabel: "Tăng dần",
    descLabel: "Giảm dần",
  },

  {
    label: "Giảm giá đơn hàng",
    value: "orderDiscountAmount",
    ascLabel: "Tăng dần",
    descLabel: "Giảm dần",
  },

  {
    label: "Tổng sau giảm",
    value: "netAmount",
    ascLabel: "Tăng dần",
    descLabel: "Giảm dần",
  },

  {
    label: "Tiền thuế",
    value: "taxAmount",
    ascLabel: "Tăng dần",
    descLabel: "Giảm dần",
  },

  {
    label: "Giá trị đơn hàng",
    value: "totalAmount",
    ascLabel: "Tăng dần",
    descLabel: "Giảm dần",
  },
];

export const rangerItems: RangerItem[] = [
  {
    label: "Tổng tiền hàng",
    key: "grossAmount",
  },
  {
    label: "Giảm giá sản phẩm",
    key: "lineDiscountAmount",
  },
  {
    label: "Giảm giá đơn hàng",
    key: "orderDiscountAmount",
  },
  {
    label: "Tổng sau giảm",
    key: "netAmount",
  },
  {
    label: "Tiền thuế",
    key: "taxAmount",
  },
  {
    label: "Tổng giá trị đơn hàng",
    key: "totalAmount",
  },
];

export const filterUses: FilterKey[] = ["employeeIds", "supplierIds", "shipperIds", "productIds"];

export const searchItems = [
  {
    label: "Mã đơn",
    key: "code",
  },
  {
    label: "Nhà cung cấp",
    key: "partner.name",
  },
  {
    label: "Nhân viên xử lý",
    key: "employee.name",
  },
  {
    label: "Ghi chú",
    key: "description",
  },
];
