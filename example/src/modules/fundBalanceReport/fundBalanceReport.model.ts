import { EntityWithCompany } from "@/shared/base/entity";
import { ApiRequestQuery } from "@/shared/interfaces/api";

export interface fundBalanceReportQuery extends ApiRequestQuery {
  moreQuery?: any;
}

export interface FundBalanceReport extends EntityWithCompany {
  code: string;
  note?: string | null;
  fundId: string | null;
  beginningBalance: number;
  endingBalance: number;
  totalIncome: number;
  totalExpense: number;
  reportDate: string;
}
