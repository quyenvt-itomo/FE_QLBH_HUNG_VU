import { createBaseStore } from "@/shared/base/createBaseStore";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { apiEndpoint } from "@/shared/constants/apiEndpoint";
import { Order, OrderHistoryQuery, OrderQuery } from "./order.model";
import type { Purchase } from "@/modules/purchase/purchase.model";
import { getData, postData } from "@/shared/api/apiClient";
import { formatPayload } from "@/shared/utils/common.util";
import { ApiResponse } from "@/shared/interfaces/api";
import { useSaleStore } from "@/modules/sale/store";
import { useSaleReturnStore } from "@/modules/saleReturn/store";

const createOrderStore = <T extends Order = Order>(key: string, apiUrl: string, permissionModule: "sale" | "saleReturn" | "purchase" | "purchaseReturn") => createBaseStore<
  T,
  OrderQuery,
  {
    complete?: (id: string) => Promise<void>;
    completeMany?: (ids: string[]) => Promise<void>;
    cancel?: (id: string, reason?: string) => Promise<void>;
    cancelMany?: (ids: string[], reason?: string) => Promise<void>;
  }
>({
  key,
  apiUrl,
  permissionModule,
  extend: ({ notify, queryClient, can }) => ({
    complete: can("complete")
      ? async (id: string) => {
          await postData(`${apiUrl}/${id}/complete`, {});
          notify("success", "Hoàn thành đơn hàng thành công");
          queryClient.invalidateQueries({ queryKey: [key] });
        }
      : undefined,
    completeMany: can("complete")
      ? async (ids: string[]) => {
          await Promise.all(ids.map((id) => postData(`${apiUrl}/${id}/complete`, {})));
          notify("success", "Hoàn thành các đơn hàng thành công");
          queryClient.invalidateQueries({ queryKey: [key] });
        }
      : undefined,
    cancel: async (id: string, reason?: string) => {
      await postData(`${apiUrl}/${id}/cancel`, { reason });
      notify("success", "Hủy đơn hàng thành công");
      queryClient.invalidateQueries({ queryKey: [key] });
    },
    cancelMany: async (ids: string[], reason?: string) => {
      await Promise.all(ids.map((id) => postData(`${apiUrl}/${id}/cancel`, { reason })));
      notify("success", "Hủy các đơn hàng thành công");
      queryClient.invalidateQueries({ queryKey: [key] });
    },
  }),
});

export const usePurchaseStore = createOrderStore("purchases", apiEndpoint.order.purchase, "purchase");
export const usePurchaseReturnStore = createOrderStore<Purchase>("purchaseReturns", apiEndpoint.order.purchaseReturn, "purchaseReturn");
export { useSaleStore, useSaleReturnStore };
/** Store đọc lịch sử mọi loại đơn của một đơn vị vận chuyển. */
export const useOrderHistoryStore = (params?: OrderHistoryQuery) => {
  const query = useQuery<ApiResponse<Order[]>>({
    queryKey: ["orderHistory", params],
    placeholderData: keepPreviousData,
    queryFn: () => getData<Order[]>(apiEndpoint.order.history, formatPayload(params)),
    enabled: Boolean(params?.shipperId),
  });

  return {
    data: query.data?.data || [],
    pagination: query.data?.pagination,
    loading: query.isLoading,
    fetching: query.isFetching,
  };
};
/** Compatibility alias for old order screens; orders are now split by type. */
export const useOrderStore = useSaleStore;
