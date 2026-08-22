import { EntityWithCompany } from "@/shared/base/entity";
import { ApiRequestQuery } from "@/shared/interfaces/api";

export interface commissionDebtAdjustmentQuery extends ApiRequestQuery {
  moreQuery?: any;
}

export interface CommissionDebtAdjustment extends EntityWithCompany {
  code: string;
  note?: string | null;
  partnerContactId: string | null;
  amount: number;
  reason: string | null;
  occurredAt: string;
}
