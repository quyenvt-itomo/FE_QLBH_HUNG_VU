import { EntityWithStore } from "@/shared/base/entity";
import { ApiRequestQuery } from "@/shared/interfaces/api";

export interface partnerDebtOffsetQuery extends ApiRequestQuery {
  moreQuery?: any;
}

export interface PartnerDebtOffset extends EntityWithStore {
  code: string;
  note?: string | null;
  fromPartnerId: string | null;
  toPartnerId: string | null;
  amount: number;
  reason: string | null;
  occurredAt: string;
}
