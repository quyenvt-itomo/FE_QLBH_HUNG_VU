// OfflineModal.tsx
import React from "react";
import { Modal, Typography } from "antd";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

const OfflineModal: React.FC<{ open: boolean }> = ({ open }) => {
  return (
    <Modal
      title={
        <div className="flex flex-row items-center ">
          <ExclamationTriangleIcon className="w-8 h-8 text-yellow-500 mr-3" />
          <Typography.Title level={3} style={{ margin: 0 }}>
            Mất kết nối mạng
          </Typography.Title>
        </div>
      }
      open={open}
      footer={null}
      closable={false}
      maskClosable={false}
      className="select-none"
    >
      <Typography.Text className="text-base">
        Không có kết nối Internet. Vui lòng kiểm tra mạng của bạn.
      </Typography.Text>
    </Modal>
  );
};

export default OfflineModal;
