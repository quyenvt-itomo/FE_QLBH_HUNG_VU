import { DebtDirectionEnum, DebtRefTypeEnum } from "../../constants/enum";
import { ApiRequestQuery, ApiResponse } from "../base/api";
import { IEntityWithStore } from "./entityWithStore";

export interface VatQuery extends ApiRequestQuery {
  moreQuery?: any;
  productId?: string;
  productVariantId?: string;
  storeId?: string;
}

export interface IVatTransaction extends IEntityWithStore {
  occurredAt: string;

  direction: DebtDirectionEnum;

  refId: string;
  refCode: string;
  refType: DebtRefTypeEnum;

  amount: number;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface VatResponse extends ApiResponse {}
