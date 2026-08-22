import { createBaseStore } from "@/shared/base/createBaseStore";
import { apiEndpoint } from "@/shared/constants/apiEndpoint";
import { PartnerDebtOffset, partnerDebtOffsetQuery } from "./partnerDebtOffset.model";

export const usePartnerDebtOffsetStore = createBaseStore<PartnerDebtOffset, partnerDebtOffsetQuery>({
  key: "partnerdebtoffsets",
  apiUrl: apiEndpoint.partnerDebtOffset.base,
  permissionModule: "partnerDebtOffset",
});
