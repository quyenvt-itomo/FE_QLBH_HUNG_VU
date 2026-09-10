import React from "react";
import {
  IncomeExpenseStatus,
  incomeExpenseStatusMap,
  IncomeExpenseType,
  incomeExpenseTypeMap,
} from "../incomeExpense.model";
import { tagSizeStyleMap, tagStyle } from "@/shared/constants/ui";
import { TagStyleValue, TagVariant } from "@/shared/interfaces/common";

const typeMap: Record<IncomeExpenseType, TagStyleValue> = {
  [IncomeExpenseType.INCOME]: tagStyle("green"),
  [IncomeExpenseType.EXPENSE]: tagStyle("red"),
};

export const IncomeExpenseTypeTag: React.FC<{
  value?: IncomeExpenseType;
  size?: "sm" | "md" | "lg";
  variant?: TagVariant;
}> = ({ value, size = "md", variant = "default" }) => {
  if (!value) return null;
  const color = typeMap[value]?.[variant];
  return (
    <span
      className={`inline-flex items-center font-medium border ${color} ${tagSizeStyleMap[size]}`}
    >
      {incomeExpenseTypeMap[value]}
    </span>
  );
};

const styleMap: Record<IncomeExpenseStatus, TagStyleValue> = {
  [IncomeExpenseStatus.DRAFT]: tagStyle("emerald"),
  [IncomeExpenseStatus.COMPLETED]: tagStyle("blue"),
  [IncomeExpenseStatus.CANCELED]: tagStyle("gray"),
};

export const IncomeExpenseStatusTag: React.FC<{
  value?: IncomeExpenseStatus;
  size?: "sm" | "md" | "lg";
  variant?: TagVariant;
}> = ({ value, size = "md", variant = "default" }) => {
  if (!value) return null;
  const color = styleMap[value]?.[variant] || styleMap[IncomeExpenseStatus.DRAFT][variant];
  return (
    <span
      className={`inline-flex items-center font-medium border ${color} ${tagSizeStyleMap[size]}`}
    >
      {incomeExpenseStatusMap[value]}
    </span>
  );
};
