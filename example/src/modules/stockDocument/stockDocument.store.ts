import { createBaseStore } from "@/shared/base/createBaseStore";
import { apiEndpoint } from "@/shared/constants/apiEndpoint";
import { postData } from "@/shared/api/apiClient";
import {
  ConfirmBillingPayload,
  ConfirmExportDto,
  ConfirmImportDto,
  StockDocument,
  StockDocumentQuery,
} from "./stockDocument.model";

export const useStockDocumentStore = createBaseStore<
  StockDocument,
  StockDocumentQuery,
  {
    confirmImport?: (id: string, payload: ConfirmImportDto) => Promise<StockDocument | undefined>;
    confirmExport?: (id: string, payload: ConfirmExportDto) => Promise<StockDocument | undefined>;
    complete?: (id: string, payload: ConfirmBillingPayload) => Promise<StockDocument | undefined>;
    cancel?: (id: string, reason?: string) => Promise<void>;
  }
>({
  key: "stockDocuments",
  apiUrl: apiEndpoint.stockDocument.base,
  permissionModule: "stockDocument",
  extend: ({ queryClient, notify, onSuccess, onError, can }) => ({
    confirmImport: can("confirmImport")
      ? async (id: string, payload: ConfirmImportDto) => {
          try {
            const result = await postData<StockDocument>(
              `${apiEndpoint.stockDocument.base}/${id}/confirm-import`,
              payload,
            );
            queryClient.invalidateQueries({ queryKey: ["stockDocuments"] });
            notify("success", "Xác nhận nhập kho thành công");
            onSuccess?.();
            return result.data;
          } catch (error) {
            onError(error);
            throw error;
          }
        }
      : undefined,
    confirmExport: can("confirmExport")
      ? async (id: string, payload: ConfirmExportDto) => {
          try {
            const result = await postData<StockDocument>(
              `${apiEndpoint.stockDocument.base}/${id}/confirm-export`,
              payload,
            );
            queryClient.invalidateQueries({ queryKey: ["stockDocuments"] });
            notify("success", "Xác nhận xuất kho thành công");
            onSuccess?.();
            return result.data;
          } catch (error) {
            onError(error);
            throw error;
          }
        }
      : undefined,
    complete: can("complete")
      ? async (id: string, payload: ConfirmBillingPayload) => {
          try {
            const result = await postData<StockDocument>(
              `${apiEndpoint.stockDocument.base}/${id}/confirm-import`,
              payload,
            );
            notify("success", "Hoàn thành phiếu thành công");
            queryClient.invalidateQueries({ queryKey: ["stockDocuments"] });
            onSuccess?.();
            return result.data;
          } catch (error) {
            onError(error);
            throw error;
          }
        }
      : undefined,
    cancel: async (id: string, reason?: string) => {
      try {
        await postData(`${apiEndpoint.stockDocument.base}/${id}/cancel`, { reason });
        notify("success", "Hủy phiếu thành công");
        queryClient.invalidateQueries({ queryKey: ["stockDocuments"] });
      } catch (error) {
        onError(error);
      }
    },
  }),
});
