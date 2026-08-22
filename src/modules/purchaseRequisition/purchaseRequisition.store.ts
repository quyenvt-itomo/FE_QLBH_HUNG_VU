import { createBaseStore } from "@/shared/base/createBaseStore";
import { apiEndpoint } from "@/shared/constants/apiEndpoint";
import { PurchaseRequisition, PurchaseRequisitionQuery } from "./purchaseRequisition.model";
import { postData } from "@/shared/api/apiClient";
import { buildUrlWithId } from "@/shared/utils/url.util";

export const usePurchaseRequisitionStore = createBaseStore<
  PurchaseRequisition,
  PurchaseRequisitionQuery,
  {
    approve?: (id: string) => Promise<void>;
    reject?: (id: string, rejectReason: string) => Promise<void>;
  }
>({
  key: "purchaseRequisitions",
  apiUrl: apiEndpoint.purchaseRequisition.base,
  permissionModule: "purchaseRequisition",
  extend: ({ queryClient, notify, onSuccess, onError, can }) => ({
    approve: can("approve")
      ? async (id: string) => {
          try {
            await postData(buildUrlWithId(apiEndpoint.purchaseRequisition.approve, id), {});
            queryClient.invalidateQueries({ queryKey: ["purchaseRequisitions"] });
            notify("success", "Phê duyệt phiếu thành công");
            onSuccess?.();
          } catch (error: any) {
            onError(error);
          }
        }
      : undefined,
    reject: can("approve")
      ? async (id: string, rejectReason: string) => {
          try {
            await postData(buildUrlWithId(apiEndpoint.purchaseRequisition.reject, id), {
              rejectReason,
            });
            queryClient.invalidateQueries({ queryKey: ["purchaseRequisitions"] });
            notify("success", "Từ chối phiếu thành công");
            onSuccess?.();
          } catch (error: any) {
            onError(error);
          }
        }
      : undefined,
  }),
});
