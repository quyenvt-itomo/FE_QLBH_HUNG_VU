import { EntityWithStore } from "@/shared/base/entity";
import { getOptionsByMap } from "@/shared/constants/enum";
import { ApiRequestQuery } from "@/shared/interfaces/api";
import { BankAccount } from "@/shared/interfaces/common";

export enum FundTypeEnum {
  CASH = "cash",
  BANK = "bank",
}
export const fundTypeMap: Record<FundTypeEnum, string> = {
  [FundTypeEnum.CASH]: "Tiền mặt",
  [FundTypeEnum.BANK]: "Ngân hàng",
};
export const fundTypeOptions = getOptionsByMap(fundTypeMap);

export interface fundQuery extends ApiRequestQuery {
  moreQuery?: any;
}

export interface FundSnapshot {
  id: string;
  code: string;
  name: string;
  type: FundTypeEnum;
  bankAccount: BankAccount | null;
  isActive: boolean;
  storeId: string | null;
}

export interface Fund extends EntityWithStore {
  code: string;
  note?: string | null;
  name: string;
  type: string;
  bankAccount: any | null;
  isActive: boolean;
  currentBalance?: number;
}
