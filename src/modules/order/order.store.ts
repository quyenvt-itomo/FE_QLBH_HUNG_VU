import { createBaseStore } from "@/shared/base/createBaseStore";
import { apiEndpoint } from "@/shared/constants/apiEndpoint";
import { Order, OrderQuery } from "./order.model";
import { postData } from "@/shared/api/apiClient";

export const useOrderStore = createBaseStore<
  Order,
  OrderQuery,
  { cancel?: (id: string, reason?: string) => void }
>({
  key: "orders",
  apiUrl: apiEndpoint.order.base,
  permissionModule: "order",
  extend: ({ notify, queryClient }) => ({
    cancel: async (id: string, reason?: string) => {
      await postData(`${apiEndpoint.order.base}/${id}/cancel`, { reason });
      notify("success", "Hủy đơn hàng thành công");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  }),
});
