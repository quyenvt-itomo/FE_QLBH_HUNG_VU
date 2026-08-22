import { ApiRequestQuery, ApiResponse } from "./base/api";
import { PartnerTypeEnum } from "../constants/enum";
import { IAttribute } from "./base/attribute";

export interface PartnerSubTypeQuery extends ApiRequestQuery {
  moreQuery?: any;
}

export interface IPartnerSubType {
  id?: string;
  partnerId: string;
  type?: PartnerTypeEnum;
  groupId: string;
  group?: IAttribute;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface PartnerSubTypeResponse extends ApiResponse {}
