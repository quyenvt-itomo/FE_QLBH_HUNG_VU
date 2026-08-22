import { createBaseStore } from "@/shared/base/createBaseStore";
import { apiEndpoint } from "@/shared/constants/apiEndpoint";
import { postData } from "@/shared/api/apiClient";
import { Quotation, QuotationQuery } from "./quotation.model";

export const useQuotationStore = createBaseStore<
  Quotation,
  QuotationQuery,
  {
    approve?: (id: string) => Promise<void>;
    reject?: (id: string, rejectReason: string) => Promise<void>;
    customerApprove?: (id: string) => Promise<void>;
    customerReject?: (id: string, rejectReason: string) => Promise<void>;
  }
>({
  key: "quotations",
  apiUrl: apiEndpoint.quotation.base,
  permissionModule: "quotation",
  extend: ({ notify, queryClient }) => ({
    approve: async (id: string) => {
      await postData(`${apiEndpoint.quotation.base}/${id}/approve`, {});
      notify("success", "Duyệt báo giá thành công");
      queryClient.invalidateQueries({ queryKey: ["quotations"] });
    },
    reject: async (id: string, rejectReason: string) => {
      await postData(`${apiEndpoint.quotation.base}/${id}/reject`, {
        rejectReason,
      });
      notify("success", "Từ chối báo giá thành công");
      queryClient.invalidateQueries({ queryKey: ["quotations"] });
    },
    customerApprove: async (id: string) => {
      await postData(`${apiEndpoint.quotation.base}/${id}/customer-approve`, {});
      notify("success", "KH đã duyệt báo giá");
      queryClient.invalidateQueries({ queryKey: ["quotations"] });
    },
    customerReject: async (id: string, rejectReason: string) => {
      await postData(`${apiEndpoint.quotation.base}/${id}/customer-reject`, {
        rejectReason,
      });
      notify("success", "KH đã từ chối báo giá");
      queryClient.invalidateQueries({ queryKey: ["quotations"] });
    },
  }),
});
