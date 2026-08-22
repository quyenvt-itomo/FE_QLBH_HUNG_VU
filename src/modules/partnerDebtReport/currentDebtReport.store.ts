import { apiEndpoint } from "@/shared/constants/apiEndpoint";
import { createBaseCurrentDebtStore } from "@/shared/base/createBaseCurrentDebtStore";
import {
  CurrentDebtQuery,
  PartnerCurrentDebt,
  PartnerDebtInvoice,
} from "./partnerDebtReport.model";

export const useCurrentDebtReportStore = createBaseCurrentDebtStore<
  PartnerCurrentDebt,
  PartnerDebtInvoice,
  CurrentDebtQuery
>({
  key: "currentDebtReport",
  apiUrl: apiEndpoint.partnerDebt.base,
  permissionModule: "partnerDebtReport",
});
