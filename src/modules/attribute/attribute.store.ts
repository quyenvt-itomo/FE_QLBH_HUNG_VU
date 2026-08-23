import { createBaseStore } from "../../shared/base/createBaseStore";
import { Attribute, AttributeQuery } from "./attribute.model";
import { apiEndpoint } from "@/shared/constants/apiEndpoint";

export const useAttributeStore = createBaseStore<Attribute, AttributeQuery>({
  key: "attributes",
  apiUrl: apiEndpoint.attribute.base,
  permissionModule: "attribute",
});
