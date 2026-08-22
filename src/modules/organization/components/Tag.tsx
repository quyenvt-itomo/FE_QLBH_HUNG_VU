import React from "react";
import { OrganizationTypeEnum, organizationTypeMap } from "../organization.enum";
import { tagSizeStyleMap, tagStyle } from "@/shared/constants/ui";
import { TagStyleValue, TagVariant } from "@/shared/interfaces/common";

const styleMap: Record<OrganizationTypeEnum, TagStyleValue> = {
  [OrganizationTypeEnum.HEADQUARTER]: tagStyle("blue"),
  [OrganizationTypeEnum.COMPANY]: tagStyle("emerald"),
  [OrganizationTypeEnum.BRANCH]: tagStyle("orange"),
  [OrganizationTypeEnum.DEPARTMENT]: tagStyle("teal"),
  [OrganizationTypeEnum.FACTORY]: tagStyle("purple"),
  [OrganizationTypeEnum.TEAM]: tagStyle("teal"),
};

export const OrganizationTypeTag: React.FC<{
  value?: OrganizationTypeEnum;
  size?: "sm" | "md" | "lg";
  variant?: TagVariant;
}> = ({ value, size = "md", variant = "default" }) => {
  if (!value) return null;
  const color = styleMap[value]?.[variant] || styleMap[OrganizationTypeEnum.COMPANY][variant];
  return (
    <span
      className={`inline-flex items-center font-medium border ${color} ${tagSizeStyleMap[size]}`}
    >
      {organizationTypeMap[value] || value}
    </span>
  );
};
