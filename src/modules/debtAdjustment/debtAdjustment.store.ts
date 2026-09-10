import { createBaseStore } from "@/shared/base/createBaseStore";
import { apiEndpoint } from "@/shared/constants/apiEndpoint";
import { DebtAdjustment, DebtAdjustmentQuery } from "./debtAdjustment.model";

export const useDebtAdjustmentStore = createBaseStore<DebtAdjustment, DebtAdjustmentQuery>({
  key: "debtAdjustments",
  apiUrl: apiEndpoint.debtAdjustment.base,
  permissionModule: "debtAdjustment",
});
