import { FilterKey, RangerItem, SortItem } from "../../../models/base/interface";

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
    label: "Số lượng chênh lệch",
    value: "totalAdjustmentQty",
    ascLabel: "Tăng dần",
    descLabel: "Giảm dần",
  },

  {
    label: "Giá trị chênh lệch",
    value: "totalAdjustmentValue",
    ascLabel: "Tăng dần",
    descLabel: "Giảm dần",
  },
];

export const rangerItems: RangerItem[] = [
  {
    label: "Số lượng chênh lệch",
    key: "totalAdjustmentQty",
  },
  {
    label: "Giá trị chênh lệch",
    key: "totalAdjustmentValue",
  },
];

export const filterUses: FilterKey[] = ["employeeIds", "productIds"];

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
