import { apiEndpoint } from "@/shared/constants/apiEndpoint";
import { PartnerDebtReport, PartnerDebtQuery, DebtTransaction } from "./partnerDebtReport.model";
import { createBaseReportStore } from "@/shared/base/createBaseReportStore";

export const usePartnerDebtReportStore = createBaseReportStore<
  PartnerDebtReport,
  DebtTransaction,
  PartnerDebtQuery
>({
  key: "partnerDebtReportReport",
  apiUrl: apiEndpoint.partnerDebt.base,
  permissionModule: "partnerDebtReport",
});
