import { createBaseStore } from "@/shared/base/createBaseStore";
import { apiEndpoint } from "@/shared/constants/apiEndpoint";
import { OrderLine, OrderLineQuery } from "./orderLine.model";

export const useOrderLineStore = createBaseStore<OrderLine, OrderLineQuery>({
  key: "orderLines",
  apiUrl: apiEndpoint.orderLine.base,
  permissionModule: "order",
});
