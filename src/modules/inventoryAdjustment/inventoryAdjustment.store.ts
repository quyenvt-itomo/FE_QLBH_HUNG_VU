import { createBaseStore } from "@/shared/base/createBaseStore";
import { apiEndpoint } from "@/shared/constants/apiEndpoint";
import { InventoryAdjustment, inventoryAdjustmentQuery } from "./inventoryAdjustment.model";

export const useInventoryAdjustmentStore = createBaseStore<InventoryAdjustment, inventoryAdjustmentQuery>({
  key: "inventoryadjustments",
  apiUrl: apiEndpoint.inventoryAdjustment.base,
  permissionModule: "inventoryAdjustment",
});
