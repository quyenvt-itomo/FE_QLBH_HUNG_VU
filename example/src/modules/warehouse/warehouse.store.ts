import { createBaseStore } from "@/shared/base/createBaseStore";
import { apiEndpoint } from "@/shared/constants/apiEndpoint";
import { Warehouse, WarehouseQuery } from "./warehouse.model";

export const useWarehouseStore = createBaseStore<Warehouse, WarehouseQuery>({
  key: "warehouses",
  apiUrl: apiEndpoint.warehouse.base,
  permissionModule: "warehouse",
});
