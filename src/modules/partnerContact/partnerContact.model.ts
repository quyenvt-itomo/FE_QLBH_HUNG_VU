import { Entity } from "@/shared/base/entity";
import { ApiRequestQuery } from "@/shared/interfaces/api";
import { BankAccount } from "@/shared/interfaces/common";
import { Partner } from "../partner/partner.model";

export interface PartnerContactQuery extends ApiRequestQuery {
  moreQuery?: any;
  partnerId?: string;
}

export interface PartnerContactSnapshot {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  identityCode: string | null;
}

export interface PartnerContact extends Entity {
  partnerId: string;
  partner: Partner;

  name: string;
  phone: string | null;
  email: string | null;
  identityCode: string | null;
  banks: BankAccount[];
}
