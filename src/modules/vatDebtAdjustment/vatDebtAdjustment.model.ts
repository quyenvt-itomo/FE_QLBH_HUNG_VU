import { EntityWithStore } from "@/shared/base/entity";
import { ApiRequestQuery } from "@/shared/interfaces/api";

export interface vatDebtAdjustmentQuery extends ApiRequestQuery {
  moreQuery?: any;
}

export interface VatDebtAdjustment extends EntityWithStore {
  code: string;
  note?: string | null;
  invoiceId: string | null;
  amount: number;
  reason: string | null;
  occurredAt: string;
}
