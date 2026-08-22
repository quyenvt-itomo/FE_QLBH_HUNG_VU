import { createBaseStore } from "@/shared/base/createBaseStore";
import { apiEndpoint } from "@/shared/constants/apiEndpoint";
import { DeviceWhitelist, deviceWhitelistQuery } from "./deviceWhitelist.model";

export const useDeviceWhitelistStore = createBaseStore<DeviceWhitelist, deviceWhitelistQuery>({
  key: "devicewhitelists",
  apiUrl: apiEndpoint.deviceWhitelist.base,
});
