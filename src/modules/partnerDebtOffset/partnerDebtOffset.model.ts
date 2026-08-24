import { StoreEntity } from "@/shared/base/entity";
import { ApiRequestQuery } from "@/shared/interfaces/api";

export interface partnerDebtOffsetQuery extends ApiRequestQuery {
  moreQuery?: any;
}

export interface PartnerDebtOffset extends StoreEntity {
  code: string;
  note?: string | null;
  fromPartnerId: string | null;
  toPartnerId: string | null;
  amount: number;
  reason: string | null;
  occurredAt: string;
}
