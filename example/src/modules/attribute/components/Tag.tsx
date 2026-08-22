import React from "react";
import { AttributeType, attributeTypeMap } from "../attribute.enum";
import { tagSizeStyleMap, tagStyle } from "@/shared/constants/ui";
import { TagStyleValue, TagVariant } from "@/shared/interfaces/common";

const styleMap: Record<AttributeType, TagStyleValue> = {
  [AttributeType.UNIT]: tagStyle("blue"),
  [AttributeType.OPERATION]: tagStyle("orange"),
  [AttributeType.JOB_TITLE]: tagStyle("cyan"),
  [AttributeType.INCOME_CATEGORY]: tagStyle("green"),
  [AttributeType.EXPENSE_CATEGORY]: tagStyle("red"),
  [AttributeType.FINISHED_GROUP]: tagStyle("geekblue"),
  [AttributeType.MAIN_MATERIAL_GROUP]: tagStyle("emerald"),
  [AttributeType.SUB_MATERIAL_GROUP]: tagStyle("teal"),
  [AttributeType.TOOLS_GROUP]: tagStyle("purple"),
  [AttributeType.PARTNER_GROUP]: tagStyle("lime"),
};

export const AttributeTypeTag: React.FC<{
  value?: AttributeType;
  size?: "sm" | "md" | "lg";
  variant?: TagVariant;
}> = ({ value, size = "md", variant = "default" }) => {
  if (!value) return null;
  const color = styleMap[value]?.[variant] || styleMap[AttributeType.UNIT][variant];
  return (
    <span
      className={`inline-flex items-center font-medium border ${color} ${tagSizeStyleMap[size]}`}
    >
      {attributeTypeMap[value] || value}
    </span>
  );
};
