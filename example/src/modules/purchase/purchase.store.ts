import { createBaseStore } from "@/shared/base/createBaseStore";
import { apiEndpoint } from "@/shared/constants/apiEndpoint";
import { postData } from "@/shared/api/apiClient";
import { Purchase, PurchaseQuery } from "./purchase.model";
import { buildUrlWithId } from "@/shared/utils/url.util";

export const usePurchaseStore = createBaseStore<
  Purchase,
  PurchaseQuery,
  {
    approve?: (id: string) => Promise<void>;
    reject?: (id: string, rejectReason: string) => Promise<void>;
    confirmComplete?: (id: string) => Promise<void>;
  }
>({
  key: "purchases",
  apiUrl: apiEndpoint.purchase.base,
  permissionModule: "purchase",
  extend: ({ queryClient, notify, onSuccess, onError, can }) => ({
    approve: can("approve")
      ? async (id: string) => {
          try {
            await postData(buildUrlWithId(apiEndpoint.purchase.approve, id), {});
            queryClient.invalidateQueries({ queryKey: ["purchases"] });
            notify("success", "Phê duyệt đơn mua hàng thành công");
            onSuccess?.();
          } catch (error: any) {
            onError(error);
          }
        }
      : undefined,
    reject: can("approve")
      ? async (id: string, rejectReason: string) => {
          try {
            await postData(buildUrlWithId(apiEndpoint.purchase.reject, id), {
              rejectReason,
            });
            queryClient.invalidateQueries({ queryKey: ["purchases"] });
            notify("success", "Từ chối đơn mua hàng thành công");
            onSuccess?.();
          } catch (error: any) {
            onError(error);
          }
        }
      : undefined,
    confirmComplete: can("complete")
      ? async (id: string) => {
          try {
            const result = await postData(
              buildUrlWithId(apiEndpoint.purchase.confirmComplete, id),
              {},
            );
            queryClient.invalidateQueries({ queryKey: ["purchases"] });
            notify("success", "Hoàn thành đơn mua hàng");
            onSuccess?.();
          } catch (error: any) {
            onError(error);
          }
        }
      : undefined,
  }),
});
