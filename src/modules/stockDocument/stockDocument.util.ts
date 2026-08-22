import { StockDocumentLine } from "../stockDocumentLine";
import { StockDocumentType, stockDocumentTypeWithVariance } from "./stockDocument.model";

export class StockDocumentCalculationUtil {
  // =========================
  // Individual
  // =========================
  // Cho phiếu xuất hàng bán
  calculateVirtualQuantity(data: StockDocumentLine): number {
    const stockQuantity = data.stockQuantity ?? 0;
    const additionalQuantity = data.additionalQuantity ?? 0;
    return stockQuantity + additionalQuantity;
  }

  // Chênh lệch giữa chứng từ và thực tế
  calculateVarianceQuantity(
    data: StockDocumentLine,
    stockDocumentType?: StockDocumentType,
  ): number {
    if (!data) return 0;
    const type = data.stockDocument?.type ?? stockDocumentType;
    if (!type || !stockDocumentTypeWithVariance.includes(type)) return 0;

    const stockQuantity = data.stockQuantity ?? 0;
    const billingQuantity = data.billingQuantity ?? 0;
    return type === StockDocumentType.PURCHASE_RECEIPT
      ? stockQuantity - billingQuantity
      : billingQuantity - stockQuantity;
  }
  calculateVarianceAmount(data: StockDocumentLine, stockDocumentType?: StockDocumentType): number {
    if (!data) return 0;
    const type = data.stockDocument?.type ?? stockDocumentType;
    if (!type || !stockDocumentTypeWithVariance.includes(type)) return 0;

    const varianceQuantity = this.calculateVarianceQuantity(data, type);
    const unitPrice = data.purchaseLine?.unitPrice ?? data.orderLine?.unitPrice ?? 0;
    return varianceQuantity * unitPrice;
  }

  calculateSubTotal(data: StockDocumentLine): number {
    if (!data) return 0;
    const { purchaseLine, orderLine } = data;
    const billingQuantity = data.billingQuantity ?? 0;
    const unitPrice = purchaseLine?.unitPrice ?? orderLine?.unitPrice ?? 0;
    return billingQuantity * unitPrice;
  }

  calculateTaxAmount(data: StockDocumentLine): number {
    if (!data) return 0;
    const { purchaseLine, orderLine } = data;
    const billingQuantity = data.billingQuantity ?? 0;
    const unitPrice = purchaseLine?.unitPrice ?? orderLine?.unitPrice ?? 0;
    const taxRate = purchaseLine?.taxRate ?? orderLine?.taxRate ?? 0;
    return (billingQuantity * unitPrice * taxRate) / 100;
  }

  calculateGrossAmount(data: StockDocumentLine): number {
    if (!data) return 0;
    return this.calculateSubTotal(data) + this.calculateTaxAmount(data);
  }

  // =========================
  // Calculate totals for array
  // =========================

  /** Tính tổng cho mảng lines (không có commission) */
  calculateTotalForArray(lines: StockDocumentLine[], stockDocumentType?: StockDocumentType) {
    let totalRequestQuantity = 0;

    let totalBillingQuantity = 0;

    let totalStockQuantity = 0;
    let totalAdditionalQuantity = 0;
    let totalVirtualQuantity = 0;

    let totalSubTotal = 0;
    let totalTaxAmount = 0;
    let totalGrossAmount = 0;

    let totalVarianceQuantity = 0;
    let totalVarianceAmount = 0;

    for (const line of lines) {
      const type = line.stockDocument?.type || stockDocumentType;
      totalRequestQuantity += line.requestQuantity ?? 0;

      totalBillingQuantity += line.billingQuantity ?? 0;

      totalStockQuantity += line.stockQuantity ?? 0;
      totalAdditionalQuantity += line.additionalQuantity ?? 0;
      totalVirtualQuantity += this.calculateVirtualQuantity(line);

      totalVarianceQuantity += this.calculateVarianceQuantity(line, type);
      totalVarianceAmount += this.calculateVarianceAmount(line, type);

      totalSubTotal += this.calculateSubTotal(line);
      totalTaxAmount += this.calculateTaxAmount(line);
      totalGrossAmount += this.calculateGrossAmount(line);
    }

    return {
      totalRequestQuantity,

      totalBillingQuantity,

      totalStockQuantity,
      totalAdditionalQuantity,
      totalVirtualQuantity,

      totalSubTotal,
      totalTaxAmount,
      totalGrossAmount,

      totalVarianceQuantity,
      totalVarianceAmount,
    };
  }
}
