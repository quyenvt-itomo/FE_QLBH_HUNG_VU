import { createBaseStore } from "@/shared/base/createBaseStore";
import { apiEndpoint } from "@/shared/constants/apiEndpoint";
import { BillOfMaterial, BOMQuery } from "./billOfMaterial.model";

export const useBillOfMaterialStore = createBaseStore<BillOfMaterial, BOMQuery>({
  key: "billOfMaterials",
  apiUrl: apiEndpoint.billOfMaterial.base,
  permissionModule: "bom",
});
