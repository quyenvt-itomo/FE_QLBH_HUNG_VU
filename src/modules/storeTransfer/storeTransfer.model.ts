import { Entity, Store } from "@/shared/base/entity";
import { ApiRequestQuery } from "@/shared/interfaces/api";
import { Attribute } from "../attribute/attribute.model";
import { Product, ProductSnapshot } from "../product/product.model";

export interface StoreTransferQuery extends ApiRequestQuery {
  fromStoreId?: string;
  toStoreId?: string;
}

export interface StoreTransferLine extends Entity {
  transferId: string;
  productId: string;
  productSnapshot: ProductSnapshot | null;
  product?: Product | null;
  unitId: string | null;
  unitSnapshot: { id: string; name: string } | null;
  unit?: Attribute | null;
  conversionRateAtTime: number;
  quantity: number;
  differenceCostPriceAmount?: number;
}

export interface StoreTransfer extends Entity {
  code: string;
  occurredAt: string;
  fromStoreId: string;
  fromStoreSnapshot: { id: string; code: string; name: string } | null;
  fromStore?: Store | null;
  toStoreId: string;
  toStoreSnapshot: { id: string; code: string; name: string } | null;
  toStore?: Store | null;
  reason: string | null;
  lines: StoreTransferLine[];
}
