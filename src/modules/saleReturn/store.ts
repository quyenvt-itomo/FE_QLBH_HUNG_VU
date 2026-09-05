import { createBaseStore } from "@/shared/base/createBaseStore";
import { apiEndpoint } from "@/shared/constants/apiEndpoint";
import { postData } from "@/shared/api/apiClient";
import { buildUrlWithId } from "@/shared/utils/url.util";
import { SaleReturn, SaleReturnQuery } from "./model";

export const useSaleReturnStore = createBaseStore<SaleReturn, SaleReturnQuery, {
  cancel?: (id: string, reason?: string) => Promise<void>;
}>({
  key: "saleReturns",
  apiUrl: apiEndpoint.order.saleReturn,
  permissionModule: "saleReturn",
  extend: ({ queryClient, notify, onError, onSuccess, can }) => ({
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
  }),
});
