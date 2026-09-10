import React from "react";
import { AddUpdateModalProps } from "@/shared/interfaces/common";
import { Purchase, OrderType } from "../purchase.model";
import { AddUpdatePurchaseModal } from "./AddUpdatePurchaseModal";

type Props = AddUpdateModalProps<Purchase>;

export const PurchaseReturnAddUpdateModal: React.FC<Props> = (props) => (
  <AddUpdatePurchaseModal {...props} documentType={OrderType.PURCHASE_RETURN} />
);
