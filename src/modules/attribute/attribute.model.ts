import { Entity } from "@/shared/base/entity";
import { ApiRequestQuery } from "@/shared/interfaces/api";
import { AttributeType } from "./attribute.enum";
import { Store } from "../store";

export const DEFAULT_WEIGHT_UNIT = "Kg";
export const DEFAULT_MESH_UNIT = "Tấm";
export const DEFAULT_AREA_UNIT = "m²";

export const INCOME_CUSTOMER = "Thu công nợ khách hàng";
export const INCOME_DEPOSIT = "Thu lãi khoản gửi";
export const INCOME_WITHDRAW = "Rút tiền khoản gửi";
export const INCOME_CAPITAL_CONTRIBUTION = "Góp vốn";

export const EXPENSE_PAYMENT_REQUEST = "Thanh toán theo đề nghị";
export const EXPENSE_LOAN = "Thanh toán dư nợ khoản vay";
export const EXPENSE_INTEREST = "Thanh toán lãi vay";
export const EXPENSE_VAT = "Nộp thuế VAT";
export const EXPENSE_CAPITAL_WITHDRAWAL = "Rút vốn";
export const EXPENSE_PROFIT_DISTRIBUTION = "Phân phối lợi nhuận";

export interface AttributeQuery extends ApiRequestQuery {
  moreQuery?: any;
  type?: AttributeType;
  showStatistics?: boolean;
}

export interface AttributeSnapshot {
  id: string;
  name: string;
  type: AttributeType;
}

export interface Attribute extends Entity {
  name: string;
  type: AttributeType;
  productCount?: number;
  partnerCount?: number;
  incomeExpenseCount?: number;
  incomeExpenseAmount?: number;
  storeId?: string | null;
  store?: Store | null;
  parentId?: string | null;
  parent?: Attribute | null;
  children?: Attribute[];
}
