import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getData } from "@/shared/api/apiClient";
import { apiEndpoint } from "@/shared/constants/apiEndpoint";
import { ApiResponse } from "@/shared/interfaces/api";
import {
  AnalysisQuery,
  AnalysisTopData,
  GenericAnalysisData,
  SaleBusinessIndicatorData,
  SaleOverviewMetricsData,
  SaleProfitCostStructureData,
  SaleProfitEffectivenessData,
  SaleProfitMetricsData,
} from "./analysis.model";

const unwrap = <T,>(response: ApiResponse<T>): T => response.data as T;

const useAnalysisRequestStore = <T>(key: string, endpoint: string, query: AnalysisQuery) => {
  const request = useQuery<T>({
    queryKey: ["analysis", key, query],
    queryFn: () => getData<T>(endpoint, query).then(unwrap),
    placeholderData: keepPreviousData,
    enabled: Boolean(query.period),
  });

  return {
    ...request,
    data: request.data,
    loading: request.isLoading || request.isFetching,
    fetching: request.isFetching,
  };
};

export const useAnalysisSaleOverviewMetricsStore = (query: AnalysisQuery) =>
  useAnalysisRequestStore<SaleOverviewMetricsData>("sale-overview-metrics", apiEndpoint.analysis.saleOverviewMetrics, query);

export const useAnalysisSaleBusinessIndicatorStore = (query: AnalysisQuery) =>
  useAnalysisRequestStore<SaleBusinessIndicatorData>("sale-business-indicator", apiEndpoint.analysis.saleBusinessIndicator, query);

export const useAnalysisSaleTopProductGroupsStore = (query: AnalysisQuery) =>
  useAnalysisRequestStore<AnalysisTopData>("sale-top-product-groups", apiEndpoint.analysis.saleTopProductGroups, query);

export const useAnalysisSaleTopProductsStore = (query: AnalysisQuery) =>
  useAnalysisRequestStore<AnalysisTopData>("sale-top-products", apiEndpoint.analysis.saleTopProducts, query);

export const useAnalysisSaleTopCustomerGroupsStore = (query: AnalysisQuery) =>
  useAnalysisRequestStore<AnalysisTopData>("sale-top-customer-groups", apiEndpoint.analysis.saleTopCustomerGroups, query);

export const useAnalysisSaleProfitMetricsStore = (query: AnalysisQuery) =>
  useAnalysisRequestStore<SaleProfitMetricsData>("sale-profit-metrics", apiEndpoint.analysis.saleProfitMetrics, query);

export const useAnalysisSaleProfitCostStructureStore = (query: AnalysisQuery) =>
  useAnalysisRequestStore<SaleProfitCostStructureData>("sale-profit-cost-structure", apiEndpoint.analysis.saleProfitCostStructure, query);

export const useAnalysisSaleProfitEffectivenessStore = (query: AnalysisQuery) =>
  useAnalysisRequestStore<SaleProfitEffectivenessData>("sale-profit-effectiveness", apiEndpoint.analysis.saleProfitEffectiveness, query);

export const useAnalysisProductOverviewStore = (query: AnalysisQuery) =>
  useAnalysisRequestStore<GenericAnalysisData>("product-overview", apiEndpoint.analysis.productOverview, query);

export const useAnalysisProductInventoryStore = (query: AnalysisQuery) =>
  useAnalysisRequestStore<GenericAnalysisData>("product-inventory", apiEndpoint.analysis.productInventory, query);

export const useAnalysisProductClassificationStore = (query: AnalysisQuery) =>
  useAnalysisRequestStore<GenericAnalysisData>("product-classification", apiEndpoint.analysis.productClassification, query);

export const useAnalysisCustomerOverviewStore = (query: AnalysisQuery) =>
  useAnalysisRequestStore<GenericAnalysisData>("customer-overview", apiEndpoint.analysis.customerOverview, query);

export const useAnalysisCustomerClassificationStore = (query: AnalysisQuery) =>
  useAnalysisRequestStore<GenericAnalysisData>("customer-classification", apiEndpoint.analysis.customerClassification, query);

export const useAnalysisReceivableStore = (query: AnalysisQuery) =>
  useAnalysisRequestStore<GenericAnalysisData>("receivable", apiEndpoint.analysis.receivable, query);
