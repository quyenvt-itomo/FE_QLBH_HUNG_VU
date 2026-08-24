import React from "react";

import { AddUpdateModalProps } from "@/shared/interfaces/common";

import { Partner, PartnerType } from "../partner.model";
import { PartnerAddUpdateModal } from "./PartnerAddUpdateModal";

/** Customer-only entry point used by selectors that create a customer inline. */
export const CustomerAddModal: React.FC<AddUpdateModalProps<Partner>> = (props) => (
  <PartnerAddUpdateModal {...props} type={PartnerType.CUSTOMER} />
);
