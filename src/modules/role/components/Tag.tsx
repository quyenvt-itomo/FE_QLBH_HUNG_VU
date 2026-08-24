import React from "react";
import { RoleType, roleTypeMap } from "../role.model";
import { tagSizeStyleMap, tagStyle } from "@/shared/constants/ui";
import { TagStyleValue, TagVariant } from "@/shared/interfaces";

const typeStyleMap: Record<RoleType, TagStyleValue> = {
  [RoleType.SYSTEM]: tagStyle("green"),
  [RoleType.STORE]: tagStyle("blue"),
};

export const RoleTypeTag: React.FC<{
  value?: RoleType;
  size?: "sm" | "md" | "lg";
  variant?: TagVariant;
}> = ({ value, size = "md", variant = "default" }) => {
  if (!value) return null;
  const color = typeStyleMap[value]?.[variant] || typeStyleMap[RoleType.STORE][variant];
  return (
    <span
      className={`inline-flex items-center font-medium border ${color} ${tagSizeStyleMap[size]}`}
    >
      {roleTypeMap[value]}
    </span>
  );
};
