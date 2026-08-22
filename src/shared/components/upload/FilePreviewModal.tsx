import { Modal, Button } from "antd";
import { ArrowDownTrayIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { buildFileUrl } from "@/shared/utils/url.util";
import { downloadFile } from "@/shared/utils/file.util";

interface FilePreviewModalProps {
  open: boolean;
  onClose: () => void;
  fileUrl: string;
  fileName: string;
}

const FilePreviewModal: React.FC<FilePreviewModalProps> = ({
  open,
  onClose,
  fileUrl,
  fileName,
}) => {
  const fullUrl = buildFileUrl(fileUrl);
  const encodedUrl = encodeURIComponent(fullUrl);
  const ext = fileName.split(".").pop()?.toLowerCase() || "";

  const isImage = /^(jpg|jpeg|png|gif|webp|bmp)$/i.test(ext);
  const isPdf = ext === "pdf";
  const isOffice = /^(docx?|dotx?|xlsx?|xlsb|pptx?)$/i.test(ext);

  const renderContent = () => {
    if (isImage) {
      return (
        <div className="flex items-center justify-center h-full bg-[#1a1a1a]">
          <img src={fullUrl} alt={fileName} className="max-w-full max-h-full object-contain" />
        </div>
      );
    }

    if (isPdf) {
      return (
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
          <div className="h-full">
            <Viewer fileUrl={fullUrl} />
          </div>
        </Worker>
      );
    }

    if (isOffice) {
      const officeViewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodedUrl}`;
      return (
        <iframe
          src={officeViewerUrl}
          className="w-full h-full border-0 rounded-md"
          title="Office Viewer"
        />
      );
    }

    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        <div className="text-center">
          <p className="text-lg mb-2">Không thể xem trước định dạng này</p>
          <Button
            type="primary"
            icon={<ArrowDownTrayIcon className="h-4 w-4" />}
            onClick={() => downloadFile(fileUrl)}
          >
            Tải xuống
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Modal
      title={
        <div className="flex items-center justify-between w-full pr-8">
          <span className="text-lg font-semibold truncate max-w-[500px]">{fileName}</span>
          <Button
            type="text"
            icon={<ArrowDownTrayIcon className="h-5 w-5" />}
            onClick={() => downloadFile(fileUrl)}
            title="Tải xuống"
          />
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      width="100vw"
      style={{ top: 10 }}
      className="fullscreen-modal"
      closeIcon={<XMarkIcon className="h-5 w-5" />}
      destroyOnClose
    >
      <div className="h-full w-full">{renderContent()}</div>
    </Modal>
  );
};

export default FilePreviewModal;
