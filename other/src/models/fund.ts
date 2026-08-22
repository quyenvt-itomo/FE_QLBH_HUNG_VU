import { ApiRequestQuery, ApiResponse } from "./base/api";
import { FundTypeEnum } from "../constants/enum";
import { IEntityWithStore } from "./store/entityWithStore";

export interface FundQuery extends ApiRequestQuery {
  moreQuery?: any;
}

export interface IFund extends IEntityWithStore {
  code: string;
  name: string;

  type: FundTypeEnum;
  bank: string;
  accountNumber: string;
  accountHolderName: string;
  branch: string;
  currentBalance: number;
  initialBalance: number;
  note?: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface FundResponse extends ApiResponse {}
