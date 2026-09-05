import { createBaseStore } from "@/shared/base/createBaseStore";
import { apiEndpoint } from "@/shared/constants/apiEndpoint";
import { Order, OrderQuery } from "./order.model";
import { postData } from "@/shared/api/apiClient";
import { useSaleStore } from "@/modules/sale/store";
import { useSaleReturnStore } from "@/modules/saleReturn/store";

const createOrderStore = (key: string, apiUrl: string, permissionModule: "sale" | "saleReturn" | "purchase" | "purchaseReturn") => createBaseStore<
  Order,
  OrderQuery,
  { cancel?: (id: string, reason?: string) => void }
>({
  key,
  apiUrl,
  permissionModule,
  extend: ({ notify, queryClient }) => ({
    cancel: async (id: string, reason?: string) => {
      await postData(`${apiUrl}/${id}/cancel`, { reason });
      notify("success", "Hủy đơn hàng thành công");
      queryClient.invalidateQueries({ queryKey: [key] });
    },
  }),
});

export const usePurchaseStore = createOrderStore("purchases", apiEndpoint.order.purchase, "purchase");
export const usePurchaseReturnStore = createOrderStore("purchaseReturns", apiEndpoint.order.purchaseReturn, "purchaseReturn");
export { useSaleStore, useSaleReturnStore };
/** Compatibility alias for old order screens; orders are now split by type. */
export const useOrderStore = useSaleStore;
