import { createBaseStore } from "@/shared/base/createBaseStore";
import { apiEndpoint } from "@/shared/constants/apiEndpoint";
import { Product, ProductQuery } from "./product.model";
import { useQuery } from "@tanstack/react-query";
import { getData } from "@/shared/api/apiClient";
import { ApiResponse } from "@/shared/interfaces/api";
import { formatPayload } from "@/shared/utils/common.util";
import { postData } from "@/shared/api/apiClient";

interface ProductStoreExtra {
  changeGroup?: (
    ids: string[],
    groupId: string | null,
    opts?: { onSuccess?: () => void },
  ) => Promise<void>;
  stopSelling?: (
    ids: string[],
    storeId?: string,
    opts?: { onSuccess?: () => void },
  ) => Promise<void>;
}

export const useProductStore = createBaseStore<Product, ProductQuery, ProductStoreExtra>({
  key: "products",
  apiUrl: apiEndpoint.product.base,
  permissionModule: "product",
  extend: ({ queryClient, notify, onSuccess, onError, can }) => ({
    changeGroup: can("update")
      ? async (ids, groupId, opts) => {
          try {
            await postData(apiEndpoint.product.changeGroup, { ids, groupId });
            queryClient.invalidateQueries({ queryKey: ["products"] });
            notify("success", "Đổi nhóm hàng thành công");
            opts?.onSuccess?.();
            onSuccess?.();
          } catch (error) {
            onError(error);
            throw error;
          }
        }
      : undefined,
    stopSelling: can("update")
      ? async (ids, storeId, opts) => {
          try {
            await postData(apiEndpoint.product.stopSelling, {
              ids,
              ...(storeId ? { storeId } : {}),
            });
            queryClient.invalidateQueries({ queryKey: ["products"] });
            notify(
              "success",
              storeId ? "Đã ngừng kinh doanh tại cửa hàng" : "Đã ngừng kinh doanh tại tất cả cửa hàng",
            );
            opts?.onSuccess?.();
            onSuccess?.();
          } catch (error) {
            onError(error);
            throw error;
          }
        }
      : undefined,
  }),
});

export const useProductPriceHistoryStore = createBaseStore<Product, ProductQuery>({
  key: "productPriceHistories",
  apiUrl: apiEndpoint.product.priceHistory,
  permissionModule: "product",
});

/**
 * Public product store — không cần auth, dùng cho trang public (khách hàng bên ngoài)
 */
export function usePublicProductStore(params: ProductQuery) {
  const {
    data: queryData,
    isLoading,
    isSuccess,
  } = useQuery<ApiResponse<Product[]>>({
    queryKey: ["publicProducts", params],
    queryFn: async () => {
      const finalParams = formatPayload(params);
      return await getData<Product[]>(apiEndpoint.product.public, finalParams);
    },
    enabled: !params?.isLocked,
  });

  return {
    isSuccess,
    data: queryData?.data || [],
    loading: isLoading,
    pagination: queryData?.pagination,
  };
}
