import { Purchase } from "../purchase/purchase.model";
import { PurchaseLine } from "../purchaseLine";
import { PurchaseQuotation, PurchaseQuotationLine } from "./purchaseQuotation.model";

export const generateDefaultPurchaseByQuotation = (
  quotation: Partial<PurchaseQuotation>,
): Partial<Purchase> => {
  const purchaseLines: Partial<PurchaseLine>[] = (quotation.lines || []).map(
    (line: PurchaseQuotationLine) => ({
      productId: line.productId,
      product: line.product,

      unitId: line.unitId,
      unit: line.unit,

      quantity: line.quantity,
      unitPrice: line.unitPrice,
      taxRate: line.taxRate,
      subTotal: line.subTotal,
      taxAmount: line.taxAmount,
      grossAmount: line.grossAmount,
    }),
  );

  return {
    storeId: quotation.storeId,

    supplierId: quotation.supplierId,
    supplierSnapshot: quotation.supplierSnapshot,
    supplier: quotation.supplier,

    sellerId: quotation.quoterId,
    sellerSnapshot: quotation.quoterSnapshot,
    seller: quotation.quoter,

    staffId: quotation.staffId,
    staffSnapshot: quotation.staffSnapshot,
    staff: quotation.staff,

    lines: purchaseLines as any,
  };
};
