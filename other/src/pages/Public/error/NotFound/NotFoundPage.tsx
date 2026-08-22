import React from "react";
import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-white w-screen h-screen flex justify-center items-center">
      <Result
        status="404"
        title="404"
        subTitle="Xin lỗi, đường dẫn này không tồn tại."
        extra={
          <Button type="primary" onClick={() => navigate("/")}>
            Trở lại trang chủ
          </Button>
        }
      />
    </div>
  );
};

export default NotFoundPage;
