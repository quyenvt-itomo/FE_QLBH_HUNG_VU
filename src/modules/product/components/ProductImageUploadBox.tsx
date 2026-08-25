import React, { useEffect, useRef, useState } from "react";
import { App, Image, Spin, Upload, UploadFile } from "antd";
import type { UploadProps } from "antd";
import { CheckIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";

import { File } from "@/shared/interfaces/file";
import { EntityType, FileCategory, FileStatus } from "@/shared/constants/enum";
import { deleteFile, getMainFile, setMainFile, uploads } from "@/shared/utils/file.util";
import { buildFileUrl } from "@/shared/utils/url.util";

const MAX_FILES = 5;
const MAX_FILE_SIZE = 2 * 1024 * 1024;
const IMAGE_GAP = 4;
const DEFAULT_IMAGE_SIZE = 188;

interface ProductImageUploadBoxProps {
  defaultFiles?: File[];
  oId: string;
  size?: number;
  isActive?: boolean;
  onChange?: (files: File[]) => void;
  onReload?: () => void;
  onMoveToTrash?: (file: File) => void;
}

const toUploadFile = (file: File): UploadFile => ({
  uid: file.id,
  name: file.originalName,
  status: "done",
  url: file.url,
  thumbUrl: file.thumbnailUrl || file.url,
  response: file,
});

export const ProductImageUploadBox: React.FC<ProductImageUploadBoxProps> = ({
  defaultFiles = [],
  oId,
  size = DEFAULT_IMAGE_SIZE,
  isActive = false,
  onChange,
  onReload,
  onMoveToTrash,
}) => {
  const { message } = App.useApp();
  const uploadRef = useRef<any>(null);
  const uploadTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const uploadingRef = useRef(false);
  const filesRef = useRef<File[]>(defaultFiles);
  const [files, setFiles] = useState<File[]>(defaultFiles);
  const [fileList, setFileList] = useState<UploadFile[]>(defaultFiles.map(toUploadFile));
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>();
  const previousFilesKeyRef = useRef("");

  useEffect(() => {
    const key = defaultFiles.map((file) => `${file.id}:${file.isMain}`).join(",");
    if (key === previousFilesKeyRef.current) return;
    previousFilesKeyRef.current = key;
    filesRef.current = defaultFiles;
    setFiles(defaultFiles);
    setFileList(defaultFiles.map(toUploadFile));
  }, [defaultFiles]);

  useEffect(() => () => {
    if (uploadTimeoutRef.current) clearTimeout(uploadTimeoutRef.current);
  });

  const updateFiles = (nextFiles: File[]) => {
    filesRef.current = nextFiles;
    setFiles(nextFiles);
    setFileList(nextFiles.map(toUploadFile));
    onChange?.(nextFiles);
  };

  const uploadPendingFiles = async (nextFileList: UploadFile[]) => {
    const pendingFiles = nextFileList.filter(
      (file) => file.originFileObj && file.status !== "done" && !file.response,
    );
    if (!pendingFiles.length || uploadingRef.current) return;

    uploadingRef.current = true;
    setLoading(true);
    try {
      const result = await uploads({
        files: pendingFiles,
        oId,
        entity: EntityType.PRODUCT,
        category: FileCategory.IMAGE,
        isActive,
        messageApi: message,
      });

      if (!result?.length) {
        setFileList(filesRef.current.map(toUploadFile));
        return;
      }

      const nextFiles = [...filesRef.current, ...result].slice(0, MAX_FILES);
      updateFiles(nextFiles);
      onReload?.();
    } finally {
      uploadingRef.current = false;
      setLoading(false);
    }
  };

  const handleChange: UploadProps["onChange"] = ({ fileList: nextFileList }) => {
    setFileList(nextFileList);
    if (uploadTimeoutRef.current) clearTimeout(uploadTimeoutRef.current);
    uploadTimeoutRef.current = setTimeout(() => {
      void uploadPendingFiles(nextFileList);
    }, 250);
  };

  const beforeUpload: UploadProps["beforeUpload"] = (file) => {
    if (!file.type.startsWith("image/")) {
      message.error("Vui lòng chọn file hình ảnh");
      return Upload.LIST_IGNORE;
    }
    if (file.size > MAX_FILE_SIZE) {
      message.error("Mỗi ảnh không được vượt quá 2 MB");
      return Upload.LIST_IGNORE;
    }
    if (filesRef.current.length >= MAX_FILES) {
      message.error("Chỉ được tải tối đa 5 ảnh");
      return Upload.LIST_IGNORE;
    }
    return false;
  };

  const openUpload = () => {
    const input = uploadRef.current?.nativeElement?.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement | null;
    input?.click();
  };

  const handleRemove = async (file: File) => {
    setLoading(true);
    try {
      if (!isActive && file.status === FileStatus.ACTIVE) {
        onMoveToTrash?.(file);
      } else {
        const success = await deleteFile(file.id, message);
        if (!success) return;
      }
      updateFiles(filesRef.current.filter((item) => item.id !== file.id));
      onReload?.();
    } finally {
      setLoading(false);
    }
  };

  const handleSetMain = async (file: File) => {
    setLoading(true);
    try {
      if (!(await setMainFile(file.id))) return;
      const nextFiles = filesRef.current.map((item) => ({
        ...item,
        isMain: item.id === file.id,
      }));
      updateFiles(nextFiles);
      onReload?.();
    } finally {
      setLoading(false);
    }
  };

  const mainFile = getMainFile(files);
  const sideFiles = files.filter((file) => file.id !== mainFile?.id).slice(0, 4);
  const sideSlots = Array.from({ length: 4 }, (_, index) => sideFiles[index] || null);
  const sideSize = Math.max(0, (size - IMAGE_GAP * 3) / 4);

  const renderImage = (file: File, main = false) => (
    <div className="group relative h-full w-full">
      <img
        src={buildFileUrl(main ? file.url : file.thumbnailUrl || file.url)}
        alt={file.originalName}
        className="h-full w-full cursor-pointer object-cover"
        onClick={() => setPreviewUrl(buildFileUrl(file.url))}
      />
      <div className="absolute right-1 top-1 flex gap-1 opacity-0 transition group-hover:opacity-100">
        {!main && (
          <button
            type="button"
            title="Đặt làm ảnh chính"
            className="flex h-6 w-6 items-center justify-center rounded bg-white/90 text-green-600 shadow"
            onClick={(event) => {
              event.stopPropagation();
              void handleSetMain(file);
            }}
          >
            <CheckIcon className="h-4 w-4" />
          </button>
        )}
        <button
          type="button"
          title="Xóa ảnh"
          className="flex h-6 w-6 items-center justify-center rounded bg-white/90 text-red-600 shadow"
          onClick={(event) => {
            event.stopPropagation();
            void handleRemove(file);
          }}
        >
          <TrashIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );

  return (
    <div
      className="relative"
      style={{
        width: size + IMAGE_GAP + sideSize,
        height: size,
      }}
    >
      <Upload
        ref={uploadRef}
        accept="image/*"
        fileList={fileList}
        multiple
        maxCount={MAX_FILES}
        showUploadList={false}
        beforeUpload={beforeUpload}
        onChange={handleChange}
      >
        <span className="sr-only">Tải ảnh sản phẩm</span>
      </Upload>

      <div className="flex h-full" style={{ gap: IMAGE_GAP }}>
        <div
          className="relative shrink-0 overflow-hidden rounded-md border border-dashed border-gray-300 bg-gray-50"
          style={{ width: size, height: size }}
          onClick={() => !mainFile && openUpload()}
        >
          {mainFile ? (
            renderImage(mainFile, true)
          ) : (
            <button
              type="button"
              className="flex h-full w-full flex-col items-center justify-center gap-1 text-center text-sm text-gray-500"
              onClick={openUpload}
            >
              <PlusIcon className="h-6 w-6" />
              <span className="font-medium text-blue-600">Thêm ảnh</span>
              <span className="text-xs">Mỗi ảnh không quá 2 MB</span>
            </button>
          )}
        </div>

        <div className="flex h-full shrink-0 flex-col" style={{ width: sideSize, gap: IMAGE_GAP }}>
          {sideSlots.map((file, index) => (
            <div
              key={file?.id || `empty-${index}`}
              className="min-h-0 flex-1 overflow-hidden rounded-md border border-dashed border-gray-300 bg-gray-50"
              onClick={() => !file && openUpload()}
            >
              {file && renderImage(file)}
            </div>
          ))}
        </div>
      </div>

      {previewUrl && (
        <Image
          wrapperStyle={{ display: "none" }}
          preview={{
            visible: true,
            onVisibleChange: (visible) => !visible && setPreviewUrl(undefined),
          }}
          src={previewUrl}
        />
      )}

      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-md bg-white/70">
          <Spin />
        </div>
      )}
    </div>
  );
};

export default ProductImageUploadBox;
