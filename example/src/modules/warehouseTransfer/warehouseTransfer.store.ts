import { createBaseStore } from "@/shared/base/createBaseStore";
import { apiEndpoint } from "@/shared/constants/apiEndpoint";
import { WarehouseTransfer, warehouseTransferQuery } from "./warehouseTransfer.model";

export const useWarehouseTransferStore = createBaseStore<WarehouseTransfer, warehouseTransferQuery>({
  key: "warehousetransfers",
  apiUrl: apiEndpoint.warehouseTransfer.base,
  permissionModule: "warehouseTransfer",
});
