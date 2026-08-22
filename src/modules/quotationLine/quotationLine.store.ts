import { createBaseStore } from "@/shared/base/createBaseStore";
import { apiEndpoint } from "@/shared/constants/apiEndpoint";
import { QuotationLine, QuotationLineQuery } from "./quotationLine.model";

export const useQuotationLineStore = createBaseStore<QuotationLine, QuotationLineQuery>({
  key: "quotationLines",
  apiUrl: apiEndpoint.quotationLine.base,
  permissionModule: "quotation",
});
