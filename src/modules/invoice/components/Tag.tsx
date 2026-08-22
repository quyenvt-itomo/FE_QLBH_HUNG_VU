import React from "react";
import {
  InvoiceSourceType,
  invoiceSourceTypeMap,
  InvoiceStatus,
  invoiceStatusMap,
} from "../invoice.model";
import { tagSizeStyleMap, tagStyle } from "@/shared/constants/ui";
import { TagStyleValue, TagVariant } from "@/shared/interfaces/common";

const sourceTypeStyleMap: Record<InvoiceSourceType, TagStyleValue> = {
  [InvoiceSourceType.ORDER]: tagStyle("green"),
  [InvoiceSourceType.SALES_SERVICE]: tagStyle("purple"),
  [InvoiceSourceType.SHIPPING_PLAN]: tagStyle("blue"),
  [InvoiceSourceType.DOCUMENT]: tagStyle("orange"),
  [InvoiceSourceType.OTHER]: tagStyle("gray"),
};

export const InvoiceSourceTypeTag: React.FC<{
  value?: InvoiceSourceType;
  size?: "sm" | "md" | "lg";
  variant?: TagVariant;
}> = ({ value, size = "md", variant = "default" }) => {
  if (!value) return null;
  const color =
    sourceTypeStyleMap[value]?.[variant] || sourceTypeStyleMap[InvoiceSourceType.OTHER][variant];
  return (
    <span
      className={`inline-flex items-center font-medium border ${color} ${tagSizeStyleMap[size]}`}
    >
      {invoiceSourceTypeMap[value]}
    </span>
  );
};

const styleMap: Record<InvoiceStatus, TagStyleValue> = {
  [InvoiceStatus.EFFECTIVE]: tagStyle("amber"),
  [InvoiceStatus.PARTIALLY_PAID]: tagStyle("orange"),
  [InvoiceStatus.PAID]: tagStyle("blue"),
  [InvoiceStatus.CANCELED]: tagStyle("gray"),
};

export const InvoiceStatusTag: React.FC<{
  value?: InvoiceStatus;
  size?: "sm" | "md" | "lg";
  variant?: TagVariant;
}> = ({ value, size = "md", variant = "default" }) => {
  if (!value) return null;
  const color = styleMap[value]?.[variant] || styleMap[InvoiceStatus.EFFECTIVE][variant];
  return (
    <span
      className={`inline-flex items-center font-medium border ${color} ${tagSizeStyleMap[size]}`}
    >
      {invoiceStatusMap[value] || value}
    </span>
  );
};
