import { createBaseStore } from "../../shared/base/createBaseStore";
import { Attribute, AttributeQuery } from "./attribute.model";
import { apiEndpoint } from "@/shared/constants/apiEndpoint";
import { useGlobalData } from "@/shared/hooks/useGlobalData";

const useAttributeBaseStore = createBaseStore<Attribute, AttributeQuery>({
  key: "attributes",
  apiUrl: apiEndpoint.attribute.base,
  permissionModule: "attribute",
});

export const useAttributeStore = (
  params?: AttributeQuery,
  onSuccess?: () => void,
) => {
  const { currentStore } = useGlobalData();

  return useAttributeBaseStore(
    {
      ...params,
      storeId: params?.storeId ?? currentStore?.id,
    },
    onSuccess,
  );
};
