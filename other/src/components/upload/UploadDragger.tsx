import React from "react";
import Dragger from "antd/es/upload/Dragger";
import { UploadFile, UploadProps } from "antd";
import { ArrowUpTrayIcon, TrashIcon } from "@heroicons/react/24/outline";

interface UploadDraggerProps {
  fileList: UploadFile[];
  onChange: UploadProps["onChange"];
  onRemove: (uid: string) => void;
}

const UploadDragger: React.FC<UploadDraggerProps> = ({
  fileList,
  onChange,
  onRemove,
}) => {
  return (
    <Dragger
      name="files"
      multiple
      fileList={fileList}
      onChange={onChange}
      beforeUpload={() => false}
      showUploadList={false}
      className="h-20 md:!h-28 !flex !flex-col !items-center !justify-center relative"
    >
      {/* Trạng thái chưa có file */}
      {fileList.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-xs text-[#ACB5BB]">
          <p className="ant-upload-drag-icon">
            <ArrowUpTrayIcon className="h-6" />
          </p>
          <p>Click hoặc kéo thả file vào đây để tải lên</p>
        </div>
      ) : null}

      {/* Danh sách file */}
      <div className="absolute inset-0 overflow-auto p-2">
        {fileList.map((file) => (
          <div
            key={file.uid}
            className="
              flex items-center justify-between hover:bg-slate-100
              transition-all duration-400 ease-in-out px-2 rounded-sm
            "
          >
            <span className="truncate">{file.name}</span>
            <button
              type="button"
              className="transition-all ease-in-out text-red-400 hover:text-red-500"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(file.uid);
              }}
            >
              <TrashIcon className="h-4" />
            </button>
          </div>
        ))}
      </div>
    </Dragger>
  );
};

export default UploadDragger;
