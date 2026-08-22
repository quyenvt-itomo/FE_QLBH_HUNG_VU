import { DiscountTypeEnum } from "@/shared/constants/enum";
import { Purchase } from "./purchase.model";

export function calculatePurchase(data?: Partial<Purchase>) {
  const { lines = [], discountType, discountValue = 0 } = data || {};
  let subTotal = 0;
  lines.forEach((item) => {
    const quantity = item.quantity || 0;
    const price = item.unitPrice || 0;
    subTotal += quantity * price;
  });
  const discountAmount =
    discountType === DiscountTypeEnum.PERCENT
      ? (subTotal * discountValue) / 100
      : discountValue || 0;
  const netAmount = subTotal - discountAmount;
  const totalAmount = netAmount;
  return { subTotal, discountAmount, netAmount, totalAmount };
}
