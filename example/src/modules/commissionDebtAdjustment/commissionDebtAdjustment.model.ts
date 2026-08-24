import { EntityWithStore } from "@/shared/base/entity";
import { ApiRequestQuery } from "@/shared/interfaces/api";

export interface commissionDebtAdjustmentQuery extends ApiRequestQuery {
  moreQuery?: any;
}

export interface CommissionDebtAdjustment extends EntityWithStore {
  code: string;
  note?: string | null;
  partnerContactId: string | null;
  amount: number;
  reason: string | null;
  occurredAt: string;
}
