export const payment_method_options = [
  { label: "Chuyển khoản", value: "BANK_TRANSFER" },
  { label: "Tiền mặt", value: "CASH" },
];

export const paymentMethodMap: Record<string, string> = {
  BANK_TRANSFER: "Chuyển khoản",
  CASH: "Tiền mặt",
};

/**
 * Chuyển đổi phương thức thanh toán từ chuỗi sang enum
 * @param value - Phương thức thanh toán dạng chuỗi
 * @returns Phương thức thanh toán dạng enum
 */
export const convertPaymentMethod = (value: string): string => {
  return paymentMethodMap[value] || value;
};
