import { EntityWithStore } from "@/shared/base/entity";
import { ApiRequestQuery } from "@/shared/interfaces/api";

export interface partnerDebtAdjustmentQuery extends ApiRequestQuery {
  moreQuery?: any;
}

export interface PartnerDebtAdjustment extends EntityWithStore {
  code: string;
  note?: string | null;
  partnerId: string | null;
  amount: number;
  side: string;
  reason: string | null;
  occurredAt: string;
}
