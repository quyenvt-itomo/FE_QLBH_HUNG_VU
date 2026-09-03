import { Entity } from "@/shared/base/entity";
import { ApiRequestQuery } from "@/shared/interfaces/api";
import {
  Address,
  BankAccount,
  FilterKey,
  Representative,
  RangerItem,
  SortItem,
} from "@/shared/interfaces/common";
import { Gender, genderOptions, getOptionsByMap } from "@/shared/constants/enum";
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
  gender?: Gender[];
  states?: string[];
  wards?: string[];
  createdAtGte?: string;
  createdAtLte?: string;
  dobGte?: string;
  dobLte?: string;
  lastTransactionAtGte?: string;
  lastTransactionAtLte?: string;
  currentDebtAmountGte?: number;
  currentDebtAmountLte?: number;
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
  address: Address | null;
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
  address: Address | null;
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
  currentDebtAmount?: number;
  lastTransactionAt?: string | null;
}

export const getSortItems = (type: PartnerType): SortItem[] => {
  const text = partnerTypeMap[type]?.toLowerCase() || "đối tác";

  const items: SortItem[] = [
    { label: "Ngày tạo", value: "createdAt", ascLabel: "Mới nhất", descLabel: "Cũ nhất" },
    { label: `Mã ${text}`, value: "code", ascLabel: "A → Z", descLabel: "Z → A" },
    { label: `Tên ${text}`, value: "name", ascLabel: "A → Z", descLabel: "Z → A" },
    { label: "Ngày giao dịch cuối", value: "lastTransactionAt", ascLabel: "Cũ nhất", descLabel: "Mới nhất" },
    { label: "Nợ hiện tại", value: "currentDebtAmount", ascLabel: "Thấp nhất", descLabel: "Cao nhất" },
  ];

  if (type === PartnerType.SHIPPER) {
    return items.slice(0, 3);
  }

  if (type === PartnerType.SUPPLIER) {
    return [...items.slice(0, 3), items[4]];
  }

  return items;
};

export const getRangerItems = (type: PartnerType): RangerItem[] => {
  const items: RangerItem[] = [
    { key: "createdAt", label: "Ngày tạo", type: "date" },
    { key: "currentDebtAmount", label: "Nợ hiện tại", type: "number" },
  ];

  if (type === PartnerType.CUSTOMER) {
    items.splice(1, 0, { key: "dob", label: "Ngày sinh", type: "date" });
    items.splice(2, 0, {
      key: "lastTransactionAt",
      label: "Ngày giao dịch lần cuối",
      type: "date",
    });
  }

  return items;
};

export const partnerClassificationOptions = [
  { label: "Cá nhân", key: "individual" },
  { label: "Tổ chức", key: "organization" },
];

export const partnerGenderOptions = genderOptions.map((item) => ({
  label: item.label,
  key: item.value,
}));

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
