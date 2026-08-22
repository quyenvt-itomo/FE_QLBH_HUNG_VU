import { Entity } from "@/shared/base/entity";
import { ApiRequestQuery } from "@/shared/interfaces/api";
import { getOptionsByMap } from "@/shared/constants/enum";
import { StockDocument } from "../stockDocument";
import { Product, ProductSnapshot } from "../product";
import { Attribute, AttributeSnapshot } from "../attribute";
import { PurchaseLine } from "../purchaseLine";
import { OrderLine } from "../orderLine";

export enum StockDocumentLineType {
  PURCHASE_RECEIPT = "purchase_receipt",
  MATERIAL_ISSUE = "material_issue",
  PRODUCTION_RECEIPT = "production_receipt",
  ORDER_ISSUE = "order_issue",
}
export const stockDocumentLineTypeMap: Record<StockDocumentLineType, string> = {
  [StockDocumentLineType.PURCHASE_RECEIPT]: "Nhập mua",
  [StockDocumentLineType.MATERIAL_ISSUE]: "Xuất NVL",
  [StockDocumentLineType.PRODUCTION_RECEIPT]: "Nhập thành phẩm",
  [StockDocumentLineType.ORDER_ISSUE]: "Xuất bán",
};
export const stockDocumentLineTypeOptions = getOptionsByMap(stockDocumentLineTypeMap);

export interface StockDocumentLineQuery extends ApiRequestQuery {
  type?: StockDocumentLineType;
  stockDocumentId?: string;
  productId?: string;
  warehouseId?: string;
}

export interface StockDocumentLine extends Entity {
  stockDocumentId: string;

  purchaseLineId: string | null;
  purchaseLine: PurchaseLine | null;

  orderLineId: string | null;
  orderLine: OrderLine | null;

  productId: string | null;
  productSnapshot: ProductSnapshot | null;
  product: Product | null;

  unitId: string | null;
  unitSnapshot: AttributeSnapshot | null;
  unit: Attribute | null;

  conversionRateAtTime: number; // Tỷ lệ quy đổi tại thời điểm tạo dòng này (dùng để quy đổi sang đơn vị gốc khi cần)

  requestQuantity: number | null;
  stockQuantity: number | null;

  additionalQuantity: number | null;
  billingQuantity: number | null;

  varianceQuantity: number | null;
  varianceAmount: number | null;

  costPriceAtTime: number | null;
  costAmount: number | null;

  stockDocument: StockDocument;
}
