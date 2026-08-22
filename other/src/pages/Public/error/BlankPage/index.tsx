import { Button } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";

export const BlankPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        flexDirection: "column",
        textAlign: "center",
        backgroundColor: "#f9f9f9", // Nền sáng cho thêm đẹp
      }}
      className="w-full"
    >
      <img
        alt="Under development"
        src="/error-404.png"
        style={{
          display: "inline-block",
          maxWidth: "100%",
          width: "300px",
        }}
      />
      <h3
        style={{
          fontWeight: "600",
          marginTop: "20px",
          marginBottom: "10px",
          fontSize: "1.5rem",
        }}
      >
        Bạn không có quyền truy cập trang này
      </h3>
      <p style={{ color: "#888", marginBottom: "20px" }}>
        Vui lòng liên hệ quản trị viên để biết thêm chi tiết.
      </p>
      <Button
        icon={<i className="pi pi-arrow-left" />}
        type="primary"
        onClick={() => navigate(-1)} // Quay lại trang trước
      >
        Quay lại trang chủ
      </Button>
    </div>
  );
};
