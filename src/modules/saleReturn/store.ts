import { createBaseStore } from "@/shared/base/createBaseStore";
import { apiEndpoint } from "@/shared/constants/apiEndpoint";
import { postData } from "@/shared/api/apiClient";
import { buildUrlWithId } from "@/shared/utils/url.util";
import { SaleReturn, SaleReturnQuery } from "./model";

export const useSaleReturnStore = createBaseStore<SaleReturn, SaleReturnQuery, {
  complete?: (id: string) => Promise<void>;
  completeMany?: (ids: string[]) => Promise<void>;
  cancel?: (id: string, reason?: string) => Promise<void>;
  cancelMany?: (ids: string[], reason?: string) => Promise<void>;
}>({
  key: "saleReturns",
  apiUrl: apiEndpoint.order.saleReturn,
  permissionModule: "saleReturn",
  extend: ({ queryClient, notify, onError, onSuccess, can }) => ({
    complete: can("complete")
      ? async (id: string) => {
          try {
            await postData(buildUrlWithId(`${apiEndpoint.order.saleReturn}/:id/complete`, id), {});
            queryClient.invalidateQueries({ queryKey: ["saleReturns"] });
            notify("success", "Hoàn thành phiếu trả hàng thành công");
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
                postData(buildUrlWithId(`${apiEndpoint.order.saleReturn}/:id/complete`, id), {}),
              ),
            );
            queryClient.invalidateQueries({ queryKey: ["saleReturns"] });
            notify("success", "Hoàn thành các phiếu trả hàng thành công");
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
            await postData(buildUrlWithId(`${apiEndpoint.order.saleReturn}/:id/cancel`, id), { reason });
            queryClient.invalidateQueries({ queryKey: ["saleReturns"] });
            notify("success", "Hủy phiếu trả hàng thành công");
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
                postData(buildUrlWithId(`${apiEndpoint.order.saleReturn}/:id/cancel`, id), { reason }),
              ),
            );
            queryClient.invalidateQueries({ queryKey: ["saleReturns"] });
            notify("success", "Hủy các phiếu trả hàng thành công");
            onSuccess?.();
          } catch (error) {
            onError(error);
            throw error;
          }
        }
      : undefined,
  }),
});
