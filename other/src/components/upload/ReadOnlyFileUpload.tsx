import React from "react";
import { Popover, Tooltip } from "antd";
import "./upload.css";
import OfficePreviewModal from "../modal/OfficePreviewModal";
import DownLoadButton from "../button/DownloadButton";

interface AttachedFileUploadProps {
  fileList?: string[];
  absolute?: boolean;
  title?: string;
  maxWidth?: string | number;
  width?: number | string;
  height?: number | string;
}

const ReadOnlyFileUpload: React.FC<AttachedFileUploadProps> = ({
  fileList = [],
  absolute = false,
  title = "File đính kèm",
  maxWidth = "500px",
  width = 520,
  height = 56,
}) => {
  const visibleFiles = fileList.slice(0, 4);
  const hiddenFiles = fileList.slice(4);

  const renderHiddenFiles = (
    <div className="hidden-file-list">
      <div className="font-semibold mb-2">Danh sách tài liệu</div>
      {hiddenFiles.map((file, index) => {
        const fileName = file.split("/").pop();
        return (
          <div key={index} className="flex justify-between items-center gap-2 py-1 text-sm">
            <div className="flex items-center gap-2">
              <img
                src="https://cdn-icons-png.flaticon.com/512/337/337946.png"
                className="w-6 h-6"
                alt="pdf"
              />
              <Tooltip title={fileName}>
                <span className="truncate text-xs text-center w-14 max-w-full">{fileName}</span>
              </Tooltip>
              <div className="flex items-center gap-2">
                <OfficePreviewModal fileUrl={file} />
                <DownLoadButton fileUrl={file} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div
      className={`upload-container flex justify-between items-start gap-2 w-full max-w-[${maxWidth}]`}
      style={{ border: "1px solid #ececed", width, height }}
    >
      {visibleFiles.length === 0 && hiddenFiles.length === 0 ? (
        <div className="flex items-center justify-center h-full w-full text-gray-500">
          <i>Chưa có tệp nào được chọn.</i>
        </div>
      ) : (
        <div className="flex items-center gap-2 h-full">
          {visibleFiles.map((file, index) => {
            const fileName = file.split("/").pop();
            return (
              <div
                key={index}
                className="file-thumbnail flex flex-col items-center group relative
             p-1 rounded-md border border-transparent
             hover:border-blue-300 transition-colors duration-200"
              >
                <div className="flex absolute top-0 left-0 h-full w-full items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200 hover:bg-black/10 rounded-md">
                  <OfficePreviewModal fileUrl={file} justIcon />
                  <DownLoadButton fileUrl={file} justIcon />
                </div>
                <img
                  src="https://cdn-icons-png.flaticon.com/512/337/337946.png"
                  alt={fileName}
                  className="w-6 h-6 object-contain mb-1"
                />
                <Tooltip title={fileName}>
                  <span className="truncate text-xs text-center w-14 max-w-full">{fileName}</span>
                </Tooltip>
              </div>
            );
          })}

          {hiddenFiles.length > 0 && (
            <div className="w-20">
              <Popover content={renderHiddenFiles} trigger="click">
                <div className="w-10 h-8 flex items-center justify-center rounded-full border border-blue-600 text-blue-600 text-sm cursor-pointer">
                  +{hiddenFiles.length}
                </div>
              </Popover>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReadOnlyFileUpload;
