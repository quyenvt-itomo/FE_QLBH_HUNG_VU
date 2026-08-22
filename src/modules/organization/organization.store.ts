import { createBaseStore } from "@/shared/base/createBaseStore";
import { Organization, OrganizationQuery, SortPayload } from "./organization.model";
import { apiEndpoint } from "@/shared/constants/apiEndpoint";
import { getData, postData } from "@/shared/api/apiClient";

export const useOrganizationStore = createBaseStore<
  Organization,
  OrganizationQuery,
  {
    getByCode: (code: string) => Promise<Organization | null>;
    updateSortOrder?: (data: SortPayload[]) => Promise<void>;
  }
>({
  key: "organizations",
  apiUrl: apiEndpoint.organization.base,
  permissionModule: "organization",
  extend: ({ canUpdate, queryClient, notify, onSuccess, onError }) => ({
    getByCode: async (code: string) => {
      try {
        const result = await getData<Organization | null>(
          `/public${apiEndpoint.organization.base}/code/${code}`,
        );
        return result?.data ?? null;
      } catch (error: any) {
        onError(error);
        return null;
      }
    },

    updateSortOrder: canUpdate
      ? async (data: SortPayload[]) => {
          try {
            await postData(apiEndpoint.organization.updateSortOrder, {
              data,
            });
            queryClient.invalidateQueries({ queryKey: ["organizations"] });
            notify("success", "Cập nhật thứ tự thành công");
            onSuccess?.();
          } catch (error: any) {
            onError(error);
          }
        }
      : undefined,
  }),
});
