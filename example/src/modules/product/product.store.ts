import { createBaseStore } from "@/shared/base/createBaseStore";
import { apiEndpoint } from "@/shared/constants/apiEndpoint";
import { Product, ProductQuery } from "./product.model";
import { useQuery } from "@tanstack/react-query";
import { getData } from "@/shared/api/apiClient";
import { ApiResponse } from "@/shared/interfaces/api";
import { formatPayload } from "@/shared/utils/common.util";

export const useProductStore = createBaseStore<Product, ProductQuery>({
  key: "products",
  apiUrl: apiEndpoint.product.base,
  permissionModule: "product",
});

export const useProductPriceHistoryStore = createBaseStore<Product, ProductQuery>({
  key: "productPriceHistories",
  apiUrl: apiEndpoint.product.priceHistory,
  permissionModule: "priceHistory",
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
