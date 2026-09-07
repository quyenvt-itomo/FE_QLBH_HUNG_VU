import React from "react";

import { Partner } from "../partner.model";
import { CustomerAddUpdateModal } from "./CustomerAddUpdateModal";
import { PartnerFormModalProps } from "./PartnerAddUpdateModal/form.types";

/** Customer-only entry point used by selectors that create a customer inline. */
export const CustomerAddModal: React.FC<PartnerFormModalProps> = (props) => (
  <CustomerAddUpdateModal {...props} />
);
