import { StoreEntity } from "@/shared/base/entity";
import { ApiRequestQuery } from "@/shared/interfaces/api";

export interface vatDebtAdjustmentQuery extends ApiRequestQuery {
  moreQuery?: any;
}

export interface VatDebtAdjustment extends StoreEntity {
  code: string;
  expectedAmount: number;
  countedAmount: number;
  deltaAmount: number;
  reason: string | null;
  occurredAt: string;
  isInitial?: boolean;
}
