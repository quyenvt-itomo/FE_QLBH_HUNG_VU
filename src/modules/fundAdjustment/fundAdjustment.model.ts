import { EntityWithCompany } from "@/shared/base/entity";
import { ApiRequestQuery } from "@/shared/interfaces/api";

export interface fundAdjustmentQuery extends ApiRequestQuery {
  moreQuery?: any;
}

export interface FundAdjustment extends EntityWithCompany {
  code: string;
  note?: string | null;
  fundId: string | null;
  fundSnapshot: any | null;
  amount: number;
  reason: string | null;
  occurredAt: string;
}
