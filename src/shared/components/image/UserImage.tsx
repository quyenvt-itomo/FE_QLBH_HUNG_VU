import React, { useState, useEffect } from "react";
import { Image } from "antd";
import defaultUser from "@/shared/assets/defaultAvatar.jpg";
import { EyeIcon } from "@heroicons/react/24/outline";
import { File } from "@/shared/interfaces/file";
import { buildFileUrl } from "@/shared/utils/url.util";

const getInitials = (name?: string) => {
  if (!name) return "";

  const parts = name.trim().split(/\s+/);

  if (parts.length === 1) {
    return parts[0][0].toUpperCase();
  }

  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

interface UserImageProps {
  size?: number;
  image?: File | null;
  isHiddenPreview?: boolean;
  name?: string;
}

const UserImage: React.FC<UserImageProps> = ({ image, name, size = 32, isHiddenPreview }) => {
  const [hasError, setHasError] = useState(false);

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
        : undefined;

  const fullImageSrc = !hasError && image?.url ? buildFileUrl(image.url) : undefined;

  const initials = getInitials(name);
  const showImage = Boolean(thumbnailSrc);

  return (
    <div
      className="flex items-center justify-center flex-shrink-0"
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        overflow: "hidden",
        backgroundColor: "#e5e7eb", // gray-200
        fontSize: size / 2,
        fontWeight: 600,
        color: "#374151", // gray-700
        cursor: showImage ? "pointer" : "default",
        userSelect: "none",
      }}
    >
      {showImage ? (
        <Image
          src={thumbnailSrc}
          preview={
            isHiddenPreview
              ? false
              : {
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
            borderRadius: "50%",
          }}
          crossOrigin="anonymous"
          onError={handleError}
          onClick={(e) => {
            e.stopPropagation(); // ⭐ CHẶN CLICK CHA
          }}
        />
      ) : initials ? (
        <span>{initials}</span>
      ) : (
        <img src={defaultUser} width={size} height={size} style={{ objectFit: "cover" }} />
      )}
    </div>
  );
};

export default UserImage;
