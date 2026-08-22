import { createBaseStore } from "@/shared/base/createBaseStore";
import { apiEndpoint } from "@/shared/constants/apiEndpoint";
import { InventoryConversion, inventoryConversionQuery } from "./inventoryConversion.model";

export const useInventoryConversionStore = createBaseStore<InventoryConversion, inventoryConversionQuery>({
  key: "inventoryconversions",
  apiUrl: apiEndpoint.inventoryConversion.base,
  permissionModule: "inventoryConversion",
});
