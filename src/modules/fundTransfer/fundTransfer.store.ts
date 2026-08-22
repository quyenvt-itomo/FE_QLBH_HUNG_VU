import { createBaseStore } from "@/shared/base/createBaseStore";
import { apiEndpoint } from "@/shared/constants/apiEndpoint";
import { FundTransfer, FundTransferQuery } from "./fundTransfer.model";

export const useFundTransferStore = createBaseStore<FundTransfer, FundTransferQuery>({
  key: "fundtransfers",
  apiUrl: apiEndpoint.fundTransfer.base,
  permissionModule: "fundTransfer",
});
