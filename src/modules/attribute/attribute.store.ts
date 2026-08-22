import { createBaseStore } from "@/shared/base/createBaseStore";
import { Attribute, AttributeQuery } from "./attribute.model";
import { postData } from "@/shared/api/apiClient";
import { apiEndpoint } from "@/shared/constants/apiEndpoint";

export const useAttributeStore = createBaseStore<
  Attribute,
  AttributeQuery,
  { banAttribute?: (id: string) => void }
>({
  key: "attributes",
  apiUrl: apiEndpoint.attribute.base,
  permissionModule: "category",
  extend: () => ({
    banAttribute: async (id: string) => {
      await postData(`/attributes/${id}/ban`, {});
    },
  }),
});
