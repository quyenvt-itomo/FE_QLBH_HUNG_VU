import React from "react";
import { Modal } from "antd";

interface ConfirmModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  accept: () => void;
  msg?: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ open, setOpen, accept, msg = "Xác nhận" }) => {
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
          <div className="pb-10 pt-4 text-gray-800">
            <span>{msg}</span>
          </div>
        }
        open={open}
        onCancel={handleCancel}
        onOk={handleOk}
        width={500}
        okText="Xác nhận"
        cancelText="Hủy"
      ></Modal>
    </>
  );
};

export default ConfirmModal;
