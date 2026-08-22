import React from "react";
import { Tag } from "antd";
import { ProductType, productTypeMap } from "../product.model";
import { TagStyleValue, TagVariant } from "@/shared/interfaces/common";
import { tagSizeStyleMap, tagStyle } from "@/shared/constants/ui";

interface TagProps {
  value: ProductType;
  size?: "sm" | "default";
}

const styleMap: Record<ProductType, TagStyleValue> = {
  [ProductType.FINISHED]: tagStyle("blue"),
  [ProductType.MAIN_MATERIAL]: tagStyle("emerald"),
  [ProductType.SUB_MATERIAL]: tagStyle("rose"),
};

export const ProductTypeTag: React.FC<{
  value?: ProductType;
  size?: "sm" | "md" | "lg";
  variant?: TagVariant;
}> = ({ value, size = "md", variant = "default" }) => {
  if (!value) return null;
  const color = styleMap[value]?.[variant] || styleMap[ProductType.FINISHED][variant];
  return (
    <span
      className={`inline-flex items-center font-medium border ${color} ${tagSizeStyleMap[size]}`}
    >
      {productTypeMap[value]}
    </span>
  );
};
