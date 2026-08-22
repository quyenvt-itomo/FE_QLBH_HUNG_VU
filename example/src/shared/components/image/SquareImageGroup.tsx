import React from "react";
import { Image } from "antd";
import SquareImage from "./SquareImage";
import { File } from "@/shared/interfaces/file";

interface SquareImageGroupProps {
  images?: File[];
  size?: number;
}

const SquareImageGroup: React.FC<SquareImageGroupProps> = ({ images, size }) => {
  if (!images || images.length === 0) {
    return null;
  }

  // Prevent event bubbling to parent (like onRow in Table)
  const handlePreviewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <span onClick={handlePreviewClick}>
      <Image.PreviewGroup
        preview={{
          getContainer: false,
          onVisibleChange: () => {},
        }}
      >
        <div className="flex gap-1">
          {images?.map((img, index) => (
            <div key={index}>
              <SquareImage image={img} size={size} />
            </div>
          ))}
        </div>
      </Image.PreviewGroup>
    </span>
  );
};

export default SquareImageGroup;
