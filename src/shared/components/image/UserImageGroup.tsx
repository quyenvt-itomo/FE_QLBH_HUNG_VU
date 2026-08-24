import React, { useState } from "react";
import { Avatar, Image, Tooltip } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import defaultUser from "@/shared/assets/defaultAvatar.jpg";
import { HOST_URL } from "@/shared/constants/apiEndpoint";
import { COLORS } from "@/shared/constants/ui";

interface UserImageGroupProps {
  images?: (string | null | undefined)[]; // relative path or full url (string)
  size?: number | "small" | "large";
  max?: number; // passed directly to Avatar.Group
  activeIndex?: number; // index của ảnh đang active (nếu có)
  tooltipFormatter?: (src: string | undefined, index: number) => React.ReactNode;
  onClick?: (index: number) => void;
}

/**
 * AvatarWithFallback
 * - giữ state local để xử lý lỗi ảnh (tương tự hasError của bạn)
 * - dùng imgProps.onError để set lại src = defaultUser
 */
const AvatarWithFallback: React.FC<{
  src?: string | null;
  size?: number | "small" | "large";
  tooltip?: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}> = ({ src, size = 32, tooltip, active, onClick }) => {
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    setHasError(true);
  };

  const imageSrc = !hasError && src ? `${HOST_URL}${src}` : defaultUser;
  const enablePreview = !hasError && src;

  const avatar = (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        overflow: "hidden",
        cursor: onClick ? "pointer" : "default",
        boxShadow: active ? `0 0 2px 2px ${COLORS.PRIMARY}` : "none",
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }} // ⛔ chặn click lan ra ngoài
    >
      <Image
        src={imageSrc}
        preview={
          enablePreview
            ? {
                mask: <EyeOutlined style={{ fontSize: 16 }} />,
              }
            : false
        }
        width={size}
        height={size}
        style={{ objectFit: "cover", borderRadius: "50%" }}
        crossOrigin="anonymous"
        onError={handleError}
      />
    </div>
  );

  return tooltip ? (
    <Tooltip title={tooltip} color={COLORS.PRIMARY}>
      {avatar}
    </Tooltip>
  ) : (
    avatar
  );
};

const UserImageGroup: React.FC<UserImageGroupProps> = ({
  images = [],
  size = 32,
  max = 3,
  activeIndex,
  tooltipFormatter,
  onClick,
}) => {
  return (
    <Avatar.Group
      max={{
        count: max,
        style: { color: "#f56a00", backgroundColor: "#fde3cf" },
      }}
      size={size}
    >
      {images.map((img, i) => (
        <AvatarWithFallback
          key={`user-image-${i}`}
          src={img ?? undefined}
          size={size}
          active={i === activeIndex}
          onClick={onClick ? () => onClick(i) : undefined}
          tooltip={tooltipFormatter ? tooltipFormatter(img ?? undefined, i) : undefined}
        />
      ))}
    </Avatar.Group>
  );
};

export default UserImageGroup;
