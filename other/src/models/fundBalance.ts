import { FundTransactionRefTypeEnum, FundTransactionTypeEnum } from "../constants/enum";
import { ApiRequestQuery, ApiResponse } from "./base/api";
import { IEntity } from "./base/entity";
import { IFund } from "./fund";

export interface FundBalanceQuery extends ApiRequestQuery {
  moreQuery?: any;
  fundId?: string;
}

export interface IFundBalanceReport extends IFund {
  closingAmount: number;
  decreaseAmount: number;
  increaseAmount: number;
  openingAmount: number;
}

export interface IFundBalanceTransaction extends IEntity {
  occurredAt: string;

  fundId?: string;
  fund?: IFund;

  type: FundTransactionTypeEnum;
  refId: string;
  refCode: string;
  refType: FundTransactionRefTypeEnum;

  amount: number;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface FundBalanceResponse extends ApiResponse {}
