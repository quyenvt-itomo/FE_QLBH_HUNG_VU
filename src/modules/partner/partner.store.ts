import { createBaseStore } from "@/shared/base/createBaseStore";
import { Partner, PartnerQuery } from "./partner.model";
import { apiEndpoint } from "@/shared/constants/apiEndpoint";
import { getData } from "@/shared/api/apiClient";

export const usePartnerStore = createBaseStore<
  Partner,
  PartnerQuery,
  {
    getByTaxCode: (taxCode: string) => Promise<Partner | null>;
    getContactByPhone: (partnerId: string, phone: string) => Promise<any | null>;
  }
>({
  key: "partners",
  apiUrl: apiEndpoint.partner.base,
  permissionModule: "customer",
  extend: ({ onError }) => ({
    getByTaxCode: async (code: string) => {
      try {
        const result = await getData<Partner | null>(
          `/public${apiEndpoint.partner.base}/tax-code/${code}`,
        );
        return result?.data ?? null;
      } catch (error: any) {
        // onError(error);
        return null;
      }
    },
    getContactByPhone: async (partnerId: string, phone: string) => {
      try {
        const url = apiEndpoint.partnerContact.base.replace(":partnerId", partnerId);
        const result = await getData<any>(url, { keyword: phone });
        const contacts = result?.data ?? result ?? [];
        return Array.isArray(contacts) ? contacts[0] : (contacts?.data?.[0] ?? null);
      } catch {
        return null;
      }
    },
  }),
});

export const useCustomerStore = usePartnerStore;
export const useSupplierStore = createBaseStore<Partner, PartnerQuery>({
  key: "suppliers",
  apiUrl: apiEndpoint.partner.supplier,
  permissionModule: "supplier",
});
export const useShipperStore = createBaseStore<Partner, PartnerQuery>({
  key: "shippers",
  apiUrl: apiEndpoint.partner.shipper,
  permissionModule: "shipper",
});
