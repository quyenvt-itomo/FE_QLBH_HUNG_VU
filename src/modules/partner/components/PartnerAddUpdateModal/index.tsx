import React from "react";
import { AddUpdateModalProps } from "@/shared/interfaces/common";
import { Partner, PartnerType } from "../../partner.model";
import { CustomerAddUpdateModal } from "../CustomerAddUpdateModal";
import { SupplierAddUpdateModal } from "../SupplierAddUpdateModal";
import { ShipperAddUpdateModal } from "../ShipperAddUpdateModal";
import { PartnerFormPartialProps } from "./form.types";

export type PartialProps = PartnerFormPartialProps;

interface Props extends AddUpdateModalProps<Partner> {
  type: PartnerType;
}

/** Backward-compatible selector entry point for inline partner selectors. */
export const PartnerAddUpdateModal: React.FC<Props> = ({ type, ...props }) => {
  if (type === PartnerType.SUPPLIER) return <SupplierAddUpdateModal {...props} />;
  if (type === PartnerType.SHIPPER) return <ShipperAddUpdateModal {...props} />;
  return <CustomerAddUpdateModal {...props} />;
};
