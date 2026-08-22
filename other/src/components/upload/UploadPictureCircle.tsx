import { GetProp, Image, Upload, UploadProps } from "antd";
import { UploadFile } from "antd/lib";
import { useState } from "react";

interface UploadPictureCircleProps {
  fileList: UploadFile[];
  onChange: UploadProps["onChange"];
}

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const UploadPictureCircle: React.FC<UploadPictureCircleProps> = ({
  fileList,
  onChange,
  ...rest
}) => {
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string>("");

  const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const onPreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  return (
    <>
      <Upload
        listType="picture-circle"
        fileList={fileList}
        beforeUpload={() => false}
        maxCount={1}
        accept="image/*"
        onChange={onChange}
        onPreview={onPreview}
      >
        {fileList.length < 1 && "Tải ảnh"}
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
          src={previewImage}
        />
      )}
    </>
  );
};

export default UploadPictureCircle;
