import { Button, Dropdown } from "antd";
import { HOST_URL } from "../../constants/ApiEndpoint";
import HeaderTooltip from "../table/HeaderTooltip";
import { DocumentIcon } from "@heroicons/react/24/outline";
import { parseFileInfo } from "../../utils/fileUtil";
import { useState } from "react";
import { icons } from "../../assets/icons";
import FileIcon from "../icon/FileIcon";
import OfficePreviewModal from "../modal/OfficePreviewModal";
import DownLoadButton from "../button/DownloadButton";

interface MediaDropdownProps {
  files?: string[];
}

const MediaDropdown: React.FC<MediaDropdownProps> = ({ files }) => {
  const [open, setOpen] = useState<boolean>(false);

  const handlePreview = (file: string) => {
    window.open(`${HOST_URL}${file}`, "_blank");
  };

  if (!files || files.length === 0) {
    return "Chưa có tài liệu nào được đính kèm";
  }

  const dropdownContent = (
    <div className="w-[456px] grid gap-4 p-4 max-h-[300px] overflow-y-auto grid-cols-[repeat(auto-fit,minmax(250px,1fr))] rounded-md bg-white shadow-sm border">
      {files.map((file) => {
        const { name, date, ext } = parseFileInfo(file.replace("uploads/temp/", ""));
        return (
          <div
            key={file}
            className="flex items-center gap-2 px-1 hover:bg-slate-50 rounded-md transition-all duration-200 ease-in-out cursor-pointer"
          >
            <div
              className="w-6 h-6 relative flex-shrink-0 cursor-pointer"
              onClick={() => handlePreview(file)}
            >
              <FileIcon file={file} />
            </div>

            <div
              className="flex flex-col flex-1 justify-between"
              style={{ width: "calc(100% - 220px)" }}
            >
              <HeaderTooltip title={`${name}${ext}`} />
              <div className="text-sm text-gray-500">{date}</div>
            </div>
            <div className="flex items-center gap-2">
              <OfficePreviewModal fileUrl={file} onClick={() => setOpen(false)} />
              <DownLoadButton fileUrl={file} />
            </div>
          </div>
        );
      })}
    </div>
  );

  if (files.length === 1) {
    const file = files[0];
    const { name, ext } = parseFileInfo(file.replace("uploads/temp/", ""));
    return (
      <div key={file} className="flex relative group items-center gap-2 px-2 py-1 w-60">
        <div
          className="w-6 h-6 relative flex justify-center items-center flex-shrink-0 cursor-pointer"
          onClick={() => handlePreview(file)}
        >
          <FileIcon file={file} />
        </div>

        <div
          className="truncate"
          style={{
            width: "calc(100% - 100px)",
          }}
        >{`${name}${ext}`}</div>
        <div className="flex items-center absolute right-2 transform translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-200 ease-in-out">
          <OfficePreviewModal fileUrl={file} onClick={() => setOpen(false)} justIcon />
          <DownLoadButton fileUrl={file} justIcon />
        </div>
      </div>
    );
  }

  return (
    <Dropdown
      trigger={["click"]}
      dropdownRender={() => dropdownContent}
      placement="bottomRight"
      open={open}
      onOpenChange={(open) => setOpen(open)}
    >
      <Button type="link" className="flex items-center gap-1 text-blue-600" size="small">
        <img src={icons.multiFile} className="h-6 w-6 object-cover" />
        Nhiều tài liệu
      </Button>
    </Dropdown>
  );
};

export default MediaDropdown;
