import { createBaseStore } from "@/shared/base/createBaseStore";
import { apiEndpoint } from "@/shared/constants/apiEndpoint";
import { VatDebtReport, vatDebtReportQuery } from "./vatDebtReport.model";

export const useVatDebtReportStore = createBaseStore<VatDebtReport, vatDebtReportQuery>({
  key: "vatdebtreports",
  apiUrl: apiEndpoint.vatDebtReport.base,
  permissionModule: "vatDebtReport",
});
