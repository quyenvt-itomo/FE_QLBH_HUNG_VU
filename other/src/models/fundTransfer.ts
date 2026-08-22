import { ApiRequestQuery, ApiResponse } from "./base/api";
import { IEntity } from "./base/entity";
import { IFund } from "./fund";

export interface FundTransferQuery extends ApiRequestQuery {
  moreQuery?: any;
}

export interface IFundTransfer extends IEntity {
  code: string;
  occurredAt: string;

  fromFundId: string;
  fromFund: IFund;

  toFundId: string;
  toFund: IFund;

  amount: number;
}

export interface FundTransferResponse extends ApiResponse {}
