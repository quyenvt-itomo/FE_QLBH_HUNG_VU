import { ApiRequestQuery, ApiResponse } from "./base/api";
import { IEntity } from "./base/entity";
import { IProductVariant, ProductVariantSnapshot } from "./product";

export interface StoreTransferLineQuery extends ApiRequestQuery {
  moreQuery?: any;
}

export interface IStoreTransferLine extends IEntity {
  transferId?: string;

  productVariantId?: string;
  productVariant?: IProductVariant;
  productVariantSnapshot: ProductVariantSnapshot;

  quantity: number;

  isNew?: boolean;
}

export interface StoreTransferLineResponse extends ApiResponse {}
