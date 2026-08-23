import { OrderLine } from "../orderLine";
import { Order } from "./order.model";

/**
 * Tính tổng tiền từ các dòng đơn hàng
 */
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

  return {
    subTotal: Math.round(subTotal),
    taxAmount: Math.round(taxAmount),
    totalAmount: Math.round(totalAmount),
    commissionTotal: Math.round(commissionTotal),
  };
}
