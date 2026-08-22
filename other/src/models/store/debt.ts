import { DebtDirectionEnum, DebtRefTypeEnum, PartnerDebtSideEnum } from "../../constants/enum";
import { ApiRequestQuery, ApiResponse } from "../base/api";
import { IPartner } from "../partner";
import { IEntityWithStore } from "./entityWithStore";

export interface DebtQuery extends ApiRequestQuery {
  moreQuery?: any;
  side: PartnerDebtSideEnum;
  partnerId?: string;
  storeId?: string;
}

export interface IDebtReport extends Omit<IPartner, "variants"> {
  closingAmount: number;
  decreaseAmount: number;
  increaseAmount: number;
  openingAmount: number;
}

export interface IDebtTransaction extends IEntityWithStore {
  occurredAt: string;

  side: PartnerDebtSideEnum;
  direction: DebtDirectionEnum;

  refId: string;
  refCode: string;
  refType: DebtRefTypeEnum;

  amount: number;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface DebtResponse extends ApiResponse {}
