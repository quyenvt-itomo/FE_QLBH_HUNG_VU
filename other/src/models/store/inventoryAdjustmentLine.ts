import { InventoryTransactionTypeEnum } from "../../constants/enum";
import { ApiRequestQuery, ApiResponse } from "../base/api";
import { IEntity } from "../base/entity";
import { IProductVariant, ProductVariantSnapshot } from "../product";

export interface InventoryAdjustmentLineQuery extends ApiRequestQuery {
  moreQuery?: any;
}

export interface IInventoryAdjustmentLine extends IEntity {
  adjustmentId: string;

  productVariantId: string;
  productVariant: IProductVariant;
  productVariantSnapshot: ProductVariantSnapshot;

  expectedQty: number; // số lượng tồn kho điều chỉnh

  countedQty: number; // số lượng hệ thống đếm được

  deltaQty: number;

  direction: InventoryTransactionTypeEnum;

  // costPriceAtTime: number;

  adjustmentQty: number;
  adjustmentValue: number;
}

export interface InventoryAdjustmentLineResponse extends ApiResponse {}
