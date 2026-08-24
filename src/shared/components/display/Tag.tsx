import { approvedStatusMap, ApproveStatus } from "@/modules/shared/business.model";
import { tagSizeStyleMap, tagStyle } from "@/shared/constants/ui";
import { TagStyleValue, TagVariant } from "@/shared/interfaces/common";
import React from "react";

export type TagType = "default" | "success" | "warning" | "error" | "info";

interface TagProps {
  type?: TagType;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

const colorMap: Record<TagType, { bg: string; text: string; border: string }> = {
  default: { bg: "bg-slate-100", text: "text-slate-700", border: "border-slate-200" },
  success: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  warning: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  error: { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200" },
  info: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
};

const Tag: React.FC<TagProps> = ({ type = "default", className = "", children }) => {
  const color = colorMap[type] || colorMap.default;
  return (
    <span
      className={`inline-flex items-center px-2 py-[2px] rounded-full text-[11px] font-medium border ${color.bg} ${color.text} ${color.border} ${className}`}
    >
      {children}
    </span>
  );
};

const styleMap: Record<ApproveStatus, TagStyleValue> = {
  [ApproveStatus.PENDING]: tagStyle("amber"),
  [ApproveStatus.APPROVED]: tagStyle("blue"),
  [ApproveStatus.REJECTED]: tagStyle("rose"),
  [ApproveStatus.CUSTOMER_APPROVED]: tagStyle("yellow"),
  [ApproveStatus.CUSTOMER_REJECTED]: tagStyle("rose"),
};

export const ApproveStatusTag: React.FC<{
  value?: ApproveStatus;
  size?: "sm" | "md" | "lg";
  variant?: TagVariant;
}> = ({ value, size = "md", variant = "default" }) => {
  if (!value) return null;
  const color = styleMap[value]?.[variant] || styleMap[ApproveStatus.PENDING][variant];

  return (
    <span
      className={`inline-flex items-center font-medium border ${color} ${tagSizeStyleMap[size]}`}
    >
      {approvedStatusMap[value]}
    </span>
  );
};

export { Tag };
