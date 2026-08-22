import React from "react";
import { Button, Layout, Result } from "antd";
import { useNavigate } from "react-router-dom";

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Layout className="w-screen h-screen flex justify-center items-center">
      <Result
        status="404"
        title={<span className="text-5xl font-mono">404</span>}
        subTitle="Xin lỗi, đường dẫn này không tồn tại."
        extra={
          <Button type="primary" onClick={() => navigate("/")}>
            Trở lại trang chủ
          </Button>
        }
      />
    </Layout>
  );
};

export default NotFoundPage;
