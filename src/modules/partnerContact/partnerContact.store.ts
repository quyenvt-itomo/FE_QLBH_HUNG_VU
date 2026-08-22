import { createBaseStore } from "@/shared/base/createBaseStore";
import { PartnerContact, PartnerContactQuery } from "./partnerContact.model";
import { apiEndpoint } from "@/shared/constants/apiEndpoint";

export const usePartnerContactStore = createBaseStore<PartnerContact, PartnerContactQuery>({
  key: "partnerContacts",
  apiUrl: apiEndpoint.partnerContact.base,
});
