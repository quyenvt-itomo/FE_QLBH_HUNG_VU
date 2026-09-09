import { createBaseStore } from "@/shared/base/createBaseStore";
import { apiEndpoint } from "@/shared/constants/apiEndpoint";
import { InternalExport, InternalExportQuery } from "./internalExport.model";

export const useInternalExportStore = createBaseStore<InternalExport, InternalExportQuery>({
  key: "internalExports",
  apiUrl: apiEndpoint.internalExport.base,
  permissionModule: "internalExport",
});
