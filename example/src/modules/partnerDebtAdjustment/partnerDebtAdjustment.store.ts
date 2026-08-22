import { createBaseStore } from "@/shared/base/createBaseStore";
import { apiEndpoint } from "@/shared/constants/apiEndpoint";
import { PartnerDebtAdjustment, partnerDebtAdjustmentQuery } from "./partnerDebtAdjustment.model";

export const usePartnerDebtAdjustmentStore = createBaseStore<PartnerDebtAdjustment, partnerDebtAdjustmentQuery>({
  key: "partnerdebtadjustments",
  apiUrl: apiEndpoint.partnerDebtAdjustment.base,
  permissionModule: "partnerDebtAdjustment",
});
