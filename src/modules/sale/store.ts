import { createBaseStore } from "@/shared/base/createBaseStore";
import { apiEndpoint } from "@/shared/constants/apiEndpoint";
import { postData } from "@/shared/api/apiClient";
import { buildUrlWithId } from "@/shared/utils/url.util";
import { Sale, SaleQuery } from "./model";

export const useSaleStore = createBaseStore<Sale, SaleQuery, {
  complete?: (id: string) => Promise<void>;
  completeMany?: (ids: string[]) => Promise<void>;
  cancel?: (id: string, reason?: string) => Promise<void>;
  cancelMany?: (ids: string[], reason?: string) => Promise<void>;
}>({
  key: "sales",
  apiUrl: apiEndpoint.order.sale,
  permissionModule: "sale",
  extend: ({ queryClient, notify, onError, onSuccess, can }) => ({
    complete: can("complete")
      ? async (id: string) => {
          try {
            await postData(buildUrlWithId(`${apiEndpoint.order.sale}/:id/complete`, id), {});
            queryClient.invalidateQueries({ queryKey: ["sales"] });
            notify("success", "Hoàn thành đơn bán hàng thành công");
            onSuccess?.();
          } catch (error) {
            onError(error);
            throw error;
          }
        }
      : undefined,
    completeMany: can("complete")
      ? async (ids: string[]) => {
          try {
            await Promise.all(
              ids.map((id) =>
                postData(buildUrlWithId(`${apiEndpoint.order.sale}/:id/complete`, id), {}),
              ),
            );
            queryClient.invalidateQueries({ queryKey: ["sales"] });
            notify("success", "Hoàn thành các đơn bán hàng thành công");
            onSuccess?.();
          } catch (error) {
            onError(error);
            throw error;
          }
        }
      : undefined,
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
    cancelMany: can("update")
      ? async (ids: string[], reason?: string) => {
          try {
            await Promise.all(
              ids.map((id) =>
                postData(buildUrlWithId(`${apiEndpoint.order.sale}/:id/cancel`, id), { reason }),
              ),
            );
            queryClient.invalidateQueries({ queryKey: ["sales"] });
            notify("success", "Hủy các đơn bán hàng thành công");
            onSuccess?.();
          } catch (error) {
            onError(error);
            throw error;
          }
        }
      : undefined,
  }),
});
