import { Modal, Tag } from "antd";
import { useState } from "react";
import { HOST_URL } from "../../constants/ApiEndpoint";
import { parseFileInfo } from "../../utils/fileUtil";
import { EyeIcon } from "@heroicons/react/24/outline";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import DownLoadButton from "../button/DownloadButton";
import "./OfficePreviewModal.css";

interface OfficePreviewModalProps {
  fileUrl: string;
  justIcon?: boolean;
  onClick?: () => void;
}

const OfficePreviewModal: React.FC<OfficePreviewModalProps> = ({ fileUrl, justIcon, onClick }) => {
  const [open, setOpen] = useState(false);

  const { name, date, ext } = parseFileInfo(fileUrl.replace("uploads/temp/", ""));
  const fullUrl = `${HOST_URL}${fileUrl}`;
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
    <>
      {justIcon ? (
        <button
          className="p-2 hover:bg-[#e6f4ff] rounded-md transition-all duration-200 ease-in-out cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            setOpen(true);
            onClick?.();
          }}
          title="Xem trước"
        >
          <EyeIcon className="h-4 w-4 text-primary" />
        </button>
      ) : (
        <Tag
          color="blue"
          className="border-0 m-0 flex gap-1 px-3 h-[28px] justify-center items-center cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            setOpen(true);
            onClick?.();
          }}
        >
          <EyeIcon className="h-4 w-4" />
          Xem
        </Tag>
      )}

      <Modal
        title={
          <div className="flex items-center gap-6">
            <span className="text-lg font-semibold truncate w-[400px]">
              {name}
              {ext}
            </span>
            <span className="text-sm  flex gap-4 text-gray-500">Ngày tải lên: {date}</span>
            <DownLoadButton fileUrl={fileUrl} />
          </div>
        }
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        width="100vw"
        className="office-preview-modal"
        style={{ top: 10 }}
        styles={{
          body: { height: "88vh", padding: 0 },
        }}
        // bodyStyle={{ height: "88vh", padding: 0 }}
      >
        <div className="h-full w-full">{renderContent()}</div>
      </Modal>
    </>
  );
};

export default OfficePreviewModal;
