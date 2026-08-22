import { createBaseStore } from "@/shared/base/createBaseStore";
import { apiEndpoint } from "@/shared/constants/apiEndpoint";
import { CommissionDebtReport, commissionDebtReportQuery } from "./commissionDebtReport.model";

export const useCommissionDebtReportStore = createBaseStore<
  CommissionDebtReport,
  commissionDebtReportQuery
>({
  key: "commissiondebtreports",
  apiUrl: apiEndpoint.commissionDebt.base,
  permissionModule: "commissionDebtReport",
});
