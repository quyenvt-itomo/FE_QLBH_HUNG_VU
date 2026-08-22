import { createBaseStore } from "@/shared/base/createBaseStore";
import { apiEndpoint } from "@/shared/constants/apiEndpoint";
import { postData } from "@/shared/api/apiClient";
import { ShippingPlan, ShippingPlanQuery } from "./shippingPlan.model";
import { buildUrlWithId } from "@/shared/utils/url.util";

export const useShippingPlanStore = createBaseStore<
  ShippingPlan,
  ShippingPlanQuery,
  {
    approve?: (id: string) => Promise<void>;
    reject?: (id: string, rejectReason: string) => Promise<void>;
  }
>({
  key: "shippingplans",
  apiUrl: apiEndpoint.shippingPlan.base,
  permissionModule: "shippingPlan",
  extend: ({ queryClient, notify, onSuccess, onError, can }) => ({
    approve: can("approve")
      ? async (id: string) => {
          try {
            await postData(buildUrlWithId(apiEndpoint.shippingPlan.approve, id), {});
            queryClient.invalidateQueries({ queryKey: ["shippingplans"] });
            notify("success", "Phê duyệt phương án vận chuyển thành công");
            onSuccess?.();
          } catch (error: any) {
            onError(error);
          }
        }
      : undefined,
    reject: can("approve")
      ? async (id: string, rejectReason: string) => {
          try {
            await postData(buildUrlWithId(apiEndpoint.shippingPlan.reject, id), {
              rejectReason,
            });
            queryClient.invalidateQueries({ queryKey: ["shippingplans"] });
            notify("success", "Từ chối phương án vận chuyển thành công");
            onSuccess?.();
          } catch (error: any) {
            onError(error);
          }
        }
      : undefined,
  }),
});
