import { apiEndpoint } from "@/shared/constants/apiEndpoint";
import {
  PartnerDebtReport,
  PartnerDebtQuery,
  PartnerDebtTransaction,
} from "./partnerDebtReport.model";
import { createBaseReportStore } from "@/shared/base/createBaseReportStore";

export const usePartnerDebtReportStore = createBaseReportStore<
  PartnerDebtReport,
  PartnerDebtTransaction,
  PartnerDebtQuery
>({
  key: "partnerDebtReportReport",
  apiUrl: apiEndpoint.partnerDebt.base,
  permissionModule: "partnerDebtReport",
});
