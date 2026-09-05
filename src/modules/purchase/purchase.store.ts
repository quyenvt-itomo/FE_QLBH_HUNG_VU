import { createBaseStore } from "@/shared/base/createBaseStore";
import { apiEndpoint } from "@/shared/constants/apiEndpoint";
import { postData } from "@/shared/api/apiClient";
import { buildUrlWithId } from "@/shared/utils/url.util";
import { Purchase, PurchaseQuery } from "./purchase.model";

export const usePurchaseStore = createBaseStore<Purchase, PurchaseQuery, {
  cancel?: (id: string) => Promise<void>;
  complete?: (id: string) => Promise<void>;
}>({
  key: "purchases",
  apiUrl: apiEndpoint.order.purchase,
  permissionModule: "purchase",
  extend: ({ queryClient, notify, onError, onSuccess, can }) => ({
    cancel: can("update")
      ? async (id: string) => {
          try {
            await postData(buildUrlWithId(`${apiEndpoint.order.purchase}/:id/cancel`, id), {});
            queryClient.invalidateQueries({ queryKey: ["purchases"] });
            notify("success", "Hủy phiếu nhập thành công");
            onSuccess?.();
          } catch (error) {
            onError(error);
            throw error;
          }
        }
      : undefined,
    complete: can("complete")
      ? async (id: string) => {
          try {
            await postData(buildUrlWithId(`${apiEndpoint.order.purchase}/:id/complete`, id), {});
            queryClient.invalidateQueries({ queryKey: ["purchases"] });
            notify("success", "Nhập kho và hoàn thành phiếu thành công");
            onSuccess?.();
          } catch (error) {
            onError(error);
            throw error;
          }
        }
      : undefined,
  }),
});
