import React, { useEffect, useState } from "react";
import { Upload, Popover, Tooltip, Modal, notification } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { TrashIcon } from "@heroicons/react/24/outline";
import type { UploadFile, UploadProps } from "antd";
import "./upload.css";
import { fileExtensionMap } from "../../constants/fileExtensionMap";
import { parseFileInfo } from "../../utils/fileUtil";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import DownLoadButton from "../button/DownloadButton";
import { HOST_URL } from "../../constants/ApiEndpoint";

interface OfficePreviewModalProps {
  fileUrl: string;
  open?: boolean;
  setOpen?: (open: boolean) => void;
}

const OfficePreviewModal: React.FC<OfficePreviewModalProps> = ({ fileUrl, open, setOpen }) => {
  // Cleanup blob URL khi component unmount hoặc fileUrl thay đổi
  useEffect(() => {
    return () => {
      // Cleanup blob URL nếu là blob URL
      if (fileUrl && fileUrl.startsWith("blob:")) {
        URL.revokeObjectURL(fileUrl);
      }
    };
  }, [fileUrl]);

  const { name, date, ext } = parseFileInfo(fileUrl.replace("uploads/", ""));
  const fullUrl = fileUrl;
  const encodedUrl = encodeURIComponent(fullUrl);

  const isImage = /\.(jpg|jpeg|png|gif|webp|bmp)$/i.test(ext);
  const isPdf = /\.pdf$/i.test(ext);
  const isVideo = /\.(mp4|mov|webm|avi|mkv)$/i.test(ext);
  const isOffice = /\.(docx?|dotx?|xlsx?|xlsb|pptx?)$/i.test(ext);

  const renderContent = () => {
    if (isImage) {
      return <img src={fullUrl} alt={name} className="w-full h-full object-contain" />;
    }

    if (isPdf) {
      return (
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
          <Viewer fileUrl={fullUrl} />
        </Worker>
      );
    }

    if (isVideo) {
      return (
        <video controls src={fullUrl} className="w-full h-full rounded-md">
          Trình duyệt của bạn không hỗ trợ thẻ video.
        </video>
      );
    }

    if (isOffice) {
      const officeViewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodedUrl}`;
      return (
        <iframe
          src={officeViewerUrl}
          width="100%"
          height="100%"
          frameBorder="0"
          className="rounded-md"
          title="Office Viewer"
        />
      );
    }

    return (
      <div className="w-full h-full flex items-center justify-center text-gray-400">
        Không thể xem trước định dạng này.
      </div>
    );
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-6" onClick={(e) => e.stopPropagation()}>
          <span className="text-lg font-semibold truncate w-[400px]">
            {name}
            {ext}
          </span>
          <span className="text-sm  flex gap-4 text-gray-500">Ngày tải lên: {date}</span>
          <DownLoadButton fileUrl={fileUrl} />
        </div>
      }
      open={open}
      onCancel={() => setOpen?.(false)}
      footer={null}
      width="100vw"
      className="preview-file-modal"
      style={{ top: 10 }}
      styles={{
        body: { height: "93vh" },
      }}
      // bodyStyle={{ height: "93vh" }}
    >
      <div
        className="h-full w-full"
        onClick={(e) => {
          e.stopPropagation(); // Ngăn chặn nổi bọt sự kiện khi click vào nội dung modal
        }}
      >
        {renderContent()}
      </div>
    </Modal>
  );
};

interface AttachedFileUploadProps extends UploadProps {
  fileList: any[];
  absolute?: boolean;
  width?: number | string;
  height?: number | string;
  onDeleteFile?: (url: string) => void;
}

const FileUpload: React.FC<AttachedFileUploadProps> = ({
  fileList = [],
  maxCount = 1,
  absolute = true,
  width = 520,
  height = 56,
  onChange,
  onDeleteFile,
  ...rest
}) => {
  const [open, setOpen] = useState(false);
  const [filePreview, setFilePreview] = useState<string>("");
  const handleChange: UploadProps["onChange"] = ({ file, fileList }) => {
    const updatedList = fileList.map((f: any) => ({
      ...f,
      thumbUrl: f.thumbUrl || "https://cdn-icons-png.flaticon.com/512/337/337946.png",
    }));
    onChange?.({ file, fileList: updatedList });
  };

  const handleRemove = (file: UploadFile) => {
    if (file.url) {
      onDeleteFile?.(file.url);
    }

    // Cập nhật fileList mới (lọc bỏ file bị xóa)
    const updatedList: any = fileList.filter((f) => f.uid !== file.uid);
    onChange?.({ file, fileList: updatedList });

    return true;
  };

  const [maxVisibleFiles, setMaxVisibleFiles] = useState(4);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 720) {
        setMaxVisibleFiles(2);
      } else {
        setMaxVisibleFiles(4);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const visibleFiles = fileList.slice(0, maxVisibleFiles);
  const hiddenFiles = fileList.slice(maxVisibleFiles);

  const getFileIcon = (fileName: string) => {
    const fileExtension = fileName.split(".").pop()?.toLowerCase() || "";

    return fileExtensionMap[fileExtension] || "https://cdn-icons-png.flaticon.com/512/94/94730.png";
  };

  const renderHiddenFiles = (
    <div className="hidden-file-list" onClick={(e) => e.stopPropagation()}>
      <div className="font-semibold mb-2">Danh sách tài liệu</div>
      {hiddenFiles.map((file) => (
        <div key={file.uid} className="flex justify-between items-center gap-2 py-1 text-sm">
          <div className="flex items-center gap-2">
            <img src={getFileIcon(file.name)} className="w-4 h-4" alt="pdf" />
            <span className="truncate max-w-[160px]">{file.name}</span>
          </div>

          <TrashIcon
            className="w-4 h-4 text-red-500 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation(); // Thêm stopPropagation ở đây nếu popover cũng có thể click để xóa
              handleRemove(file);
            }}
          />
        </div>
      ))}
    </div>
  );

  const handlePreview = async (file: any) => {
    try {
      // Xử lý file URL cho cả file local và server
      let fileUrl = "";

      // if (file.originFileObj) {
      //   const response = await uploadFiles([file]);
      //   if (!response?.length) {
      //     notification.error({ message: "Không thể xem trước file này." });
      //     return;
      //   }
      //   fileUrl = response[0]; // Sử dụng URL trả về từ server
      // } else {
      //   // File đã có trên server
      //   fileUrl = file.url || file.thumbUrl || "";
      // }

      setFilePreview(HOST_URL + fileUrl);
      setOpen(true);
    } catch (error) {
      notification.error({ message: "Không thể xem trước file này." });
    }
  };

  return (
    <>
      <Upload
        accept=".pdf,.xls,.xlsx,.doc,.docx,.zip,.rar,.txt"
        fileList={fileList}
        showUploadList={false}
        multiple
        onChange={handleChange}
        onRemove={handleRemove}
        beforeUpload={() => false}
        className="full-area-upload"
        {...rest}
      >
        <div
          className="upload-container flex flex-row items-center gap-4 cursor-pointer"
          style={{ width, height }}
        >
          <div className="flex-1 flex flex-wrap items-center gap-3 min-h-[40px]">
            {fileList.length === 0 ? (
              <div className="text-gray-500 text-sm italic py-2 px-4 w-full text-center sm:text-left">
                Kéo thả file vào đây
              </div>
            ) : (
              <>
                <div className="flex items-center">
                  <div className="flex ">
                    {visibleFiles.map((file) => (
                      <div
                        key={file.uid}
                        className="file-thumbnail flex flex-col items-center group relative
                      p-2 rounded-md border border-transparent
                    hover:border-blue-300 transition-colors duration-200"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePreview(file);
                        }}
                      >
                        <img
                          src={getFileIcon(file.name)}
                          alt={file.name}
                          className="w-4 h-4 object-contain mb-1"
                        />
                        <Tooltip title={file.name}>
                          <span className="truncate text-xs text-center w-16 max-w-full block">
                            {file.name}
                          </span>
                        </Tooltip>
                        <TrashIcon
                          className="w-5 h-5 text-red-500 mr-1 mt-1 cursor-pointer
                        absolute -top-1 -right-1 bg-white rounded-full p-[2px] shadow
                        opacity-0 translate-y-1 transition-all duration-300
                        group-hover:opacity-100 group-hover:translate-y-0"
                          onClick={(e) => {
                            e.stopPropagation(); // Đảm bảo ngăn chặn nổi bọt khi click TrashIcon
                            handleRemove(file);
                          }}
                        />
                      </div>
                    ))}
                  </div>

                  {hiddenFiles.length > 0 && (
                    <Popover content={renderHiddenFiles} trigger="click">
                      <div
                        className="w-9 h-8 flex items-center justify-center rounded-full border border-blue-600 text-blue-600 text-sm cursor-pointer hover:bg-blue-50 transition-colors duration-200 ml-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        +{hiddenFiles.length}
                      </div>
                    </Popover>
                  )}
                </div>
              </>
            )}
          </div>
          <button
            type="button"
            className="border-l border-gray-300 flex items-center justify-center
             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-0
              transition-all duration-100"
            style={{
              width: height,
              height: height,
            }}
          >
            <span className="text-xl text-blue-600">
              <UploadOutlined />
            </span>
          </button>
        </div>
      </Upload>
      <OfficePreviewModal fileUrl={filePreview} open={open} setOpen={setOpen} />
    </>
  );
};

export default FileUpload;
