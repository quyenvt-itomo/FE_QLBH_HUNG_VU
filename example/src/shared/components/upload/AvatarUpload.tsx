import { App, Upload } from "antd";
import { useState, useEffect } from "react";
import { UploadProps } from "antd/lib";
import { File as IFile } from "@/shared/interfaces/file";
import { FileCategory, EntityType } from "@/shared/constants/enum";
import { getBase64 } from "@/shared/utils/base64";
import { deleteFile, uploads } from "@/shared/utils/file.util";
import { buildFileUrl } from "@/shared/utils/url.util";
import { CameraIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";
import ImageLoadingSpinner from "../loading/ImageLoadingSpinner";

type AvatarUploadProps = {
  defaultFile?: IFile | null;
  size?: number;
  shape?: "circle" | "square";
  oId?: string;
  entity: EntityType;
  category: FileCategory;
  isActive?: boolean;
  limit?: number;
  onChange?: (file: IFile | null) => void;
  onMoveToTrash?: (file: IFile) => void;
};

const AvatarUpload: React.FC<AvatarUploadProps> = ({
  defaultFile,
  size = 110,
  shape = "square",
  oId,
  entity,
  category,
  isActive = false,
  limit = 10,
  onChange,
  onMoveToTrash,
}) => {
  const { modal, message } = App.useApp();
  const [uploadedFile, setUploadedFile] = useState<IFile | null>(defaultFile || null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (defaultFile) {
      setUploadedFile(defaultFile);
      setImageUrl(defaultFile.thumbnailUrl || defaultFile.url);
    }
  }, [defaultFile]);

  const handleUpload: UploadProps["customRequest"] = async ({ file }) => {
    const uploadFile = file as File;

    // Preview immediately
    const preview = await getBase64(uploadFile);
    setImageUrl(preview);
    setImageLoaded(false);
    setUploading(true);

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
      setImageUrl(uploaded.thumbnailUrl || uploaded.url);
      onChange?.(uploaded);
    } else {
      setImageUrl("");
      setUploadedFile(null);
    }
    setUploading(false);
  };

  const handleRemove = async () => {
    if (!uploadedFile) return;

    // Edit form flow: move active file to temporary trash and delete it on outer submit.
    if (!isActive && uploadedFile.status === "active") {
      onMoveToTrash?.(uploadedFile);
      setUploadedFile(null);
      setImageUrl("");
      onChange?.(null);
      return;
    }

    if (isActive) {
      modal.confirm({
        title: "Xác nhận xóa ảnh",
        content: "Ảnh đang được sử dụng. Bạn có chắc chắn muốn xóa không?",
        okText: "Xóa",
        cancelText: "Hủy",
        okButtonProps: { danger: true },
        onOk: doRemove,
      });
    } else {
      await doRemove();
    }
  };

  const doRemove = async () => {
    if (!uploadedFile) return;

    const success = await deleteFile(uploadedFile.id, message);
    if (!success) return;

    setUploadedFile(null);
    setImageUrl("");
    onChange?.(null);
  };

  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("Chỉ được upload file ảnh!");
      return false;
    }
    const isLt = file.size / 1024 / 1024 < limit;
    if (!isLt) {
      message.error(`Ảnh phải nhỏ hơn ${limit}MB!`);
      return false;
    }
    return true;
  };

  const shapeClasses = shape === "circle" ? "rounded-full" : "rounded-lg";

  return (
    <div className="relative h-full">
      <div
        className="relative group"
        style={{
          width: size,
          height: size,
        }}
      >
        <div
          className={`
            ${shapeClasses}
            overflow-hidden
            border border-gray-300 dark:border-gray-700
            bg-gray-100 dark:bg-gray-800
            flex items-center justify-center
          `}
          style={{
            width: size,
            height: size,
          }}
        >
          {imageUrl ? (
            <>
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <ImageLoadingSpinner size={size / 3} />
                </div>
              )}
              <img
                src={buildFileUrl(imageUrl)}
                alt="Avatar"
                crossOrigin="anonymous"
                className="w-full h-full object-cover"
                style={{ display: imageLoaded ? "block" : "none" }}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageLoaded(false)}
              />
            </>
          ) : (
            <CameraIcon className="w-1/3 h-1/3 text-gray-400" />
          )}
        </div>

        {/* Upload overlay */}
        <Upload
          accept="image/*"
          showUploadList={false}
          customRequest={handleUpload}
          beforeUpload={beforeUpload}
          disabled={uploading}
        >
          <div
            className={`absolute inset-0 ${shapeClasses} text-transparent hover:text-white hover:bg-black/30 transition-all ease-in-out flex items-center justify-center cursor-pointer`}
          >
            <CameraIcon className="w-1/3 h-1/3 " />
          </div>
        </Upload>

        {/* Remove button */}
        {uploadedFile && (
          <button
            type="button"
            title="Xóa ảnh"
            onClick={handleRemove}
            disabled={uploading}
            className={`
              ${
                size >= 56
                  ? "top-1 right-1 rounded w-6 h-6 "
                  : "-top-px -right-px rounded-sm w-4 h-4"
              }
              absolute bg-panel text-red-400 hover:text-white hover:bg-red-500 z-10
              flex items-center justify-center shadow-md transition-all ease-in-out
            `}
          >
            {size >= 56 ? <TrashIcon className="w-4 h-4" /> : <XMarkIcon className="w-4 h-4" />}
          </button>
        )}
      </div>
    </div>
  );
};

export default AvatarUpload;
