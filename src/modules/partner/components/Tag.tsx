import React from "react";
import { PartnerType, partnerTypeMap } from "../partner.model";
import { tagSizeStyleMap, tagStyle } from "@/shared/constants/ui";
import { TagStyleValue, TagVariant } from "@/shared/interfaces/common";

const styleMap: Record<PartnerType, TagStyleValue> = {
  [PartnerType.CUSTOMER]: tagStyle("blue"),
  [PartnerType.SUPPLIER]: tagStyle("emerald"),
  [PartnerType.SHIPPER]: tagStyle("amber"),
};

export const PartnerTypeTag: React.FC<{
  value?: PartnerType;
  size?: "sm" | "md" | "lg";
  variant?: TagVariant;
}> = ({ value, size = "md", variant = "default" }) => {
  if (!value) return null;
  const color = styleMap[value]?.[variant] || styleMap[PartnerType.CUSTOMER][variant];
  return (
    <span
      className={`inline-flex items-center font-medium border ${color} ${tagSizeStyleMap[size]}`}
    >
      {partnerTypeMap[value]}
    </span>
  );
};
