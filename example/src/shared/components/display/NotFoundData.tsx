import { Empty } from "antd";
import React from "react";

const NotFoundData: React.FC = () => {
  return (
    <div className="flex w-full h-full max-h-86 items-center justify-center">
      <div className="flex flex-col gap-1 items-center leading-none select-none ">
        <Empty
          description={
            <span className="text-2xl font-semibold text-gray-400 mt-4 mb-1">
              Không tìm thấy dữ liệu
            </span>
          }
        />
      </div>
    </div>
  );
};

export default NotFoundData;
