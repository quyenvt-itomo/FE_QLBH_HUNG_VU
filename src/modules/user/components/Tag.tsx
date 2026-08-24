import React from "react";
import { tagSizeStyleMap, tagStyle } from "@/shared/constants/ui";
import { TagStyleValue, TagVariant } from "@/shared/interfaces";

const stypeMap: Record<"active" | "inActive", TagStyleValue> = {
  active: tagStyle("green"),
  inActive: tagStyle("gray"),
};

export const UserActiveTag: React.FC<{
  value?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: TagVariant;
}> = ({ value, size = "md", variant = "default" }) => {
  if (!value) return null;
  const key = value ? "active" : "inActive";
  const color = stypeMap[key]?.[variant];
  return (
    <span
      className={`inline-flex items-center font-medium border ${color} ${tagSizeStyleMap[size]}`}
    >
      {value ? "Hoạt động" : "Ngưng hoạt động"}
    </span>
  );
};
