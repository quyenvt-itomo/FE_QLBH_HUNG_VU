import { createBaseStore } from "@/shared/base/createBaseStore";
import { apiEndpoint } from "@/shared/constants/apiEndpoint";
import { postData, getData } from "@/shared/api/apiClient";
import { buildUrlWithId } from "@/shared/utils/url.util";
import { QuotationRequest, QuotationRequestQuery } from "./quotationRequest.model";

export const useQuotationRequestStore = createBaseStore<
  QuotationRequest,
  QuotationRequestQuery,
  {
    approve?: (id: string, createPartner?: boolean) => Promise<void>;
    reject?: (id: string, rejectReason: string) => Promise<void>;
    createPublic: (data: Partial<QuotationRequest>) => Promise<QuotationRequest | undefined>;
    getByCodePublic: (code: string) => Promise<QuotationRequest | undefined>;
  }
>({
  key: "quotationRequests",
  apiUrl: apiEndpoint.quotationRequest.base,
  permissionModule: "quotationRequest",
  extend: ({ queryClient, notify, onSuccess, onError, can }) => ({
    approve: can("approve")
      ? async (id: string, createPartner?: boolean) => {
          try {
            await postData(buildUrlWithId(apiEndpoint.quotationRequest.approve, id), {
              createPartner: createPartner ?? false,
            });
            queryClient.invalidateQueries({ queryKey: ["quotationRequests"] });
            notify("success", "Duyệt yêu cầu báo giá thành công");
            onSuccess?.();
          } catch (error: any) {
            onError(error);
          }
        }
      : undefined,
    reject: can("approve")
      ? async (id: string, rejectReason: string) => {
          try {
            await postData(buildUrlWithId(apiEndpoint.quotationRequest.reject, id), {
              rejectReason,
            });
            queryClient.invalidateQueries({ queryKey: ["quotationRequests"] });
            notify("success", "Từ chối yêu cầu báo giá thành công");
            onSuccess?.();
          } catch (error: any) {
            onError(error);
          }
        }
      : undefined,
    createPublic: async (data: Partial<QuotationRequest>) => {
      try {
        const result = await postData<QuotationRequest>(
          apiEndpoint.quotationRequest.createPublic,
          data,
        );
        queryClient.invalidateQueries({ queryKey: ["quotationRequests"] });
        notify("success", "Gửi yêu cầu báo giá thành công");
        onSuccess?.();
        return result?.data;
      } catch (error: any) {
        onError(error);
      }
    },
    getByCodePublic: async (code: string) => {
      try {
        const result = await getData<QuotationRequest>(
          apiEndpoint.quotationRequest.getByCodePublic.replace(":code", code),
        );
        return result?.data;
      } catch (error: any) {
        onError(error);
      }
    },
  }),
});
