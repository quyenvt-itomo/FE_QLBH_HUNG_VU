import React from "react";
import { HOST_URL } from "../../constants/ApiEndpoint";
import { IconExcel } from "./Excel";
import { fileExtensionMap } from "../../constants/fileExtensionMap";

interface FileIconProps {
  file: string;
}

const FileIcon: React.FC<FileIconProps> = ({ file }) => {
  const getFileIcon = (fileName: string) => {
    const fileExtension = fileName.split(".").pop()?.toLowerCase() || "";

    return (
      fileExtensionMap[fileExtension] ||
      "https://cdn-icons-png.flaticon.com/512/94/94730.png"
    );
  };

  return (
    <img
      src={getFileIcon(file)}
      alt="Image"
      className="w-full h-full object-cover"
    />
  );
};

export default FileIcon;
