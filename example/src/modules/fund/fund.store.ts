import { createBaseStore } from "@/shared/base/createBaseStore";
import { apiEndpoint } from "@/shared/constants/apiEndpoint";
import { Fund, fundQuery } from "./fund.model";

export const useFundStore = createBaseStore<Fund, fundQuery>({
  key: "funds",
  apiUrl: apiEndpoint.fund.base,
  permissionModule: "fund",
});
