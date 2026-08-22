import {
  InventoryTransactionRefTypeEnum,
  InventoryTransactionTypeEnum,
} from "../../constants/enum";
import { ApiRequestQuery, ApiResponse } from "../base/api";
import { IProduct, IProductVariant } from "../product";
import { IEntityWithStore } from "./entityWithStore";

export interface InventoryQuery extends ApiRequestQuery {
  moreQuery?: any;
  productId?: string;
  productVariantId?: string;
  storeId?: string;
  refType?: string;
}

export interface IInventoryReportVariant extends IProductVariant {
  closingAmount: number;
  closingQty: number;
  decreaseAmount: number;
  decreaseQty: number;
  increaseAmount: number;
  increaseQty: number;
  openingAmount: number;
  openingQty: number;
}
export interface IInventoryReport extends Omit<IProduct, "variants"> {
  closingAmount: number;
  closingQty: number;
  decreaseAmount: number;
  decreaseQty: number;
  increaseAmount: number;
  increaseQty: number;
  openingAmount: number;
  openingQty: number;
  variants?: IInventoryReportVariant[];
}

export interface IInventoryTransaction extends IEntityWithStore {
  occurredAt: string;

  productVariantId?: string;
  productVariant?: IProductVariant;

  type: InventoryTransactionTypeEnum;
  refId: string;
  refCode: string;
  refType: InventoryTransactionRefTypeEnum;

  quantity: number;
  amount: number;

  closingAmount: number;
  closingQty: number;
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

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface InventoryResponse extends ApiResponse {}
