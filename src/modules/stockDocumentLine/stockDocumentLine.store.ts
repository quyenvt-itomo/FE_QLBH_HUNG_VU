import { createBaseStore } from "@/shared/base/createBaseStore";
import { apiEndpoint } from "@/shared/constants/apiEndpoint";
import { StockDocumentLine, StockDocumentLineQuery } from "./stockDocumentLine.model";

export const useStockDocumentLineStore = createBaseStore<StockDocumentLine, StockDocumentLineQuery>(
  {
    key: "stockDocumentLines",
    apiUrl: apiEndpoint.stockDocumentLine.base,
    permissionModule: "stockDocument",
  },
);
