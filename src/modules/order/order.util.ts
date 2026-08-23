import { Order, OrderLine } from "./order.model";

/** Tính tổng tiền từ các dòng đơn hàng. Lines chỉ được cập nhật trong Order. */
export function calculateOrder(data?: Partial<Order>) {
  const lines: OrderLine[] = data?.lines || [];
  let subTotal = 0;
  let taxAmount = 0;
  let totalAmount = 0;
  let commissionTotal = 0;

  lines.forEach((item) => {
    const quantity = Number(item.quantity) || 0;
    const price = Number(item.unitPrice) || 0;
    const lineTotal = quantity * price;
    subTotal += lineTotal;
    const lineTax = (lineTotal * (Number(item.taxRate) || 0)) / 100;
    taxAmount += lineTax;
    totalAmount += lineTotal + lineTax;
    commissionTotal += Number(item.commissionAmount) || 0;
  });

  const discountValue = Number((data as any)?.discountValue) || 0;
  const discountAmount = Math.min(
    subTotal,
    (data as any)?.discountType === "percent" ? (subTotal * discountValue) / 100 : discountValue,
  );
  const taxableAmount = Math.max(0, subTotal - discountAmount);
  const taxValue = Number((data as any)?.taxValue) || 0;
  taxAmount = (data as any)?.taxType === "amount" ? taxValue : (taxableAmount * taxValue) / 100;
  totalAmount = taxableAmount + taxAmount;

  return {
    subTotal: Math.round(subTotal),
    taxAmount: Math.round(taxAmount),
    totalAmount: Math.round(totalAmount),
    discountAmount: Math.round(discountAmount),
    commissionTotal: Math.round(commissionTotal),
  };
}
