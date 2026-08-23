import { LoyaltyPointRefTypeEnum, LoyaltyPointTransactionType } from "../constants/enum";
import { ApiRequestQuery, ApiResponse } from "./base/api";
import { IEntity } from "./base/entity";
import { IPartner } from "./partner";

export interface LoyaltyPointQuery extends ApiRequestQuery {
  moreQuery?: any;
  partnerId?: string;
  storeId?: string;
}

export interface ILoyaltyPointReport extends Omit<IPartner, "variants"> {
  closingAmount: number;
  decreaseAmount: number;
  increaseAmount: number;
  openingAmount: number;
}

export interface ILoyaltyPointTransaction extends IEntity {
  occurredAt: string;
  partnerId: string;

  type: LoyaltyPointTransactionType; // INCREASE | DECREASE

  refId: string;
  refCode: string;
  refType: LoyaltyPointRefTypeEnum;

  points: number;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface LoyaltyPointResponse extends ApiResponse {}
