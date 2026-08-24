import { StoreEntity } from "@/shared/base/entity";
import { ApiRequestQuery } from "@/shared/interfaces/api";

export interface FundTransferQuery extends ApiRequestQuery {
  moreQuery?: any;
}

export interface FundTransfer extends StoreEntity {
  code: string;
  note?: string | null;
  fromFundId: string | null;
  toFundId: string | null;
  amount: number;
  occurredAt: string;
  reason: string | null;
}
