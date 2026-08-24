import { Dropdown } from "antd";
import { EyeIcon, ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { File } from "@/shared/interfaces/file";
import { downloadFile } from "@/shared/utils/file.util";
import { FilePreviewModal } from "../upload/FilePreviewModal";
import { FileTypeIcon } from "./FileTypeIcon";

interface MediaDropdownProps {
  files?: File[];
}

export const MediaDropdown: React.FC<MediaDropdownProps> = ({ files }) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState<{ url: string; name: string }>({
    url: "",
    name: "",
  });
  const [overflowOpen, setOverflowOpen] = useState(false);

  if (!files?.length) return null;

  const visibleFiles = files.slice(0, 1);
  const hiddenFiles = files.slice(1);

  const handlePreview = (file: File) => {
    setPreviewFile({ url: file.url, name: file.originalName });
    setPreviewOpen(true);
  };

  const overflowContent = (
    <div
      className="min-w-[260px] max-w-[360px] bg-panel shadow px-3 py-1 rounded border border-gray-200 dark:border-gray-700"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="font-semibold mb-2 text-sm">Danh sách tài liệu</div>
      <div className="max-h-[280px] overflow-y-auto flex flex-col gap-1">
        {hiddenFiles.map((file) => (
          <div
            key={file.id}
            className="flex items-center gap-2 py-1.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 rounded px-1"
          >
            <FileTypeIcon
              fileName={file.originalName}
              url={file.thumbnailUrl || file.url}
              className="h-5 w-5 shrink-0"
            />
            <span className="truncate flex-1 text-xs" title={file.originalName}>
              {file.originalName}
            </span>
            <button
              className="p-1 hover:bg-blue-100 rounded"
              onClick={(e) => {
                e.stopPropagation();
                handlePreview(file);
              }}
              title="Xem trước"
            >
              <EyeIcon className="h-3.5 w-3.5 text-blue-500" />
            </button>
            <button
              className="p-1 hover:bg-green-100 rounded"
              onClick={(e) => {
                e.stopPropagation();
                downloadFile(file.url);
              }}
              title="Tải xuống"
            >
              <ArrowDownTrayIcon className="h-3.5 w-3.5 text-green-500" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  // Single file: compact inline display
  if (files.length === 1) {
    const file = files[0];
    return (
      <>
        <div className="flex items-center gap-2 px-2 py-1 group">
          <FileTypeIcon
            fileName={file.originalName}
            url={file.thumbnailUrl || file.url}
            className="h-5 w-5 shrink-0"
          />
          <span className="truncate text-sm max-w-[160px]" title={file.originalName}>
            {file.originalName}
          </span>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              className="p-0.5 hover:text-blue-500"
              onClick={() => handlePreview(file)}
              title="Xem trước"
            >
              <EyeIcon className="h-4 w-4" />
            </button>
            <button
              className="p-0.5 hover:text-green-500"
              onClick={() => downloadFile(file.url)}
              title="Tải xuống"
            >
              <ArrowDownTrayIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
        <FilePreviewModal
          open={previewOpen}
          onClose={() => setPreviewOpen(false)}
          fileUrl={previewFile.url}
          fileName={previewFile.name}
        />
      </>
    );
  }

  return (
    <>
      <div className="flex items-center gap-1">
        {visibleFiles.map((file) => (
          <button
            key={file.id}
            className="flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-xs transition-colors"
            onClick={() => handlePreview(file)}
            title={file.originalName}
          >
            <FileTypeIcon
              fileName={file.originalName}
              url={file.thumbnailUrl || file.url}
              className="h-5 w-5 shrink-0"
            />
            <span className="truncate max-w-[80px]">{file.originalName}</span>
          </button>
        ))}

        {hiddenFiles.length > 0 && (
          <Dropdown
            trigger={["click"]}
            dropdownRender={() => overflowContent}
            placement="bottomRight"
            open={overflowOpen}
            onOpenChange={setOverflowOpen}
          >
            <div className="shrink-0 w-6 h-6 flex items-center justify-center rounded-full border border-blue-300 text-blue-500 text-2xs font-medium cursor-pointer hover:bg-blue-50 transition-colors">
              +{hiddenFiles.length}
            </div>
          </Dropdown>
        )}
      </div>

      <FilePreviewModal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        fileUrl={previewFile.url}
        fileName={previewFile.name}
      />
    </>
  );
};
