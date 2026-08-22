import { createBaseStore } from "@/shared/base/createBaseStore";
import { apiEndpoint } from "@/shared/constants/apiEndpoint";
import { Invoice, InvoiceQuery } from "./invoice.model";

export const useInvoiceStore = createBaseStore<Invoice, InvoiceQuery>({
  key: "invoices",
  apiUrl: apiEndpoint.invoice.base,
  permissionModule: "invoice",
});
