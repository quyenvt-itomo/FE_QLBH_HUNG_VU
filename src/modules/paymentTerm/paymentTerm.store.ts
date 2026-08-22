import { createBaseStore } from "@/shared/base/createBaseStore";
import { apiEndpoint } from "@/shared/constants/apiEndpoint";
import { PaymentTerm, PaymentTermQuery } from "./paymentTerm.model";

export const usePaymentTermStore = createBaseStore<PaymentTerm, PaymentTermQuery>({
  key: "paymentterms",
  apiUrl: apiEndpoint.paymentTerm.base,
  permissionModule: "paymentTerm",
});
