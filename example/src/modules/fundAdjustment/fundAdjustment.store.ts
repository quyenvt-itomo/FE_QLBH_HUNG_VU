import { createBaseStore } from "@/shared/base/createBaseStore";
import { apiEndpoint } from "@/shared/constants/apiEndpoint";
import { FundAdjustment, fundAdjustmentQuery } from "./fundAdjustment.model";

export const useFundAdjustmentStore = createBaseStore<FundAdjustment, fundAdjustmentQuery>({
  key: "fundadjustments",
  apiUrl: apiEndpoint.fundAdjustment.base,
  permissionModule: "fundAdjustment",
});
