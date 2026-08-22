import { GetProp, Image, UploadFile } from "antd";
import React, { useState } from "react";
import { UploadProps } from "antd/lib";
import { getBase64 } from "../../utils/base64";
import { IFile } from "../../models/base/file";

type ImageBoxProps = {
  fileList?: IFile[];
};

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const ImageBox: React.FC<ImageBoxProps> = ({ fileList }) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const onPreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  return (
    <div className="flex flex-wrap gap-4">
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
    </div>
  );
};

export default ImageBox;
