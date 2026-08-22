import { Tag } from "antd";
import { HOST_URL } from "../../constants/ApiEndpoint";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";

interface DownLoadButtonProps {
  fileUrl: string;
  justIcon?: boolean;
  onClick?: () => void;
}

const DownLoadButton: React.FC<DownLoadButtonProps> = ({ fileUrl, justIcon, onClick }) => {
  if (justIcon) {
    return (
      <button
        className="p-2 hover:bg-[#fff2e8] rounded-md transition-all duration-200 ease-in-out cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          window.open(`${HOST_URL}${fileUrl}`, "_blank");
          onClick?.();
        }}
        title="Tải xuống"
      >
        <ArrowDownTrayIcon className="h-3 w-3 text-[#d4380d]" />
      </button>
    );
  }
  return (
    <Tag
      color="volcano"
      className="border-0 m-0 flex gap-1 px-3 h-[28px] justify-center items-center cursor-pointer "
      onClick={(e) => {
        e.stopPropagation();
        window.open(`${HOST_URL}${fileUrl}`, "_blank");
        onClick?.();
      }}
    >
      <ArrowDownTrayIcon className="h-3 w-3" />
      Tải xuống
    </Tag>
  );
};

export default DownLoadButton;
