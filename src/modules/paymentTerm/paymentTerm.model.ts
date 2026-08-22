import { EntityWithCompany } from "@/shared/base/entity";
import { ApiRequestQuery } from "@/shared/interfaces/api";

export interface PaymentTermQuery extends ApiRequestQuery {
  moreQuery?: any;
}

export interface PaymentTerm extends EntityWithCompany {
  code: string;
  name: string;
  depositRate: number;
  maxDebtDays: number;
  maxDebtAmount: number;
}
