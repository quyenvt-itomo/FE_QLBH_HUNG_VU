import { EntityWithCompany } from "@/shared/base/entity";
import { ApiRequestQuery } from "@/shared/interfaces/api";

export interface commissionDebtReportQuery extends ApiRequestQuery {
  moreQuery?: any;
}

export interface CommissionDebtReport extends EntityWithCompany {
  code: string;
  note?: string | null;
  partnerContactId: string | null;
  beginningBalance: number;
  endingBalance: number;
  totalIncrease: number;
  totalDecrease: number;
  reportDate: string;
}
