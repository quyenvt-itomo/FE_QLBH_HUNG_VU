import { Quotation } from "./quotation.model";

/**
 * Tính toán tổng tiền từ các dòng báo giá
 */
export function calculateQuotation(data?: Partial<Quotation>) {
  const lines = data?.lines || [];

  let subTotal = 0;
  let taxAmount = 0;
  let totalAmount = 0;
  let commissionTotal = 0;

  lines.forEach((item) => {
    const qty = Number(item.quantity) || 0;
    const price = Number(item.unitPrice) || 0;
    const taxRate = Number(item.taxRate) || 0;
    const lineTotal = qty * price;
    subTotal += lineTotal;
    const lineTax = lineTotal * (taxRate / 100);
    taxAmount += lineTax;
    totalAmount += lineTotal + lineTax;
    commissionTotal += Number(item.commissionAmount) || 0;
  });

  return {
    subTotal: Math.round(subTotal),
    taxAmount: Math.round(taxAmount),
    totalAmount: Math.round(totalAmount),
    commissionTotal: Math.round(commissionTotal),
  };
}
