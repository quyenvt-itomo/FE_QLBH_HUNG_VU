import { createBaseStore } from "@/shared/base/createBaseStore";
import { apiEndpoint } from "@/shared/constants/apiEndpoint";
import { PaymentRequest, PaymentRequestQuery } from "./paymentRequest.model";

export const usePaymentRequestStore = createBaseStore<PaymentRequest, PaymentRequestQuery>({
  key: "paymentrequests",
  apiUrl: apiEndpoint.paymentRequest.base,
  permissionModule: "paymentRequest",
});
