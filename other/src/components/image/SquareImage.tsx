import React, { useEffect } from "react";
import { Image } from "antd";
import defaultProduct from "../../assets/defaultProduct.jpg";
import { IFile } from "../../models/base/file";
import { buildFileUrl } from "../../utils/paramUtils";
import { EyeIcon } from "@heroicons/react/24/outline";

interface SquareImageProps {
  image?: IFile | null;
  size?: number;
}

const SquareImage: React.FC<SquareImageProps> = ({ image, size = 28 }) => {
  const [hasError, setHasError] = React.useState(false);

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

  const radius = size > 40 ? 8 : 4;

  return (
    <div
      className="flex-shrink-0"
      style={{
        width: size,
        height: size,
        borderRadius: radius,
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
            : {
                src: fullImageSrc,
                mask: <EyeIcon style={{ height: Math.max(20, size / 2) }} />,
              }
        }
        width={size}
        height={size}
        style={{ objectFit: "cover", borderRadius: radius }}
        crossOrigin="anonymous"
        onError={handleError}
      />
    </div>
  );
};

export default SquareImage;
