import { resolveByPath } from "@/shared/utils/common.util";
import { Order } from "../order";
import { InvoiceLine } from "./invoice.model";
import { SaleLineType } from "@/shared/constants/enum";
import { Purchase } from "../purchase";
import { CalculationUtil } from "@/shared/utils/calculation.util";
import { ShippingPlan } from "../shippingPlan";
import { StockDocument, StockDocumentType } from "../stockDocument";

const calc = new CalculationUtil();

type convertOrderMode = "all" | "product" | "service";
export function convertOrderToInvoiceLines(
  order: Order,
  mode: convertOrderMode = "all",
): InvoiceLine[] {
  const result: InvoiceLine[] = [];

  const lines = [...(order.lines || [])];

  for (const line of lines) {
    const isProduct = line.type === SaleLineType.PRODUCT;
    if (mode === "product" && !isProduct) continue;
    if (mode === "service" && isProduct) continue;

    const calcLine = calc.calculateLine({
      quantity: line.deliveredQuantity,
      unitPrice: line.unitPrice,
      taxRate: line.taxRate,
    });

    result.push({
      sourceLineId: line.id,

      productId: isProduct ? line.productId : line.serviceId,
      productName: isProduct
        ? resolveByPath(line, ["product", "name"])
        : resolveByPath(line, ["service", "name"]),
      productCode: resolveByPath(line, ["product", "code"], null),
      unit: resolveByPath(line, ["unit", "name"], null),

      quantity: calcLine.quantity ?? 0,
      unitPrice: calcLine.unitPrice ?? 0,
      subTotal: calcLine.subTotal,

      taxRate: calcLine.taxRate,
      taxAmount: calcLine.taxAmount,

      totalAmount: calcLine.grossAmount,
    });
  }

  return result;
}

export const convertPurchaseToInvoiceLines = (purchase: Purchase): InvoiceLine[] => {
  const result: InvoiceLine[] = [];

  const lines = [...(purchase.lines || [])];

  for (const line of lines) {
    const calcLine = calc.calculateLine({
      quantity: line.deliveredQuantity ?? 0,
      unitPrice: line.unitPrice ?? 0,
      taxRate: line.taxRate ?? 0,
    });

    result.push({
      sourceLineId: line.id,

      productId: line.productId,
      productName: resolveByPath(line, ["product", "name"]),
      productCode: resolveByPath(line, ["product", "code"], null),
      unit: resolveByPath(line, ["unit", "name"], null),

      quantity: calcLine.quantity ?? 0,
      unitPrice: calcLine.unitPrice ?? 0,
      subTotal: calcLine.subTotal,
      taxRate: calcLine.taxRate,
      taxAmount: calcLine.taxAmount,
      totalAmount: calcLine.grossAmount,
    });
  }

  return result;
};

export const convertShippingPlanToInvoiceLines = (shippingPlan: ShippingPlan): InvoiceLine[] => {
  const calcLine = calc.calculateLine({
    quantity: shippingPlan.quantity ?? 0,
    unitPrice: shippingPlan.unitPrice ?? 0,
    taxRate: shippingPlan.taxRate ?? 0,
  });

  return [
    {
      sourceLineId: shippingPlan.id,
      productName: "Vận chuyển",
      productCode: shippingPlan.code,
      unit: "Chuyến",
      quantity: calcLine.quantity ?? 0,
      unitPrice: calcLine.unitPrice ?? 0,
      subTotal: calcLine.subTotal,
      taxRate: calcLine.taxRate,
      taxAmount: calcLine.taxAmount,
      totalAmount: calcLine.grossAmount,
    },
  ];
};

export const convertStockDocumentToInvoiceLines = (stockDocument: StockDocument): InvoiceLine[] => {
  const result: InvoiceLine[] = [];

  const isPurchase = stockDocument.type === StockDocumentType.PURCHASE_RECEIPT;

  const lines = [...(stockDocument.lines || [])];

  for (const line of lines) {
    const calcLine = calc.calculateLine({
      quantity: line.billingQuantity ?? 0,
      unitPrice: isPurchase
        ? (line.purchaseLine?.unitPrice ?? 0)
        : (line.orderLine?.unitPrice ?? 0),
      taxRate: isPurchase ? (line.purchaseLine?.taxRate ?? 0) : (line.orderLine?.taxRate ?? 0),
    });
    result.push({
      sourceLineId: line.id,

      productId: isPurchase ? line.purchaseLine?.productId : line.orderLine?.productId,
      productName: isPurchase
        ? resolveByPath(line, ["product", "name"])
        : resolveByPath(line, ["product", "name"]),
      productCode: isPurchase
        ? resolveByPath(line, ["product", "code"])
        : resolveByPath(line, ["product", "code"]),
      unit: isPurchase
        ? resolveByPath(line, ["unit", "name"])
        : resolveByPath(line, ["unit", "name"]),

      quantity: calcLine.quantity ?? 0,
      unitPrice: calcLine.unitPrice ?? 0,
      subTotal: calcLine.subTotal,
      taxRate: calcLine.taxRate,
      taxAmount: calcLine.taxAmount,
      totalAmount: calcLine.grossAmount,
    });
  }

  return result;
};
