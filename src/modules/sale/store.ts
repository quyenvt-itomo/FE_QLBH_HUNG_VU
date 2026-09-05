import { createBaseStore } from "@/shared/base/createBaseStore";
import { apiEndpoint } from "@/shared/constants/apiEndpoint";
import { postData } from "@/shared/api/apiClient";
import { buildUrlWithId } from "@/shared/utils/url.util";
import { Sale, SaleQuery } from "./model";

export const useSaleStore = createBaseStore<Sale, SaleQuery, {
  cancel?: (id: string, reason?: string) => Promise<void>;
}>({
  key: "sales",
  apiUrl: apiEndpoint.order.sale,
  permissionModule: "sale",
  extend: ({ queryClient, notify, onError, onSuccess, can }) => ({
    cancel: can("update")
      ? async (id: string, reason?: string) => {
          try {
            await postData(buildUrlWithId(`${apiEndpoint.order.sale}/:id/cancel`, id), { reason });
            queryClient.invalidateQueries({ queryKey: ["sales"] });
            notify("success", "Hủy đơn bán thành công");
            onSuccess?.();
          } catch (error) {
            onError(error);
            throw error;
          }
        }
      : undefined,
  }),
});
