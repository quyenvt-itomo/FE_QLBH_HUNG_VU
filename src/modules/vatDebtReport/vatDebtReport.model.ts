import { EntityWithStore } from "@/shared/base/entity";
import { ApiRequestQuery } from "@/shared/interfaces/api";

export interface vatDebtReportQuery extends ApiRequestQuery {
  moreQuery?: any;
}

export interface VatDebtReport extends EntityWithStore {
  code: string;
  note?: string | null;
  reportDate: string;
  beginningBalance: number;
  endingBalance: number;
  totalInput: number;
  totalOutput: number;
}
