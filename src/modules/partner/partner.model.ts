import { Entity } from "@/shared/base/entity";
import { ApiRequestQuery } from "@/shared/interfaces/api";
import {
  Address,
  BankAccount,
  FilterKey,
  Representative,
  SortItem,
} from "@/shared/interfaces/common";
import { Gender, getOptionsByMap } from "@/shared/constants/enum";
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
  isOrganization?: boolean;
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
  identityCode: string | null;
  gender: Gender | null;
  dob: any;
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
  identityCode: string | null;
  gender: Gender | null;
  dob: any;
  addresses: Address[];
  /** Legacy single-address alias for retired public quotation screens. */
  address?: Address;
  representative: Representative | null;
  banks: BankAccount[];
  maxDebtAmount: number | null;
  paymentTerm?: {
    maxDebtAmount?: number | null;
    maxDebtDays?: number | null;
    depositRate?: number | null;
  } | null;
  contacts?: PartnerContact[];
  /** Legacy read-only aliases while old report components are retired. */
  types?: PartnerType[];
  staffId?: string | null;
  staff?: { code?: string; name?: string } | null;
  zaloLink?: string | null;

  payableDebtAmount?: number;
  receivableDebtAmount?: number;
}

export const getSortItems = (type: PartnerType): SortItem[] => {
  const text = partnerTypeMap[type]?.toLowerCase() || "đối tác";

  return [
    { label: "Ngày tạo", value: "createdAt", ascLabel: "Mới nhất", descLabel: "Cũ nhất" },
    { label: `Mã ${text}`, value: "code", ascLabel: "A → Z", descLabel: "Z → A" },
    { label: `Tên ${text}`, value: "name", ascLabel: "A → Z", descLabel: "Z → A" },
  ];
};

export const getFilterUses = (type: PartnerType): FilterKey[] => {
  const result: FilterKey[] = ["creatorIds"];

  switch (type) {
    case PartnerType.CUSTOMER:
      result.push("customerGroupIds");
      break;
    case PartnerType.SUPPLIER:
      result.push("supplierGroupIds");
      break;
    case PartnerType.SHIPPER:
      result.push("shipperGroupIds");
      break;

    default:
      break;
  }

  return result;
};
