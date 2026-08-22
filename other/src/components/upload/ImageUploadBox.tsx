import { Image, Upload, UploadFile, Dropdown, MenuProps, Spin } from "antd";
import { useState, useEffect, useRef } from "react";
import { UploadProps } from "antd/lib";
import { getBase64 } from "../../utils/base64";
import { IFile } from "../../models/base/file";
import { uploads, deleteFile, setMainFile } from "../../utils/fileUtil";
import { FileCategoryEnum, FileEntityEnum } from "../../constants/enum";
import { buildFileUrl } from "../../utils/paramUtils";
import {
  CheckIcon,
  EllipsisVerticalIcon,
  PlusIcon,
  StarIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import ImageLoadingSpinner from "../loading/ImageLoadingSpinner";

type ImageUploadBoxProps = {
  defaultFiles?: IFile[];
  maxCount?: number;
  oId: string;
  entity: FileEntityEnum;
  category: FileCategoryEnum;
  isActive?: boolean;
  hasSetMain?: boolean;
  onChange?: (files: IFile[]) => void;
  onReload?: () => void;
};

const ImageUploadBox: React.FC<ImageUploadBoxProps> = ({
  defaultFiles = [],
  maxCount = 5,
  oId,
  entity,
  category,
  isActive = false,
  hasSetMain = false,
  onChange,
  onReload,
}) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<IFile[]>(defaultFiles);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [imageLoadStates, setImageLoadStates] = useState<{
    [key: string]: boolean;
  }>({});
  const uploadTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (defaultFiles.length > 0) {
      const initialFileList = defaultFiles.map((file) => ({
        uid: file.id,
        name: file.originalName,
        status: "done",
        url: file.url,
        response: file,
        thumbUrl: file.thumbnailUrl,
      })) as UploadFile[];
      setFileList(initialFileList);
      setUploadedFiles(defaultFiles);
    }
  }, [defaultFiles]);

  useEffect(() => {
    return () => {
      if (uploadTimeoutRef.current) {
        clearTimeout(uploadTimeoutRef.current);
      }
    };
  }, []);

  const handleChange: UploadProps["onChange"] = async ({ fileList: newFileList }) => {
    try {
      setFileList(newFileList);

      // Clear previous timeout
      if (uploadTimeoutRef.current) {
        clearTimeout(uploadTimeoutRef.current);
      }

      // Debounce upload to batch multiple files together
      uploadTimeoutRef.current = setTimeout(async () => {
        const filesToUpload = newFileList.filter(
          (file) => file.originFileObj && file.status !== "done" && !file.response,
        );

        if (filesToUpload.length > 0 && !uploading) {
          setUploading(true);
          const result = await uploads({
            files: filesToUpload,
            oId,
            entity,
            category,
            isActive,
          });
          onReload?.();
          if (result && result.length > 0) {
            const updatedFiles = [...uploadedFiles, ...result];
            setUploadedFiles(updatedFiles);
            onChange?.(updatedFiles);

            const updatedFileList = newFileList.map((file) => {
              if (file.originFileObj && file.status !== "done") {
                const uploadedFile = result.find((f) => f.originalName === file.name);
                if (uploadedFile) {
                  return {
                    ...file,
                    status: "done" as const,
                    url: uploadedFile.url,
                    response: uploadedFile,
                    uid: uploadedFile.id,
                    thumbUrl: uploadedFile.thumbnailUrl || uploadedFile.url,
                  } as UploadFile;
                }
              }
              return file;
            });
            setFileList(updatedFileList);
          } else {
            // Upload failed - remove files from list
            const failedFileUids = filesToUpload.map((f) => f.uid);
            const updatedFileList = newFileList.filter(
              (file) => !failedFileUids.includes(file.uid),
            );
            setFileList(updatedFileList);
          }
          setUploading(false);
        }
      }, 300);
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview && file.originFileObj) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleRemove = async (file: UploadFile) => {
    setLoading(true);
    try {
      const fileId = file.response?.id || file.uid;

      if (file.status === "done" && fileId) {
        const success = await deleteFile(fileId);
        if (!success) {
          setLoading(false);
          return false;
        }

        onReload?.();
      }

      const updatedList = fileList.filter((f) => f.uid !== file.uid);
      const updatedFiles = uploadedFiles.filter((f) => f.id !== fileId);

      setFileList(updatedList);
      setUploadedFiles(updatedFiles);
      onChange?.(updatedFiles);
      setLoading(false);

      return true;
    } catch (error) {
      console.error("Error removing file:", error);
      setLoading(false);
      return false;
    } finally {
      setLoading(false);
    }
  };
  const handleSetMain = async (file: UploadFile) => {
    setLoading(true);
    try {
      const res: Boolean = await setMainFile(file.response?.id || file.uid);
      setLoading(false);
      if (!res) return;
      onReload?.();

      const updatedFiles = uploadedFiles.map((f) => ({
        ...f,
        isMain: f.id === (file.response?.id || file.uid),
      }));
      setUploadedFiles(updatedFiles);
      onChange?.(updatedFiles);
    } catch (error) {
      console.error("Error setting main file:", error);
      setLoading(false);
      return;
    } finally {
      setLoading(false);
    }
  };

  const handleImageLoad = (fileUid: string) => {
    setImageLoadStates((prev) => ({ ...prev, [fileUid]: true }));
  };

  const handleImageError = (fileUid: string) => {
    setImageLoadStates((prev) => ({ ...prev, [fileUid]: false }));
  };

  const getMenuItems = (file: UploadFile): MenuProps["items"] => [
    {
      key: "setMain",
      label: "Đặt làm ảnh chính",
      icon: <CheckIcon className="h-5 w-5" />,
      onClick: () => handleSetMain(file),
    },
    {
      key: "delete",
      label: "Xóa ảnh",
      icon: <TrashIcon className="h-5 w-5" />,
      onClick: () => handleRemove(file),
    },
  ];

  const itemRender = (originNode: React.ReactElement, file: UploadFile) => {
    const isMain = file.response?.isMain || uploadedFiles.find((f) => f.id === file.uid)?.isMain;
    const isLoaded = imageLoadStates[file.uid];

    return (
      <div className="relative group">
        <div onClick={() => handlePreview(file)} className="cursor-pointer">
          <div className="w-[104px] h-[104px] border border-gray-300 rounded-lg overflow-hidden bg-gray-100">
            {!isLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <ImageLoadingSpinner size={32} />
              </div>
            )}
            <img
              src={buildFileUrl(file.thumbUrl || file.url || file.response?.url || "")}
              alt={file.name}
              crossOrigin="anonymous"
              className="w-full h-full object-cover"
              style={{ display: isLoaded ? "block" : "none" }}
              onLoad={() => handleImageLoad(file.uid)}
              onError={() => handleImageError(file.uid)}
            />
          </div>
        </div>

        {/* Main indicator */}
        {isMain && (
          <div className="absolute top-1 left-1 z-10 bg-yellow-400 rounded-full  flex items-center justify-center h-5 w-5">
            <StarIcon className="h-4 w-4 text-white" />
          </div>
        )}

        {/* Action button */}
        <div className="absolute top-1 right-1 z-10">
          {hasSetMain ? (
            <Dropdown
              menu={{ items: getMenuItems(file) }}
              trigger={["click"]}
              placement="bottomRight"
            >
              <button
                type="button"
                onClick={(e) => e.stopPropagation()}
                className="rounded w-6 h-6 flex items-center justify-center shadow-md bg-white/50 hover:bg-white transition-colors ease-in-out"
              >
                <EllipsisVerticalIcon className="h-5 w-5 text-gray-600" />
              </button>
            </Dropdown>
          ) : (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove(file);
              }}
              className="rounded w-6 h-6 flex items-center justify-center shadow-md bg-white text-red-400 hover:text-white hover:bg-red-500 transition-colors"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-wrap gap-4 relative">
      {fileList.map((file) => (
        <div key={file.uid}>{itemRender(<></>, file)}</div>
      ))}

      <Upload
        listType="picture-card"
        fileList={fileList}
        onChange={handleChange}
        onRemove={handleRemove}
        multiple
        accept="image/*"
        maxCount={maxCount}
        beforeUpload={() => false}
        showUploadList={false}
        disabled={uploading}
        itemRender={itemRender}
      >
        {fileList.length < maxCount && (
          <div>
            <PlusIcon className="h-8 w-10 rounded-full p-2" />
          </div>
        )}
      </Upload>

      {previewImage && (
        <Image
          wrapperStyle={{ display: "none" }}
          crossOrigin="anonymous"
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(""),
          }}
          src={buildFileUrl(previewImage)}
        />
      )}

      {loading && (
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-lg">
          <Spin />
        </div>
      )}
    </div>
  );
};

export default ImageUploadBox;
