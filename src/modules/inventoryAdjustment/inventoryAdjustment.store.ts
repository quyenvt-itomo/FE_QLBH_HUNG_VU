import { createBaseStore } from "@/shared/base/createBaseStore";
import { apiEndpoint } from "@/shared/constants/apiEndpoint";
import { InventoryAdjustment, InventoryAdjustmentQuery } from "./inventoryAdjustment.model";

export const useInventoryAdjustmentStore = createBaseStore<
  InventoryAdjustment,
  InventoryAdjustmentQuery
>({
  key: "inventoryadjustments",
  apiUrl: apiEndpoint.inventoryAdjustment.base,
  permissionModule: "inventoryAdjustment",
});
