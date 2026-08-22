import { Upload, Image, Empty } from "antd";
import React, { useState } from "react";

type ImageViewBoxProps = {
  fileList?: string[]; // mảng URL từ backend
};

const ImageViewBox: React.FC<ImageViewBoxProps> = ({ fileList }) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  // Chuyển fileList string[] thành dạng UploadFile để Upload hiển thị
  const uploadFileList = fileList?.map((url, index) => ({
    uid: index.toString(),
    name: url.split("/").pop() || `file-${index}`,
    status: "done" as const,
    url,
  }));

  const onPreview = (file: any) => {
    setPreviewImage(file.url);
    setPreviewOpen(true);
  };

  if (!fileList?.length)
    return (
      <div className="h-86 w-full flex justify-center items-center">
        <Empty description="Chưa có hình ảnh nào được tải lên" />
      </div>
    );

  return (
    <div className="flex flex-wrap gap-4">
      <Upload
        listType="picture-card"
        fileList={uploadFileList}
        onPreview={onPreview}
        beforeUpload={() => false} // không cho upload
        showUploadList={{
          showRemoveIcon: false, // ẩn nút xóa
          showPreviewIcon: true, // vẫn cho preview
        }}
      />
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

export default ImageViewBox;
