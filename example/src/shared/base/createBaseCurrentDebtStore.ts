import { useQuery } from "@tanstack/react-query";
import { formatPayload } from "@/shared/utils/common.util";
import {
  ApiRequestQuery,
  ApiResponse,
  BaseFailurePayload,
  PaginationProps,
  SummaryData,
} from "@/shared/interfaces/api";
import { getData } from "../api/apiClient";
import { Entity } from "./entity";
import { Module, Permission } from "../constants/permission";
import { useGlobalData } from "../hooks/useGlobalData";
import { checkPermission } from "../utils/permission.util";

export type BaseCurrentDebtStoreReturn<TPartner = any, TInvoice = any> = {
  partners: TPartner[];
  summary?: SummaryData | null;
  pagination?: PaginationProps | null;
  loading: boolean;
  invoices: TInvoice[];
  invoicePagination?: PaginationProps | null;
};

/**
 * Base store cho "Nợ hiện tại theo hóa đơn":
 *  - GET {apiUrl}/partners  → danh sách đối tác còn nợ (page)
 *  - GET {apiUrl}/invoices  → danh sách hóa đơn còn nợ của 1 đối tác (detail modal)
 */
export function createBaseCurrentDebtStore<
  TPartner extends Entity,
  TInvoice extends Entity,
  TQuery extends ApiRequestQuery,
>(config: {
  key: string;
  apiUrl: string;
  permissionModule?: Module;
}): (params?: TQuery) => BaseCurrentDebtStoreReturn<TPartner, TInvoice> {
  return function useBaseCurrentDebtStore(
    params?: TQuery,
  ): BaseCurrentDebtStoreReturn<TPartner, TInvoice> {
    const { permissions, currentStore } = useGlobalData();

    const can = config.permissionModule
      ? (permission: Permission) =>
          checkPermission(permissions, config.permissionModule!, permission)
      : () => true;

    const paramsWithStore = {
      ...params,
      storeId: currentStore?.id ?? params?.storeId,
    };

    const partnerQuery = useQuery<ApiResponse<TPartner[]>, BaseFailurePayload>({
      queryKey: [config.key, "partners", paramsWithStore],
      queryFn: async () => {
        const finalParams = formatPayload(paramsWithStore);
        return await getData<TPartner[]>(`${config.apiUrl}/partners`, finalParams);
      },
      enabled: can("read") && (!paramsWithStore || !paramsWithStore.isLockedReport),
    });

    const invoiceQuery = useQuery<ApiResponse<TInvoice[]>, BaseFailurePayload>({
      queryKey: [config.key, "invoices", paramsWithStore],
      queryFn: async () => {
        const finalParams = formatPayload(paramsWithStore);
        return await getData<TInvoice[]>(`${config.apiUrl}/invoices`, finalParams);
      },
      enabled: can("read") && (!paramsWithStore || !paramsWithStore.isLockedTransaction),
    });

    return {
      loading: partnerQuery.isLoading || invoiceQuery.isLoading,
      partners: partnerQuery.data?.data || [],
      summary: partnerQuery.data?.summary || null,
      pagination: partnerQuery.data?.pagination || null,
      invoices: invoiceQuery.data?.data || [],
      invoicePagination: invoiceQuery.data?.pagination || null,
    };
  };
}
