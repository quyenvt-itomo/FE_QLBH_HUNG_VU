import { createBaseStore } from "@/shared/base/createBaseStore";
import { apiEndpoint } from "@/shared/constants/apiEndpoint";
import { postData } from "@/shared/api/apiClient";
import { Production, ProductionQuery } from "./production.model";

export const useProductionStore = createBaseStore<
  Production,
  ProductionQuery,
  { confirm?: (id: string) => void; start?: (id: string) => void; complete?: (id: string) => void; cancel?: (id: string, reason?: string) => void; exportProduction?: (id: string, payload: any) => void; importProduction?: (id: string, payload: any) => void }
>({
  key: "productions",
  apiUrl: apiEndpoint.production.base,
  permissionModule: "production",
  extend: ({ notify, queryClient }) => ({
    confirm: async (id: string) => { await postData(`${apiEndpoint.production.base}/${id}/confirm`, {}); notify("success", "Xác nhận thành công"); queryClient.invalidateQueries({ queryKey: ["productions"] }); },
    start: async (id: string) => { await postData(`${apiEndpoint.production.base}/${id}/start`, {}); notify("success", "Bắt đầu sản xuất"); queryClient.invalidateQueries({ queryKey: ["productions"] }); },
    complete: async (id: string) => { await postData(`${apiEndpoint.production.base}/${id}/complete`, {}); notify("success", "Hoàn thành sản xuất"); queryClient.invalidateQueries({ queryKey: ["productions"] }); },
    cancel: async (id: string, reason?: string) => { await postData(`${apiEndpoint.production.base}/${id}/cancel`, { reason }); notify("success", "Hủy lệnh sản xuất"); queryClient.invalidateQueries({ queryKey: ["productions"] }); },
    exportProduction: async (id: string, payload: any) => { await postData(`${apiEndpoint.production.base}/${id}/export`, payload); notify("success", "Xuất NVL thành công"); queryClient.invalidateQueries({ queryKey: ["productions"] }); },
    importProduction: async (id: string, payload: any) => { await postData(`${apiEndpoint.production.base}/${id}/import`, payload); notify("success", "Nhập thành phẩm thành công"); queryClient.invalidateQueries({ queryKey: ["productions"] }); },
  }),
});
