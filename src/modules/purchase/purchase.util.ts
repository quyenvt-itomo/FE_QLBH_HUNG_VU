import { Purchase } from "./purchase.model";

export const getLineProduct = (line: any) => line?.product || line?.productSnapshot || {};
export const getLineUnit = (line: any) => line?.unit || line?.unitSnapshot || {};

export function calculatePurchase(data?: Partial<Purchase>) {
  const lines = data?.lines || [];
  const grossAmount = lines.reduce(
    (sum, line) => sum + Number(line.quantity || 0) * Number(line.unitPrice || 0),
    0,
  );
  const discountAmount = Math.min(grossAmount, Number(data?.discountAmount || 0));
  const taxAmount = Number(data?.taxAmount || 0);
  return {
    grossAmount,
    discountAmount,
    netAmount: Math.max(0, grossAmount - discountAmount),
    taxAmount,
    totalAmount: Math.max(0, grossAmount - discountAmount) + taxAmount,
  };
}

export const formatVnd = (value: unknown) =>
  `${new Intl.NumberFormat("vi-VN").format(Number(value || 0))} đ`;
