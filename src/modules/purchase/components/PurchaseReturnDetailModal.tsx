import React from "react";
import { PurchaseDetailModal, PurchaseDetailModalProps } from "./PurchaseDetailModal";

type Props = Omit<PurchaseDetailModalProps, "isPurchaseReturn">;

export const PurchaseReturnDetailModal: React.FC<Props> = (props) => (
  <PurchaseDetailModal {...props} isPurchaseReturn />
);
