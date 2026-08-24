import React, { useState, useEffect, useCallback } from "react";
import { Upload, Button, Image, Spin, message, UploadFile, UploadProps } from "antd";
import { InboxOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { FileCategory, EntityType } from "@/shared/constants/enum";
import { uploads, deleteFile, deletePendingFiles } from "@/shared/utils/file.util";
import type { File } from "@/shared/interfaces/file";

const { Dragger } = Upload;

interface UploadInputProps {
  value?: File[];
  onChange?: (files: File[]) => void;
  entityType: EntityType;
  category: FileCategory;
  entityId?: string;
  maxCount?: number;
  accept?: string;
  /** Called when user closes form — clean up pending files */
  onClose?: () => Promise<void>;
  /** Trash file IDs from __trashFileIds (update mode only) */
  trashFileIds?: string[];
}

export const UploadInput: React.FC<UploadInputProps> = ({
  value = [],
  onChange,
  entityType,
  category,
  entityId,
  maxCount = 5,
  accept = "image/*,.pdf,.doc,.docx,.xls,.xlsx",
  onClose,
  trashFileIds,
}) => {
  const [files, setFiles] = useState<File[]>(value);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setFiles(value);
  }, [value]);

  // Build fileList for Upload display from files array
  useEffect(() => {
    setFileList(
      files.map((f, i) => ({
        uid: f.id || `existing-${i}`,
        name: f.originalName || f.fileName || "",
        status: "done" as const,
        url: f.url || "",
        thumbUrl: f.thumbnailUrl || f.url || "",
      })),
    );
  }, [files]);

  const handleUpload = useCallback(
    async (uploadFiles: UploadFile[]) => {
      if (!uploadFiles.length) return;

      setUploading(true);
      try {
        const result = await uploads({
          files: uploadFiles,
          oId: entityId,
          entity: entityType,
          category,
        });

        if (result && result.length > 0) {
          const newFiles = [...files, ...result];
          setFiles(newFiles);
          onChange?.(newFiles);
          message.success(`Tải lên ${result.length} file thành công`);
        }
      } catch {
        message.error("Tải file thất bại");
      } finally {
        setUploading(false);
        setFileList([]);
      }
    },
    [files, entityId, entityType, category, onChange],
  );

  const handleDelete = useCallback(
    async (fileId: string) => {
      try {
        await deleteFile(fileId);
        const newFiles = files.filter((f) => f.id !== fileId);
        setFiles(newFiles);
        onChange?.(newFiles);
        message.success("Đã xóa file");
      } catch {
        message.error("Xóa file thất bại");
      }
    },
    [files, onChange],
  );

  // Cleanup pending files when component unmounts
  useEffect(() => {
    return () => {
      if (onClose) {
        onClose().catch(() => {});
      }
    };
  }, []);

  const uploadProps: UploadProps = {
    name: "files",
    multiple: true,
    maxCount,
    accept,
    fileList,
    beforeUpload: () => false,
    onChange: (info) => {
      setFileList(info.fileList);
    },
    onDrop: () => {},
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Upload area */}
      <div>
        <Dragger
          {...uploadProps}
          disabled={uploading}
          showUploadList={false}
          style={{ padding: "12px 0" }}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text text-sm">Click hoặc kéo thả file vào đây</p>
          <p className="ant-upload-hint text-xs">
            Hỗ trợ ảnh, PDF, Word, Excel. Tối đa {maxCount} file.
          </p>
        </Dragger>
      </div>

      {/* Upload button */}
      {fileList.length > 0 && (
        <div className="flex items-center gap-2">
          <Button
            type="primary"
            size="small"
            onClick={() => handleUpload(fileList)}
            loading={uploading}
          >
            {uploading ? "Đang tải..." : `Tải ${fileList.length} file lên`}
          </Button>
          <span className="text-xs text-gray-400">{fileList.length} file đã chọn</span>
        </div>
      )}

      {/* File preview grid */}
      {files.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {files.map((file) => (
            <div
              key={file.id}
              className="relative group border rounded p-1 bg-gray-50 hover:bg-gray-100"
            >
              {/* Preview */}
              {file.type === "image" ? (
                <Image
                  src={file.thumbnailUrl || file.url}
                  alt={file.originalName}
                  className="w-full h-24 object-cover rounded"
                  preview={{ mask: <EyeOutlined /> }}
                />
              ) : (
                <div className="w-full h-24 flex items-center justify-center bg-gray-200 rounded text-xs text-gray-500 truncate px-1">
                  {file.originalName}
                </div>
              )}

              {/* Delete button */}
              <Button
                type="text"
                danger
                size="small"
                icon={<DeleteOutlined />}
                className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleDelete(file.id)}
              />

              <div className="text-xs text-gray-500 truncate mt-1 px-1">{file.originalName}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
