import { AttributeType } from "@/modules/attribute/attribute.enum";
import { PartnerType } from "../../partner.model";

export const groupTypeMap: Record<PartnerType, AttributeType> = {
  [PartnerType.CUSTOMER]: AttributeType.CUSTOMER_GROUP,
  [PartnerType.SUPPLIER]: AttributeType.SUPPLIER_GROUP,
  [PartnerType.SHIPPER]: AttributeType.SHIPPER_GROUP,
};
