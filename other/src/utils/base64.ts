import { GetProp, UploadProps } from "antd";
import { UploadFile } from "antd/lib";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

export const getBase64 = (file: FileType | File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export const handlePreview = async (
  file: UploadFile,
  setPreviewImage: any,
  setPreviewOpen: any,
) => {
  if (!file.url && !file.preview) {
    file.preview = await getBase64(file.originFileObj as FileType);
  }
  setPreviewImage(file.url || (file.preview as string));
  setPreviewOpen(true);
};
