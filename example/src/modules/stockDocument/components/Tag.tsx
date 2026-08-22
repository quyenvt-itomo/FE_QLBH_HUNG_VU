import React from "react";
import { StockDocumentStatus, stockDocumentStatusMap } from "../stockDocument.model";
import { tagSizeStyleMap, tagStyle } from "@/shared/constants/ui";
import { TagStyleValue, TagVariant } from "@/shared/interfaces/common";

const styleMap: Record<StockDocumentStatus, TagStyleValue> = {
  [StockDocumentStatus.PENDING]: tagStyle("amber"),
  [StockDocumentStatus.EXPORTED]: tagStyle("orange"),
  [StockDocumentStatus.COMPLETED]: tagStyle("blue"),
};

export const StockDocumentStatusTag: React.FC<{
  value?: StockDocumentStatus;
  size?: "sm" | "md" | "lg";
  variant?: TagVariant;
}> = ({ value, size = "md", variant = "default" }) => {
  if (!value) return null;
  const color = styleMap[value]?.[variant] || styleMap[StockDocumentStatus.PENDING][variant];
  return (
    <span
      className={`inline-flex items-center font-medium border ${color} ${tagSizeStyleMap[size]}`}
    >
      {stockDocumentStatusMap[value] || value}
    </span>
  );
};
