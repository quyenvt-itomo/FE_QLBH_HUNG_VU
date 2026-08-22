import { apiEndpoint } from "@/shared/constants/apiEndpoint";
import { InventoryReport, InventoryQuery, InventoryTransaction } from "./inventory.model";
import { createBaseReportStore } from "@/shared/base/createBaseReportStore";

export const useInventoryReportStore = createBaseReportStore<
  InventoryReport,
  InventoryTransaction,
  InventoryQuery
>({
  key: "inventoryReport",
  apiUrl: apiEndpoint.inventory.base,
  permissionModule: "inventoryReport",
});
