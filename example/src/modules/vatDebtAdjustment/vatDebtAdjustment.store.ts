import { createBaseStore } from "@/shared/base/createBaseStore";
import { apiEndpoint } from "@/shared/constants/apiEndpoint";
import { VatDebtAdjustment, vatDebtAdjustmentQuery } from "./vatDebtAdjustment.model";

export const useVatDebtAdjustmentStore = createBaseStore<VatDebtAdjustment, vatDebtAdjustmentQuery>({
  key: "vatdebtadjustments",
  apiUrl: apiEndpoint.vatDebtAdjustment.base,
  permissionModule: "vatDebtAdjustment",
});
