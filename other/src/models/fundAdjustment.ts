import { FundTransactionTypeEnum } from "../constants/enum";
import { ApiRequestQuery, ApiResponse } from "./base/api";
import { IEntity } from "./base/entity";
import { IFund } from "./fund";

export interface FundAdjustmentQuery extends ApiRequestQuery {
  moreQuery?: any;
}

export interface IFundAdjustment extends IEntity {
  code: string;
  occurredAt: Date; // ngày ghi nhận điều chỉnh

  fundId: string;
  fund: IFund;

  expectedAmount: number; // số tiền hệ thống ghi nhận
  countedAmount: number; // số tiền thực tế kiểm kê
  deltaAmount: number;
  direction: FundTransactionTypeEnum;
  reason: string;
}

export interface FundAdjustmentResponse extends ApiResponse {}
