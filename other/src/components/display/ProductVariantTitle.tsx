import React from "react";
import { IProductVariant, ProductVariantSnapshot } from "../../models/product";
import { getFullVariantOptionContent } from "../../utils/common";
import ProductImage from "../image/ProductImage";
import { getMainImage } from "../../utils/fileUtil";

interface ProductVariantTitleProps {
  item?: ProductVariantSnapshot | IProductVariant | null;
  className?: string;
  fontSize?: number;
}

export const ProductVariantTitle: React.FC<ProductVariantTitleProps> = ({
  item,
  className,
  fontSize = 10,
}) => {
  const { product } = item || {};

  const hasVariant = !!product?.hasVariant || item?.options?.length;

  const variantText = getFullVariantOptionContent(item);
  const unitName = item?.product?.unit?.name;

  return (
    <div className="flex gap-2 items-center">
      <ProductImage image={getMainImage(item?.image)} size={28} />
      <div className={`flex w-64 flex-col overflow-x-hidden ${className || ""}`}>
        <div className="flex gap-4 items-center">
          <span className="block truncate">{product?.name || ""}</span>
        </div>
        {hasVariant ? (
          <span style={{ fontSize }}>
            {variantText} - Mã: {product?.code || ""}
          </span>
        ) : (
          <span style={{ fontSize }}>Mã: {product?.code || ""}</span>
        )}
      </div>
    </div>
  );
};

export const ProductVariantTitleLite: React.FC<ProductVariantTitleProps> = ({
  item,
  className,
  fontSize = 12,
}) => {
  const { product } = item || {};

  const hasVariant = !!product?.hasVariant || item?.options?.length;

  const variantText = getFullVariantOptionContent(item);

  return (
    <div className="flex w-64 flex-col overflow-x-hidden">
      <div className="flex gap-4 items-center">
        <span className="block truncate">{product?.name || ""}</span>
        <span className="text-gray-400 text-xs">Mã: {product?.code || ""}</span>
      </div>
      {hasVariant && <span style={{ fontSize }}>{variantText}</span>}
    </div>
  );
};
