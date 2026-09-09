import { createBaseStore } from "@/shared/base/createBaseStore";
import { apiEndpoint } from "@/shared/constants/apiEndpoint";
import { StoreTransfer, StoreTransferQuery } from "./storeTransfer.model";

export const useStoreTransferStore = createBaseStore<StoreTransfer, StoreTransferQuery>({
  key: "storeTransfers",
  apiUrl: apiEndpoint.storeTransfer.base,
  permissionModule: "storeTransfer",
});
