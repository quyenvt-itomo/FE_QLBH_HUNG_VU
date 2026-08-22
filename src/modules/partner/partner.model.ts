import { Entity } from "@/shared/base/entity";
import { ApiRequestQuery } from "@/shared/interfaces/api";
import { Address, BankAccount, Representative } from "@/shared/interfaces/common";
import { getOptionsByMap } from "@/shared/constants/enum";
import { Attribute } from "../attribute";
import { Employee } from "../employee";
import { PaymentTerm } from "../paymentTerm";
import { PartnerContact } from "../partnerContact";

export enum PartnerType {
  CUSTOMER = "customer",
  SUPPLIER = "supplier",
  SHIPPING_PROVIDER = "shipping_provider",
}

export const partnerTypeMap: Record<PartnerType, string> = {
  [PartnerType.CUSTOMER]: "Khách hàng",
  [PartnerType.SUPPLIER]: "Nhà cung cấp",
  [PartnerType.SHIPPING_PROVIDER]: "Đơn vị vận chuyển",
};

export const partnerTypeOptions = getOptionsByMap(partnerTypeMap);

export interface PartnerQuery extends ApiRequestQuery {
  moreQuery?: any;
  types?: PartnerType[];
  groupId?: string;
  staffId?: string;
  isActive?: boolean;
  sourceBranchId?: string;
}

export interface PartnerSnapshot {
  id: string;
  name: string;
  code: string;
  taxCode: string | null;
  types: PartnerType[];
  email?: string | null;
  phone?: string | null;
  address: Address | null;
  representative: Representative | null;
}

export interface Partner extends Entity {
  groupId: string | null;
  group: Attribute | null;
  code: string;
  name: string;
  types: PartnerType[];

  taxCode: string | null;
  address: Address | null;

  staffId: string | null;
  staff: Employee | null;

  representative: Representative | null;
  banks: BankAccount[];

  email: string | null;
  phone: string | null;
  zaloLink: string | null;

  sourceBranchId: string | null;

  paymentTermId: string | null;
  paymentTerm: PaymentTerm | null;

  contacts: PartnerContact[];
}
