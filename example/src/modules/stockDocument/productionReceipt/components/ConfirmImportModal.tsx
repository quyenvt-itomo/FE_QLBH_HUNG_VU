import React from "react";
import { StockDocumentQuantityModal } from "../../components/StockDocumentQuantityModal";
import { StockDocument } from "../../stockDocument.model";

interface Props {
  open: boolean;
  data?: StockDocument;
  loading?: boolean;
  onClose: () => void;
  onConfirm: (payload: any) => void;
}
export const ConfirmImportModal: React.FC<Props> = (props) => (
  <StockDocumentQuantityModal {...props} mode="import" />
);
