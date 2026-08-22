import { useState } from "react";
import { UploadFile, UploadProps } from "antd";
import { HOST_URL } from "../../constants/ApiEndpoint";

export function useFileList(initialFiles: UploadFile[] = []) {
  const [fileList, setFileList] = useState<UploadFile[]>(initialFiles);
  const [fileDelete, setFileDelete] = useState<string[]>([]);

  const onChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    // lọc trùng theo name + size
    const uniqueFiles = newFileList.filter(
      (file, index, self) =>
        index ===
        self.findIndex((f) => f.name === file.name && f.size === file.size),
    );

    setFileList(uniqueFiles);
  };

  const handleRemoveFile = (uid: string) => {
    setFileList((prevFileList) => {
      const fileToRemove = prevFileList.find((file) => file.uid === uid);

      if (
        fileToRemove &&
        fileToRemove.uid.startsWith("old-") &&
        fileToRemove.url
      ) {
        try {
          const relativePath = fileToRemove.url.replace(HOST_URL, "");
          setFileDelete((prevDelete) => [...prevDelete, relativePath]);
        } catch (error) {
          console.warn("Không thể xử lý url file cũ:", error);
        }
      }

      return prevFileList.filter((file) => file.uid !== uid);
    });
  };

  return {
    fileList,
    fileDelete,
    setFileList,
    setFileDelete,
    onChange,
    handleRemoveFile,
  };
}
