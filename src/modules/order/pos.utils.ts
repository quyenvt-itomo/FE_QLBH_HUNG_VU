import { DiscountTypeEnum } from "@/shared/constants/enum";
import { FundTypeEnum } from "@/modules/fund/fund.model";
import type { Product } from "@/modules/product/product.model";
import type { PosLine } from "./components/OrderLineTable";
import { OrderType } from "./order.model";
import type { CachedOrder, PosOrderType } from "@/shared/stores/orderCache.slice";

export const emptyOrder = (type: PosOrderType): Partial<CachedOrder> => ({
  type,
  orderAt: new Date().toISOString(),
  lines: [],
  returnLines: [],
  discountType: DiscountTypeEnum.AMOUNT,
  discountValue: 0,
  taxType: DiscountTypeEnum.PERCENT,
  taxValue: 0,
  returnDiscountType: DiscountTypeEnum.AMOUNT,
  returnDiscountValue: 0,
  returnTaxType: DiscountTypeEnum.PERCENT,
  returnTaxValue: 0,
  shippingFee: 0,
  isFreeShipping: false,
  paymentMode: FundTypeEnum.CASH,
  incomeExpenses: [{ amount: 0, fundId: null, fund: null }],
});

const CACHE_META_FIELDS = new Set(["id", "tempId", "label", "mode", "sourceId", "initialOrder"]);

const comparableCacheData = (cache: Partial<CachedOrder>) =>
  Object.fromEntries(Object.entries(cache).filter(([key]) => !CACHE_META_FIELDS.has(key)));

export const hasCacheChanges = (cache: CachedOrder): boolean => {
  const lines = cache.type === OrderType.SALE_RETURN ? cache.returnLines : cache.lines;

  if (cache.mode === "create") return Boolean(lines?.length);
  if (!cache.initialOrder) return Boolean(lines?.length || cache.returnLines?.length);

  return (
    JSON.stringify(comparableCacheData(cache)) !==
    JSON.stringify(comparableCacheData(cache.initialOrder))
  );
};

export const getProductPrice = (product: Product) => Number(product.salePrice ?? 0);

export const cellText = (value: unknown): string => {
  if (value == null) return "";
  if (typeof value === "object" && value && "richText" in value) {
    const richText = (value as { richText?: Array<{ text?: string }> }).richText || [];
    return richText.map((item) => item.text || "").join("").trim();
  }
  return String(value).trim();
};

export const cellNumber = (value: unknown) => {
  const number = Number(String(value ?? "").replace(/,/g, ""));
  return Number.isFinite(number) ? number : 0;
};

export const getLinesGrossAmount = (lines?: Array<{ quantity?: number; unitPrice?: number }>) =>
  (lines || []).reduce(
    (total, line) => total + Number(line.quantity || 0) * Number(line.unitPrice || 0),
    0,
  );

export const getAllocatedReturnValue = (
  type: DiscountTypeEnum | undefined,
  value: number | null | undefined,
  returnedGrossAmount: number,
  sourceGrossAmount: number,
) => {
  const sourceValue = Math.max(0, Number(value || 0));
  if (type === DiscountTypeEnum.PERCENT) return sourceValue;
  if (sourceGrossAmount <= 0 || returnedGrossAmount <= 0) return 0;
  return Math.round((sourceValue * returnedGrossAmount) / sourceGrossAmount);
};

export const calculateTotals = (lines: PosLine[], order: CachedOrder) => {
  const grossAmount = lines.reduce(
    (total, line) => total + Number(line.quantity || 0) * Number(line.unitPrice || 0),
    0,
  );
  const discountValue = Math.max(0, Number(order.discountValue || 0));
  const discountAmount =
    order.discountType === DiscountTypeEnum.PERCENT
      ? Math.min(grossAmount, (grossAmount * discountValue) / 100)
      : Math.min(grossAmount, discountValue);
  const netAmount = Math.max(0, grossAmount - discountAmount);
  const taxValue = Math.max(0, Number(order.taxValue || 0));
  const taxAmount =
    order.taxType === DiscountTypeEnum.PERCENT ? (netAmount * taxValue) / 100 : taxValue;
  const shippingFee = Math.max(0, Number(order.shippingFee || 0));
  const shippingAmount = order.isFreeShipping === false ? shippingFee : 0;

  return {
    grossAmount,
    discountAmount,
    netAmount,
    taxAmount,
    totalAmount: netAmount + taxAmount + shippingAmount,
  };
};
