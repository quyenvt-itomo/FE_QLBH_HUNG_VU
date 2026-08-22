import { createBaseStore } from "@/shared/base/createBaseStore";
import { apiEndpoint } from "@/shared/constants/apiEndpoint";
import { PurchaseQuotation, PurchaseQuotationQuery } from "./purchaseQuotation.model";
import { getData, postData } from "@/shared/api/apiClient";
import { buildUrlWithId } from "@/shared/utils/url.util";

export const usePurchaseQuotationStore = createBaseStore<
  PurchaseQuotation,
  PurchaseQuotationQuery,
  {
    approve?: (id: string) => Promise<void>;
    reject?: (id: string, rejectReason: string, submitInfo?: boolean) => Promise<void>;

    createPublic: (data: Partial<PurchaseQuotation>) => Promise<PurchaseQuotation | undefined>;
    getByCodePublic: (code: string) => Promise<PurchaseQuotation | undefined>;
  }
>({
  key: "purchaseQuotations",
  apiUrl: apiEndpoint.purchaseQuotation.base,
  permissionModule: "purchaseQuotation",
  extend: ({ queryClient, notify, onSuccess, onError, can }) => ({
    approve: can("approve")
      ? async (id: string) => {
          try {
            await postData(buildUrlWithId(apiEndpoint.purchaseQuotation.approve, id), {});
            queryClient.invalidateQueries({ queryKey: ["purchaseQuotations"] });
            notify("success", "Phê duyệt phiếu thành công");
            onSuccess?.();
          } catch (error: any) {
            onError(error);
          }
        }
      : undefined,
    reject: can("approve")
      ? async (id: string, rejectReason: string, submitInfo?: boolean) => {
          try {
            await postData(buildUrlWithId(apiEndpoint.purchaseQuotation.reject, id), {
              rejectReason,
              submitInfo,
            });
            queryClient.invalidateQueries({ queryKey: ["purchaseQuotations"] });
            notify("success", "Từ chối phiếu thành công");
            onSuccess?.();
          } catch (error: any) {
            onError(error);
          }
        }
      : undefined,
    createPublic: async (data: Partial<PurchaseQuotation>) => {
      try {
        const result = await postData<PurchaseQuotation>(
          apiEndpoint.purchaseQuotation.createPublic,
          data,
        );
        queryClient.invalidateQueries({ queryKey: ["purchaseQuotations"] });
        notify("success", "Tạo báo giá mua thành công");
        onSuccess?.();
        return result?.data;
      } catch (error: any) {
        onError(error);
        throw error;
      }
    },
    getByCodePublic: async (code: string) => {
      try {
        const result = await getData<PurchaseQuotation>(
          apiEndpoint.purchaseQuotation.getByCodePublic.replace(":code", code),
        );
        return result?.data;
      } catch (error: any) {
        onError(error);
        throw error;
      }
    },
  }),
});
