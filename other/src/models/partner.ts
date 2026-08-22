import { PartnerTypeEnum } from "../constants/enum";
import { ApiRequestQuery, ApiResponse } from "./base/api";
import { IAttribute } from "./base/attribute";
import { IEntity } from "./base/entity";
import { IFile } from "./base/file";
import { IAddress } from "./base/interface";
import { IContact } from "./partnerContact";
import { IPartnerSubType } from "./partnerSubType";

export interface PartnerQuery extends Omit<ApiRequestQuery, "type"> {
  moreQuery?: any;
  role?: PartnerTypeEnum;
}

export interface IBank {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  branch?: string;
}

export interface IRepresentative {
  name: string;
  position: string;
  phone?: string;
  email?: string;
}

export interface PartnerSnapshot {
  id: string;
  name: string;
  code: string;
  type: string;
  representative?: IRepresentative | null;
  email?: string | null;
  phone?: string | null;
  addresses?: IAddress[];
}

export interface IPartner extends IEntity {
  groupId: string | null;
  group?: IAttribute | null;
  type: PartnerTypeEnum;

  name: string;
  code: string;
  email: string;
  phone: string;
  taxCode: string;
  note?: string;
  avatar?: IFile[];

  addresses: IAddress[];

  representative: IRepresentative;

  banks: IBank[];

  contacts: IContact[];

  subTypes: IPartnerSubType[];

  isOrganization: boolean;

  receivableDebtAmount: number;
  payableDebtAmount: number;

  totalRevenue: number;
  loyaltyPoints: number;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface PartnerResponse extends ApiResponse {}
