import { createBaseStore } from "@/shared/base/createBaseStore";
import { apiEndpoint } from "@/shared/constants/apiEndpoint";
import { OperationLog, OperationLogQuery } from "./operationLog.model";

export const useOperationLogStore = createBaseStore<OperationLog, OperationLogQuery>({
  key: "operation-logs",
  apiUrl: apiEndpoint.operationLog.base,
  permissionModule: "log",
});
