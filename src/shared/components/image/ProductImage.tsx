import React, { useState, useEffect } from "react";
import { Image } from "antd";
import defaultProduct from "@/assets/defaultProduct.jpg";
import { EyeIcon } from "@heroicons/react/24/outline";
import { File } from "@/shared/interfaces/file";
import { buildFileUrl } from "@/shared/utils/url.util";

interface ProductImageProps {
  size?: number;
  image?: File | null;
  preview?: boolean;
}

const ProductImage: React.FC<ProductImageProps> = ({ image, preview = true, size = 32 }) => {
  const [hasError, setHasError] = useState(false);

  // Reset error state when image changes
  useEffect(() => {
    setHasError(false);
  }, [image]);

  const handleError = () => {
    setHasError(true);
  };

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
        borderRadius: "50%",
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
                mask: <EyeIcon style={{ height: Math.max(20, size / 2) }} />,
              }
        }
        width={size}
        height={size}
        style={{ objectFit: "cover", borderRadius: "50%" }}
        crossOrigin="anonymous"
        onError={handleError}
      />
    </div>
  );
};

export default ProductImage;
