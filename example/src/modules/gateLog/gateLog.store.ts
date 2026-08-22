import { createBaseStore } from "@/shared/base/createBaseStore";
import { apiEndpoint } from "@/shared/constants/apiEndpoint";
import { GateLog, gateLogQuery } from "./gateLog.model";

export const useGateLogStore = createBaseStore<GateLog, gateLogQuery>({
  key: "gatelogs",
  apiUrl: apiEndpoint.gateLog.base,
  permissionModule: "gateLog",
});
