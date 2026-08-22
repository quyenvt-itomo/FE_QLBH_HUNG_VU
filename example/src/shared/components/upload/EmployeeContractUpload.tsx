import { App, Button, Upload } from "antd";
import { useEffect, useMemo, useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import { UploadProps } from "antd/lib";
import {
  CameraIcon,
  DocumentIcon,
  PhotoIcon,
  TableCellsIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { File as IFile } from "@/shared/interfaces/file";
import { FileCategory, EntityFile } from "@/shared/constants/enum";
import { deleteFile, uploads } from "@/shared/utils/file.util";
import { buildFileUrl } from "@/shared/utils/url.util";

type EmployeeContractUploadProps = {
  defaultFile?: IFile | null;
  oId?: string;
  entity?: EntityFile;
  category?: FileCategory;
  isActive?: boolean;
  limit?: number;
  width?: number;
  onChange?: (file: IFile | null) => void;
  onMoveToTrash?: (file: IFile) => void;
};

const ACCEPT_EXTENSIONS = [
  "jpg",
  "jpeg",
  "png",
  "webp",
  "gif",
  "pdf",
  "doc",
  "docx",
  "xls",
  "xlsx",
];

const IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "gif"];
const EXCEL_EXTENSIONS = ["xls", "xlsx"];
const WORD_EXTENSIONS = ["doc", "docx"];

const getExtension = (name: string): string => {
  const extension = name.split(".").pop();
  return extension ? extension.toLowerCase() : "";
};

const getFileIcon = (file?: IFile | null) => {
  const extension = getExtension(file?.originalName || file?.fileName || file?.url || "");

  if (IMAGE_EXTENSIONS.includes(extension)) {
    return <PhotoIcon className="h-5 w-5 text-sky-500" />;
  }
  if (extension === "pdf") {
    return <DocumentIcon className="h-5 w-5 text-red-500" />;
  }
  if (EXCEL_EXTENSIONS.includes(extension)) {
    return <TableCellsIcon className="h-5 w-5 text-emerald-600" />;
  }
  if (WORD_EXTENSIONS.includes(extension)) {
    return <DocumentIcon className="h-5 w-5 text-blue-600" />;
  }

  return <CameraIcon className="h-5 w-5 text-gray-500" />;
};

export const EmployeeContractUpload: React.FC<EmployeeContractUploadProps> = ({
  defaultFile,
  oId,
  entity = EntityFile.EMPLOYEE_CONTRACT,
  category = FileCategory.DOCUMENT,
  isActive = false,
  limit = 100,
  width = 148,
  onChange,
  onMoveToTrash,
}) => {
  const { modal, message } = App.useApp();
  const [uploadedFile, setUploadedFile] = useState<IFile | null>(defaultFile || null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setUploadedFile(defaultFile || null);
  }, [defaultFile]);

  const fileName = useMemo(
    () => uploadedFile?.originalName || uploadedFile?.fileName || "Tài liệu",
    [uploadedFile],
  );

  const beforeUpload = (file: File) => {
    const extension = getExtension(file.name);
    const isAllowedType = ACCEPT_EXTENSIONS.includes(extension);

    if (!isAllowedType) {
      message.error("Chỉ hỗ trợ ảnh, PDF, Word và Excel!");
      return false;
    }

    const isLt = file.size / 1024 / 1024 < limit;
    if (!isLt) {
      message.error(`File phải nhỏ hơn ${limit}MB!`);
      return false;
    }

    return true;
  };

  const handleUpload: UploadProps["customRequest"] = async ({ file, onSuccess, onError }) => {
    const uploadFile = file as File;
    setUploading(true);

    try {
      const result = await uploads({
        files: [
          {
            uid: Date.now().toString(),
            name: uploadFile.name,
            status: "uploading",
            originFileObj: uploadFile,
          } as any,
        ],
        oId,
        entity,
        category,
        isActive,
        messageApi: message,
      });

      if (result && result.length > 0) {
        const uploaded = result[0];
        setUploadedFile(uploaded);
        onChange?.(uploaded);
        onSuccess?.(uploaded);
      } else {
        setUploadedFile(null);
        onChange?.(null);
        onError?.(new Error("Upload failed"));
      }
    } catch (error) {
      onError?.(error as Error);
    } finally {
      setUploading(false);
    }
  };

  const doRemove = async () => {
    if (!uploadedFile) return;

    const success = await deleteFile(uploadedFile.id, message);
    if (!success) return;

    setUploadedFile(null);
    onChange?.(null);
  };

  const handleRemove = async () => {
    if (!uploadedFile || uploading) return;

    // Edit form flow: keep file in temporary trash and let outer submit decide actual deletion.
    if (!isActive && uploadedFile.status === "active") {
      onMoveToTrash?.(uploadedFile);
      setUploadedFile(null);
      onChange?.(null);
      return;
    }

    if (isActive || uploadedFile?.status === "active") {
      modal.confirm({
        title: "Xác nhận xóa file",
        content: "File đang được sử dụng. Bạn có chắc chắn muốn xóa không?",
        okText: "Xóa",
        cancelText: "Hủy",
        okButtonProps: { danger: true },
        onOk: doRemove,
      });
      return;
    }

    await doRemove();
  };

  return uploadedFile ? (
    <div className="group relative flex items-center" style={{ width }}>
      <Button
        type="link"
        className="!px-2 flex items-center gap-2 truncate h-7"
        title={fileName}
        onClick={() => window.open(buildFileUrl(uploadedFile.url), "_blank", "noopener,noreferrer")}
      >
        {getFileIcon(uploadedFile)}
        <span className="truncate">Xem tài liệu</span>
      </Button>

      <button
        type="button"
        title="Xóa file"
        onClick={handleRemove}
        disabled={uploading}
        className="
					absolute right-1 top-1/2 -translate-y-1/2
					rounded w-6 h-6 bg-panel text-red-400 hover:text-white hover:bg-red-500
					flex items-center justify-center transition-all ease-in-out
				"
      >
        <XMarkIcon className="w-4 h-4" />
      </button>
    </div>
  ) : (
    <Upload
      maxCount={1}
      showUploadList={false}
      customRequest={handleUpload}
      beforeUpload={beforeUpload}
      accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
      disabled={uploading}
    >
      <Button
        style={{ width }}
        loading={uploading}
        className="!border-none !shadow-none !ring-0 h-7"
      >
        <UploadOutlined />
      </Button>
    </Upload>
  );
};
