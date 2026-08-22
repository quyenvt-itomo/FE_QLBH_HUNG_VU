import React from "react";
import { Modal, Descriptions } from "antd";
import { PaymentRequest } from "../paymentRequest.model";
import Title from "@/shared/components/display/Title";
import { formatDate } from "@/shared/utils/date.util";

interface Props { open: boolean; data?: PaymentRequest; onClose: () => void; onOpenUpdate?: (r: PaymentRequest) => void; }
export const PaymentRequestDetailModal: React.FC<Props> = ({ open, data, onClose, onOpenUpdate }) => {
  if (!data) return null;
  const info = [
    { label: "Mã", value: data.code || "--" },
    { label: "Ngày tạo", value: data.createdAt ? formatDate(data.createdAt) : "--" },
    { label: "Ghi chú", value: data.note || "--" },
  ];
  return (
    <Modal title={"Chi tiết Đề nghị thanh toán"} open={open} onCancel={onClose} footer={onOpenUpdate ? <button className="text-blue-500 hover:underline text-sm" onClick={()=>onOpenUpdate(data)}>Chỉnh sửa</button> : null} width={700} destroyOnClose>
      <Descriptions column={2} size="small" bordered>
        {info.map((i, idx) => <Descriptions.Item key={idx} label={i.label}>{i.value}</Descriptions.Item>)}
      </Descriptions>
    </Modal>
  );
};
