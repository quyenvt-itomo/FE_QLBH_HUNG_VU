import React, { useState } from "react";
import { Tooltip, Image } from "antd";
import { EyeIcon, ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { File } from "@/shared/interfaces/file";
import { downloadFile } from "@/shared/utils/file.util";
import { FileTypeIcon } from "../dropdown/FileTypeIcon";
import { FilePreviewModal } from "../upload/FilePreviewModal";

interface DocumentGroupProps {
  files?: File[];
}

const DocumentGroup: React.FC<DocumentGroupProps> = ({ files }) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState<{ url: string; name: string }>({
    url: "",
    name: "",
  });

  if (!files || files.length === 0) {
    return <span className="text-gray-400 text-xs italic">Không có tệp đính kèm</span>;
  }

  const isImage = (fileName: string) => {
    const ext = fileName?.split(".").pop()?.toLowerCase();
    return ["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg"].includes(ext || "");
  };

  const handlePreview = (file: File, e: React.MouseEvent) => {
    e.stopPropagation();
    setPreviewFile({ url: file.url, name: file.originalName || file.fileName || "" });
    setPreviewOpen(true);
  };

  const handleDownload = (file: File, e: React.MouseEvent) => {
    e.stopPropagation();
    downloadFile(file.url);
  };

  return (
    <span onClick={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()}>
      <div className="flex flex-wrap gap-1.5">
        {files.map((file, idx) => (
          <div
            key={file.id || idx}
            className="group relative flex items-center gap-2 px-2 py-1.5 rounded-md
              border border-gray-200 dark:border-gray-700
              bg-gray-50 dark:bg-gray-800
              hover:border-blue-400 dark:hover:border-blue-500
              transition-colors duration-200 cursor-pointer
              max-w-[220px]"
          >
            {/* Icon */}
            <FileTypeIcon
              fileName={file.originalName || file.fileName || ""}
              url={file.url}
              className="h-6 w-6 shrink-0"
            />

            {/* Tên file */}
            <Tooltip title={file.originalName || file.fileName}>
              <span className="truncate text-xs text-gray-600 dark:text-gray-400 flex-1 min-w-0">
                {file.originalName || file.fileName}
              </span>
            </Tooltip>

            {/* Hover overlay: preview + download */}
            <div
              className="absolute inset-0 rounded-md
                flex items-center justify-center gap-1
                opacity-0 group-hover:opacity-100
                bg-white/50 dark:bg-gray-900/50
                transition-opacity duration-200"
            >
              <button
                type="button"
                className="p-1 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded transition-colors"
                onClick={(e) => handlePreview(file, e)}
                title="Xem trước"
              >
                <EyeIcon className="h-4 w-4 text-blue-500" />
              </button>
              <button
                type="button"
                className="p-1 hover:bg-green-100 dark:hover:bg-green-900/50 rounded transition-colors"
                onClick={(e) => handleDownload(file, e)}
                title="Tải xuống"
              >
                <ArrowDownTrayIcon className="h-4 w-4 text-green-500" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <FilePreviewModal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        fileUrl={previewFile.url}
        fileName={previewFile.name}
      />
    </span>
  );
};

export { DocumentGroup };
