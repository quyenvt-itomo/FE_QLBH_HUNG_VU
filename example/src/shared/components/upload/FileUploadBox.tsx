import { App, Upload, UploadFile, Popover, Tooltip } from "antd";
import { useState, useEffect, useRef } from "react";
import { UploadProps } from "antd/lib";
import { File } from "@/shared/interfaces/file";
import { ArrowDownTrayIcon, EyeIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Icon } from "@iconify/react";
import { deleteFile, uploads, downloadFile } from "@/shared/utils/file.util";
import { FileCategory, EntityFile } from "@/shared/constants/enum";
import FilePreviewModal from "./FilePreviewModal";
import FileTypeIcon from "@/shared/components/dropdown/FileTypeIcon";
import "./FileUploadBox.css";

// ---------- Props ----------

type FileUploadBoxProps = {
  defaultFiles?: File[];
  oId: string;
  isActive?: boolean;
  onChange?: (files: File[]) => void;
  onReload?: () => void;
  onMoveToTrash?: (file: File) => void;
  accept?: string;
  maxCount?: number;
  entity: EntityFile;
  category: FileCategory;
  placeholder?: React.ReactNode;
};

// ---------- Component ----------

export const FileUploadBox: React.FC<FileUploadBoxProps> = ({
  defaultFiles = [],
  oId,
  isActive = false,
  onChange,
  onReload,
  onMoveToTrash,
  accept = ".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.webp,.bmp",
  maxCount = 99,
  entity,
  category,
  placeholder = "Kéo thả file vào đây hoặc nhấn để chọn",
}) => {
  const { message } = App.useApp();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>(defaultFiles);
  const [uploading, setUploading] = useState(false);

  // Preview state
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState<{
    url: string;
    name: string;
  }>({ url: "", name: "" });

  // Popover for overflow files
  const [overflowOpen, setOverflowOpen] = useState(false);

  const uploadTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const uploadRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const prevDefaultFilesKeyRef = useRef<string>("");

  // Responsive: how many file icons fit
  const [maxVisible, setMaxVisible] = useState(4);

  useEffect(() => {
    // Compare by content (IDs) to avoid infinite loop from new array references
    const currentKey = defaultFiles.map((f) => f.id).join(",");
    if (prevDefaultFilesKeyRef.current === currentKey) return;
    prevDefaultFilesKeyRef.current = currentKey;

    if (defaultFiles.length > 0) {
      const initialFileList = defaultFiles.map((file) => ({
        uid: file.id,
        name: file.originalName,
        status: "done" as const,
        url: file.url,
        response: file,
        thumbUrl: file.thumbnailUrl,
      })) as UploadFile[];
      setFileList(initialFileList);
      setUploadedFiles(defaultFiles);
    } else {
      setFileList([]);
      setUploadedFiles([]);
    }
  }, [defaultFiles]);

  useEffect(() => {
    const calc = () => {
      if (containerRef.current) {
        const w = containerRef.current.clientWidth;
        // ~100px per file item, reserve ~60px for upload button, ~40px for +N badge
        const visible = Math.max(1, Math.floor((w - 100) / 100));
        setMaxVisible(visible);
      }
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  useEffect(() => {
    return () => {
      if (uploadTimeoutRef.current) clearTimeout(uploadTimeoutRef.current);
    };
  }, []);

  // ---------- Handlers ----------

  const handleChange: UploadProps["onChange"] = async ({ fileList: newFileList }) => {
    setFileList(newFileList);

    if (uploadTimeoutRef.current) clearTimeout(uploadTimeoutRef.current);

    uploadTimeoutRef.current = setTimeout(async () => {
      const filesToUpload = newFileList.filter(
        (f) => f.originFileObj && f.status !== "done" && !f.response,
      );

      if (filesToUpload.length > 0 && !uploading) {
        setUploading(true);
        const result = await uploads({
          files: filesToUpload,
          oId,
          entity,
          category,
          isActive,
          messageApi: message,
        });
        onReload?.();

        if (result && result.length > 0) {
          const updatedFiles = [...uploadedFiles, ...result];
          setUploadedFiles(updatedFiles);
          onChange?.(updatedFiles);

          const updatedFileList = newFileList.map((file) => {
            if (file.originFileObj && file.status !== "done") {
              const uploadedFile = result.find((f) => f.originalName === file.name);
              if (uploadedFile) {
                return {
                  ...file,
                  status: "done" as const,
                  url: uploadedFile.url,
                  response: uploadedFile,
                  uid: uploadedFile.id,
                  thumbUrl: uploadedFile.thumbnailUrl,
                } as UploadFile;
              }
            }
            return file;
          });
          setFileList(updatedFileList);
        } else {
          const failedUids = filesToUpload.map((f) => f.uid);
          setFileList(newFileList.filter((f) => !failedUids.includes(f.uid)));
        }
        setUploading(false);
      }
    }, 300);
  };

  const handleRemove = async (file: UploadFile) => {
    const fileData = (file.response as File) || uploadedFiles.find((f) => f.id === file.uid);
    const fileId = fileData?.id || file.uid;

    // Edit form flow: move active file to temporary trash, delete on outer submit
    if (!isActive && fileData?.status === "active") {
      onMoveToTrash?.(fileData);
      const updatedList = fileList.filter((f) => f.uid !== file.uid);
      const updatedFiles = uploadedFiles.filter((f) => f.id !== fileId);
      setFileList(updatedList);
      setUploadedFiles(updatedFiles);
      onChange?.(updatedFiles);
      return true;
    }

    if (fileData && fileId) {
      const success = await deleteFile(fileId, message);
      if (!success) return false;
      onReload?.();
    }
    const updatedList = fileList.filter((f) => f.uid !== file.uid);
    const updatedFiles = uploadedFiles.filter((f) => f.id !== fileId);
    setFileList(updatedList);
    setUploadedFiles(updatedFiles);
    onChange?.(updatedFiles);
    return true;
  };

  const handlePreview = (file: UploadFile) => {
    const url = file.url || (file.response?.url as string) || "";
    const name = file.name || file.response?.originalName || "";
    setPreviewFile({ url, name });
    setPreviewOpen(true);
  };

  const openUpload = () => {
    try {
      const input = uploadRef.current?.nativeElement?.querySelector(
        'input[type="file"]',
      ) as HTMLInputElement | null;
      input?.click();
    } catch (error) {
      console.error("Error opening file dialog:", error);
    }
  };

  // ---------- Derived data ----------

  const visibleFiles = fileList.slice(0, maxVisible);
  const hiddenFiles = fileList.slice(maxVisible);

  // ---------- Overflow popover ----------

  const overflowContent = (
    <div className="min-w-[220px] max-w-[320px]" onClick={(e) => e.stopPropagation()}>
      <div className="font-semibold mb-2 text-sm">Danh sách tài liệu</div>
      <div className="max-h-[280px] overflow-y-auto">
        {hiddenFiles.map((file) => {
          return (
            <div
              key={file.uid}
              className="flex items-center justify-between gap-2 py-1.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 rounded px-1"
            >
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <FileTypeIcon
                  fileName={file.name}
                  url={file.url || (file.response as File)?.url}
                  className="h-5 w-5 shrink-0"
                />
                <Tooltip title={file.name}>
                  <span className="truncate max-w-[140px] text-xs">{file.name}</span>
                </Tooltip>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  className="p-1 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePreview(file);
                  }}
                  title="Xem trước"
                >
                  <EyeIcon className="h-3.5 w-3.5 text-blue-500" />
                </button>
                <button
                  type="button"
                  className="p-1 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    downloadFile(file.url || (file.response as File)?.url || "");
                  }}
                  title="Tải xuống"
                >
                  <ArrowDownTrayIcon className="h-3.5 w-3.5 text-green-500" />
                </button>
                <button
                  type="button"
                  className="p-1 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(file);
                  }}
                  title="Xóa"
                >
                  <TrashIcon className="h-3.5 w-3.5 text-red-500" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // ---------- Render ----------

  return (
    <>
      <Upload
        accept={accept}
        ref={uploadRef}
        fileList={fileList}
        onChange={handleChange}
        beforeUpload={() => false}
        showUploadList={false}
        multiple
        maxCount={maxCount}
        className="w-full flex"
      >
        <div
          ref={containerRef}
          className="
            flex items-center justify-between gap-2 h-[56px] w-full
            border border-gray-200 dark:border-gray-700
            rounded-lg bg-white dark:bg-[#1f1f1f]
            hover:border-blue-400 dark:hover:border-blue-500
            transition-colors duration-200
            cursor-pointer overflow-hidden
          "
          onClick={(e) => {
            // Only trigger upload if clicked on empty area
            const target = e.target as HTMLElement;
            if (
              target.closest("button") ||
              target.closest(".file-item") ||
              target.closest(".overflow-badge")
            ) {
              return;
            }
            openUpload();
          }}
        >
          {/* LEFT: file list */}
          <div className="flex items-center gap-1 px-3 flex-1 min-w-0 h-full overflow-hidden">
            {fileList.length === 0 && !uploading ? (
              <div className="text-gray-400 dark:text-gray-500 text-sm italic select-none">
                {placeholder}
              </div>
            ) : (
              <>
                {visibleFiles.map((file) => {
                  return (
                    <div
                      key={file.uid}
                      className="file-item group relative flex flex-col items-center justify-center
                        p-1.5 rounded-md min-w-[72px] max-w-[90px] h-full
                        hover:bg-gray-100 dark:hover:bg-gray-800
                        transition-colors duration-200 shrink-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* File icon */}
                      <FileTypeIcon
                        fileName={file.name}
                        url={file.url || (file.response as File)?.url}
                        className="h-6 w-6 shrink-0"
                      />

                      {/* File name */}
                      <Tooltip title={file.name}>
                        <span className="truncate text-[10px] leading-tight text-center w-full mt-0.5 text-gray-600 dark:text-gray-400">
                          {file.name}
                        </span>
                      </Tooltip>

                      {/* Hover overlay: preview + download + delete */}
                      <div
                        className="
                          absolute inset-0 rounded-md
                          flex items-center justify-center gap-1
                          opacity-0 group-hover:opacity-100
                          bg-white/90 dark:bg-gray-900/90
                          transition-opacity duration-200
                        "
                      >
                        <button
                          type="button"
                          className="p-1 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePreview(file);
                          }}
                          title="Xem trước"
                        >
                          <EyeIcon className="h-4 w-4 text-blue-500" />
                        </button>
                        <button
                          type="button"
                          className="p-1 hover:bg-green-100 dark:hover:bg-green-900/50 rounded transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            downloadFile(file.url || (file.response as File)?.url || "");
                          }}
                          title="Tải xuống"
                        >
                          <ArrowDownTrayIcon className="h-4 w-4 text-green-500" />
                        </button>
                        <button
                          type="button"
                          className="p-1 hover:bg-red-100 dark:hover:bg-red-900/50 rounded transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemove(file);
                          }}
                          title="Xóa"
                        >
                          <TrashIcon className="h-4 w-4 text-red-500" />
                        </button>
                      </div>
                    </div>
                  );
                })}

                {/* +N overflow badge */}
                {hiddenFiles.length > 0 && (
                  <Popover
                    content={overflowContent}
                    trigger="click"
                    open={overflowOpen}
                    onOpenChange={setOverflowOpen}
                    placement="bottomLeft"
                  >
                    <div
                      className="overflow-badge shrink-0
                        w-9 h-9 flex items-center justify-center
                        rounded-full border border-blue-500
                        text-blue-500 text-xs font-medium
                        cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/30
                        transition-colors duration-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOverflowOpen(!overflowOpen);
                      }}
                    >
                      +{hiddenFiles.length}
                    </div>
                  </Popover>
                )}
              </>
            )}

            {/* Uploading indicator */}
            {uploading && (
              <div className="shrink-0 flex items-center gap-2 text-blue-500 text-xs ml-2">
                <Icon icon="svg-spinners:3-dots-fade" className="h-4 w-4" />
                Đang tải...
              </div>
            )}
          </div>

          {/* RIGHT: upload button */}
          <button
            className="
              shrink-0 h-full w-[56px]
              border-l border-gray-200 dark:border-gray-700
              flex items-center justify-center
              bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500
              hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-500 dark:hover:text-blue-400
              transition-colors duration-200 ease-in-out
              rounded-r-lg
            "
            type="button"
          >
            <Icon icon="material-symbols:upload-file-outline" className="h-5 w-5" />
          </button>
        </div>
      </Upload>

      {/* Preview modal */}
      <FilePreviewModal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        fileUrl={previewFile.url}
        fileName={previewFile.name}
      />
    </>
  );
};
