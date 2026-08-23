import { Entity } from "@/shared/base/entity";
import { ApiRequestQuery } from "@/shared/interfaces/api";
import { Product } from "../product/product.model";
import { TransactionType } from "@/shared/constants/enum";

export enum InventoryTransactionRefTypeEnum {
  PRODUCT_PRICE_UPDATE = "product_price_update",
  PURCHASE = "purchase",
  SALE = "sale",
  PURCHASE_RETURN = "purchase_return",
  SALE_RETURN = "sale_return",
  TRANSFER = "transfer",
  ADJUST = "adjust",
}

export const inventoryTransactionRefTypeMap: Record<InventoryTransactionRefTypeEnum, string> = {
  [InventoryTransactionRefTypeEnum.PRODUCT_PRICE_UPDATE]: "Cập nhật giá vốn",
  [InventoryTransactionRefTypeEnum.PURCHASE]: "Nhập hàng",
  [InventoryTransactionRefTypeEnum.SALE]: "Bán hàng",
  [InventoryTransactionRefTypeEnum.PURCHASE_RETURN]: "Trả hàng nhà cung cấp",
  [InventoryTransactionRefTypeEnum.SALE_RETURN]: "Khách trả hàng",
  [InventoryTransactionRefTypeEnum.TRANSFER]: "Chuyển cửa hàng",
  [InventoryTransactionRefTypeEnum.ADJUST]: "Điều chỉnh tồn kho",
};

export interface InventoryQuery extends ApiRequestQuery {
  productId?: string;
  storeId?: string;
  refType?: InventoryTransactionRefTypeEnum;
  types?: string[];
}

export interface InventoryReport extends Product {
  openingQuantity: number;
  openingAmount: number;
  inQuantity: number;
  inAmount: number;
  outQuantity: number;
  outAmount: number;
  closingQuantity: number;
  closingAmount: number;
}

export interface InventoryTransaction extends Entity {
  occurredAt: string;
  productId: string;
  storeId: string;
  product?: Product | null;
  quantity: number;
  amount: number;
  type: TransactionType;
  costPriceAfter: number;
  quantityAfter: number;
  inventoryValueAfter: number;
  refType: InventoryTransactionRefTypeEnum;
  refId: string;
  refCode?: string | null;
  closingQuantity?: number;
  closingAmount?: number;
}

export interface InventoryStreamData {
  timestamp: string;
  totalVariants: number;
  pendingVariants: number;
  processingVariants: number;
  byDocumentType: Record<string, number>;
}
