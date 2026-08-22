import { EntityWithCompany } from "@/shared/base/entity";
import { ApiRequestQuery } from "@/shared/interfaces/api";
import { Product, ProductType } from "../product";
import { TransactionTypeEnum } from "@/shared/constants/enum";

export enum InventoryTransactionRefTypeEnum {
  PURCHASE_RECEIPT = "purchase_receipt", // Phiếu nhập kho từ đơn mua hàng
  MATERIAL_ISSUE = "material_issue", // Phiếu xuất kho NVL
  PRODUCTION_RECEIPT = "production_receipt", // Phiếu nhập kho thành phẩm
  ORDER_ISSUE = "order_issue", // Phiếu xuất kho hàng bán
  TRANSFER = "transfer",
  ADJUST = "adjust",
}
export const inventoryTransactionRefTypeMap: Record<InventoryTransactionRefTypeEnum, string> = {
  [InventoryTransactionRefTypeEnum.PURCHASE_RECEIPT]: "Nhập kho hàng mua",
  [InventoryTransactionRefTypeEnum.MATERIAL_ISSUE]: "Xuất kho NVL",
  [InventoryTransactionRefTypeEnum.PRODUCTION_RECEIPT]: "Nhập kho thành phẩm",
  [InventoryTransactionRefTypeEnum.ORDER_ISSUE]: "Xuất kho hàng bán",
  [InventoryTransactionRefTypeEnum.TRANSFER]: "Chuyển kho",
  [InventoryTransactionRefTypeEnum.ADJUST]: "Điều chỉnh kho",
};

export interface InventoryQuery extends ApiRequestQuery {
  moreQuery?: any;
  productId?: string;
  type?: ProductType;
  types?: ProductType[];
  refType?: InventoryTransactionRefTypeEnum;
}

export interface InventoryReport extends Product {
  closingAmount: number;
  closingQuantity: number;
  outAmount: number;
  outQuantity: number;
  inAmount: number;
  inQuantity: number;
  openingAmount: number;
  openingQuantity: number;
}

export interface InventoryTransaction extends EntityWithCompany {
  occurredAt: string;

  productId: string;
  product: Product;

  type: TransactionTypeEnum;
  refId: string;
  refCode: string;
  refType: InventoryTransactionRefTypeEnum;

  quantity: number;
  amount: number;

  closingQuantity: number;
  closingAmount: number;
}
export interface InventoryStreamData {
  timestamp: string;
  totalVariants: number;
  pendingVariants: number;
  processingVariants: number;
  byDocumentType: {
    saleOrders: number;
    purchaseOrders: number;
    purchaseReturns: number;
    saleReturns: number;
    transferVouchers: number;
    adjustmentVouchers: number;
    unknown: number;
  };
}
