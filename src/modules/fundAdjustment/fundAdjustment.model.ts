import { StoreEntity } from "@/shared/base/entity";
import { ApiRequestQuery } from "@/shared/interfaces/api";
import { Fund, FundSnapshot } from "@/modules/fund/fund.model";

export interface fundAdjustmentQuery extends ApiRequestQuery {
  moreQuery?: any;
}

export interface FundAdjustment extends StoreEntity {
  code: string;
  note?: string | null;
  fundId: string;
  fundSnapshot: FundSnapshot | null;
  fund?: Fund | null;
  expectedAmount: number;
  countedAmount: number;
  deltaAmount: number;
  reason: string | null;
  occurredAt: string;
  isInitial?: boolean;
}
