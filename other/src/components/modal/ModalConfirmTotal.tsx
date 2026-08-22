import React from "react";
import { Modal } from "antd";
import { WarningOutlined } from "@ant-design/icons"; // Import icon

interface ConfirmTotalModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  accept: () => void;
  msg: string;
}

const ConfirmTotalModal: React.FC<ConfirmTotalModalProps> = ({ open, setOpen, accept, msg }) => {
  const handleOk = () => {
    accept();
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <>
      <Modal
        centered
        title={
          <span>
            <WarningOutlined style={{ marginRight: 8, color: "red" }} />
            {msg}
          </span>
        }
        open={open}
        onCancel={handleCancel}
        onOk={handleOk}
        width={500}
        okText="OK"
        cancelText="Hủy"
      >
        <h1>Bạn có chắc chắn muốn lưu</h1>
      </Modal>
    </>
  );
};

export default ConfirmTotalModal;
