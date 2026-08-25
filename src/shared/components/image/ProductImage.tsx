import React, { useEffect, useState } from "react";
import { Image } from "antd";
import { EyeIcon } from "@heroicons/react/24/outline";

import defaultProduct from "@/shared/assets/defaultProduct.jpg";
import { File } from "@/shared/interfaces/file";
import { buildFileUrl } from "@/shared/utils/url.util";

interface ProductImageProps {
  size?: number;
  image?: File | null;
  preview?: boolean;
  shape?: "circle" | "square";
}

const ProductImage: React.FC<ProductImageProps> = ({
  image,
  preview = true,
  size = 32,
  shape = "circle",
}) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [image]);

  const handleError = () => {
    setHasError(true);
  };

  const radius = size > 40 ? 8 : 4;
  const borderRadius = shape === "circle" ? "50%" : `${radius}px`;

  const thumbnailSrc =
    !hasError && image?.thumbnailUrl
      ? buildFileUrl(image.thumbnailUrl)
      : !hasError && image?.url
        ? buildFileUrl(image.url)
        : defaultProduct;

  const fullImageSrc = !hasError && image?.url ? buildFileUrl(image.url) : defaultProduct;

  return (
    <div
      className="flex-shrink-0"
      style={{
        width: size,
        height: size,
        borderRadius,
        overflow: "hidden",
        cursor: "pointer",
      }}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <Image
        src={thumbnailSrc}
        preview={
          fullImageSrc === defaultProduct
            ? false
            : preview && {
                src: fullImageSrc,
                mask: (
                  <EyeIcon
                    style={{
                      height: Math.max(20, size / 2),
                    }}
                  />
                ),
              }
        }
        width={size}
        height={size}
        style={{
          objectFit: "cover",
          borderRadius,
        }}
        crossOrigin="anonymous"
        onError={handleError}
      />
    </div>
  );
};

export { ProductImage };
