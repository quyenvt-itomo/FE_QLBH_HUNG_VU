import { getOptionsByMap } from "@/shared/constants/enum";

/**
 * Trạng thái duyệt - dùng chung cho nhiều module (quotation, purchase, order, production, ...)
 * Giá trị khớp với BE
 */
export enum ApproveStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  // Dành cho báo giá / đơn bán hàng
  CUSTOMER_APPROVED = "CUSTOMER_APPROVED",
  CUSTOMER_REJECTED = "CUSTOMER_REJECTED",
}

export const approvedStatusMap: Record<ApproveStatus, string> = {
  [ApproveStatus.PENDING]: "Chờ duyệt",
  [ApproveStatus.APPROVED]: "Đã duyệt",
  [ApproveStatus.REJECTED]: "Từ chối",
  // Dành cho báo giá / đơn bán hàng
  [ApproveStatus.CUSTOMER_APPROVED]: "KH đã duyệt",
  [ApproveStatus.CUSTOMER_REJECTED]: "KH từ chối",
};

export const approvedStatusOptions = getOptionsByMap(approvedStatusMap);

export const approvedStatusColorMap: Record<ApproveStatus, string> = {
  [ApproveStatus.PENDING]: "gold",
  [ApproveStatus.APPROVED]: "green",
  [ApproveStatus.REJECTED]: "red",
  [ApproveStatus.CUSTOMER_APPROVED]: "blue",
  [ApproveStatus.CUSTOMER_REJECTED]: "volcano",
};
export const approvedStatusLiteOptions = approvedStatusOptions.filter(
  (item) =>
    item.value === ApproveStatus.PENDING ||
    item.value === ApproveStatus.APPROVED ||
    item.value === ApproveStatus.REJECTED,
);

export const approvedStatusItems = [
  {
    label: "Tất cả",
    key: "all",
    value: "all",
  },
  ...approvedStatusOptions,
];
export const approvedStatusLiteItems = [
  {
    label: "Tất cả",
    key: "all",
    value: "all",
  },
  ...approvedStatusLiteOptions,
];

export enum DiscountTypeEnumLocal {
  AMOUNT = "amount",
  PERCENT = "percent",
}

export const paymentMethodMap: Record<string, string> = {
  cash: "Tiền mặt",
  bank_transfer: "Chuyển khoản",
  credit: "Công nợ",
};
