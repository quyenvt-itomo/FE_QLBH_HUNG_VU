import { Entity } from "@/shared/base/entity";
import { ApiRequestQuery } from "@/shared/interfaces/api";
import { Address, BankAccount, Representative } from "@/shared/interfaces/common";
import { getOptionsByMap } from "@/shared/constants/enum";
import type { Attribute } from "../attribute/attribute.model";
import type { PartnerContact } from "../partnerContact/partnerContact.model";

export enum PartnerType {
  CUSTOMER = "customer",
  SUPPLIER = "supplier",
  SHIPPER = "shipper",
}
export const partnerTypeMap: Record<PartnerType, string> = {
  [PartnerType.CUSTOMER]: "Khách hàng",
  [PartnerType.SUPPLIER]: "Nhà cung cấp",
  [PartnerType.SHIPPER]: "Đơn vị vận chuyển",
};
export const partnerTypeOptions = getOptionsByMap(partnerTypeMap);

export interface PartnerQuery extends ApiRequestQuery {
  storeId?: string;
  type?: PartnerType;
  types?: PartnerType[];
  groupId?: string;
}
export interface PartnerSnapshot {
  id: string;
  type: PartnerType;
  groupId: string | null;
  isOrganization: boolean;
  name: string;
  code: string;
  email: string | null;
  phone: string | null;
  taxCode: string | null;
  addresses: Address[];
  address?: Address;
  representative: Representative | null;
  banks: BankAccount[];
}
export interface Partner extends Entity {
  type: PartnerType;
  groupId: string | null;
  group?: Attribute | null;
  isOrganization: boolean;
  name: string;
  code: string;
  email: string | null;
  phone: string | null;
  taxCode: string | null;
  addresses: Address[];
  /** Legacy single-address alias for retired public quotation screens. */
  address?: Address;
  representative: Representative | null;
  banks: BankAccount[];
  maxDebtAmount: number | null;
  contacts?: PartnerContact[];
  /** Legacy read-only aliases while old report components are retired. */
  types?: PartnerType[];
  staffId?: string | null;
  staff?: { code?: string; name?: string } | null;
  zaloLink?: string | null;
  paymentTerm?: { maxDebtAmount?: number; maxDebtDays?: number; depositRate?: number } | null;
}
