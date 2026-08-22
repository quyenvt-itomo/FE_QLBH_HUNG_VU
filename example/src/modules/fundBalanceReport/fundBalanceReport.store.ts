import { createBaseStore } from "@/shared/base/createBaseStore";
import { apiEndpoint } from "@/shared/constants/apiEndpoint";
import { FundBalanceReport, fundBalanceReportQuery } from "./fundBalanceReport.model";

export const useFundBalanceReportStore = createBaseStore<FundBalanceReport, fundBalanceReportQuery>({
  key: "fundbalancereports",
  apiUrl: apiEndpoint.fundBalanceReport.base,
  permissionModule: "fundBalanceReport",
});
