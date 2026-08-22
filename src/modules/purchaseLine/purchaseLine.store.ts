import { createBaseStore } from "@/shared/base/createBaseStore";
import { apiEndpoint } from "@/shared/constants/apiEndpoint";
import { PurchaseLine, PurchaseLineQuery } from "./purchaseLine.model";

export const usePurchaseLineStore = createBaseStore<PurchaseLine, PurchaseLineQuery>({
  key: "purchaseLines",
  apiUrl: apiEndpoint.purchaseLine.base,
  permissionModule: "purchase",
});
