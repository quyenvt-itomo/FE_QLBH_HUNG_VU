import React from "react";
import { fileExtensionMap } from "@/shared/constants/fileExtensionMap";
import { buildFileUrl } from "@/shared/utils/url.util";

interface FileTypeIconProps {
  fileName: string;
  className?: string;
  /** Nếu là ảnh và có url, hiển thị thumbnail thay vì icon */
  url?: string | null;
}

const FileTypeIcon: React.FC<FileTypeIconProps> = ({ fileName, className = "h-8 w-8", url }) => {
  const ext = fileName.split(".").pop()?.toLowerCase() || "";
  const isImage = /^(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(ext);

  if (isImage && url) {
    const fullUrl = buildFileUrl(url);
    return (
      <img src={fullUrl} alt={fileName} className={`${className} object-cover rounded shrink-0`} />
    );
  }

  const src = fileExtensionMap[ext] || fileExtensionMap.default;
  return <img src={src} alt={ext} className={`${className} object-cover shrink-0`} />;
};

export default FileTypeIcon;
