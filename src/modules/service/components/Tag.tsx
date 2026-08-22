import React from "react";
import { ServiceType, serviceTypeMap } from "../service.model";
import { tagSizeStyleMap, tagStyle } from "@/shared/constants/ui";
import { TagStyleValue, TagVariant } from "@/shared/interfaces/common";

const styleMap: Record<ServiceType, TagStyleValue> = {
  [ServiceType.IN_HOUSE]: tagStyle("green"),
  [ServiceType.OUTSOURCED]: tagStyle("orange"),
};

export const ServiceTypeTag: React.FC<{
  value?: ServiceType;
  size?: "sm" | "md" | "lg";
  variant?: TagVariant;
}> = ({ value, size = "md", variant = "default" }) => {
  if (!value) return null;
  const color = styleMap[value]?.[variant] || styleMap[ServiceType.IN_HOUSE][variant];
  return (
    <span
      className={`inline-flex items-center font-medium border ${color} ${tagSizeStyleMap[size]}`}
    >
      {serviceTypeMap[value] || value}
    </span>
  );
};
