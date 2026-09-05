import React from "react";
import { OrderStatus as PurchaseStatus, purchaseStatusMap } from "../purchase.model";
import { tagSizeStyleMap, tagStyle } from "@/shared/constants/ui";
import { TagStyleValue, TagVariant } from "@/shared/interfaces/common";

const styleMap: Record<PurchaseStatus, TagStyleValue> = {
  [PurchaseStatus.DRAFT]: tagStyle("emerald"),
  [PurchaseStatus.COMPLETED]: tagStyle("blue"),
  [PurchaseStatus.CANCELED]: tagStyle("gray"),
};

export const PurchaseStatusTag: React.FC<{
  value?: PurchaseStatus;
  size?: "sm" | "md" | "lg";
  variant?: TagVariant;
}> = ({ value, size = "md", variant = "default" }) => {
  if (!value) return null;
  const color = styleMap[value]?.[variant] || styleMap[PurchaseStatus.DRAFT][variant];
  return (
    <span
      className={`inline-flex items-center font-medium border ${color} ${tagSizeStyleMap[size]}`}
    >
      {purchaseStatusMap[value]}
    </span>
  );
};
