import { createBaseStore } from "@/shared/base/createBaseStore";
import { apiEndpoint } from "@/shared/constants/apiEndpoint";
import { Service, ServiceQuery } from "./service.model";

export const useServiceStore = createBaseStore<Service, ServiceQuery>({
  key: "services",
  apiUrl: apiEndpoint.service.base,
  permissionModule: "service",
});
