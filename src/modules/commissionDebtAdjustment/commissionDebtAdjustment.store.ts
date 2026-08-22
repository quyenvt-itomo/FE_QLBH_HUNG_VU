import { createBaseStore } from "@/shared/base/createBaseStore";
import { apiEndpoint } from "@/shared/constants/apiEndpoint";
import { CommissionDebtAdjustment, commissionDebtAdjustmentQuery } from "./commissionDebtAdjustment.model";

export const useCommissionDebtAdjustmentStore = createBaseStore<CommissionDebtAdjustment, commissionDebtAdjustmentQuery>({
  key: "commissiondebtadjustments",
  apiUrl: apiEndpoint.commissionDebtAdjustment.base,
  permissionModule: "commissionDebtAdjustment",
});
