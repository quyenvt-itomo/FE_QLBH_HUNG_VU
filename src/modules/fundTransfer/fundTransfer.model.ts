import { StoreEntity } from "@/shared/base/entity";
import { ApiRequestQuery } from "@/shared/interfaces/api";
import { Fund } from "@/modules/fund/fund.model";

export interface FundTransferQuery extends ApiRequestQuery {
  moreQuery?: any;
}

export interface FundTransfer extends StoreEntity {
  code: string;
  note?: string | null;
  fromFundId: string;
  fromFund?: Fund | null;
  toFundId: string;
  toFund?: Fund | null;
  amount: number;
  occurredAt: string;
}
