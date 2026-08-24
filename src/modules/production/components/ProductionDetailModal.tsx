import React from "react";
import { Modal, Descriptions } from "antd";
import { Production } from "../production.model";
import { Title } from "@/shared";
import { formatDate } from "@/shared/utils/date.util";

interface Props { open: boolean; data?: Production; onClose: () => void; onOpenUpdate?: (r: Production) => void; }
export const ProductionDetailModal: React.FC<Props> = ({ open, data, onClose, onOpenUpdate }) => {
  if (!data) return null;
  const info = [
    { label: "M?", value: data.code || "--" },
    { label: "Ngày t?o", value: data.createdAt ? formatDate(data.createdAt) : "--" },
    { label: "Ghi chú", value: data.note || "--" },
  ];
  return (
    <Modal title={"Chi ti?t L?nh s?n xu?t"} open={open} onCancel={onClose} footer={onOpenUpdate ? <button className="text-blue-500 hover:underline text-sm" onClick={()=>onOpenUpdate(data)}>Ch?nh s?a</button> : null} width={700} destroyOnClose>
      <Descriptions column={2} size="small" bordered>
        {info.map((i, idx) => <Descriptions.Item key={idx} label={i.label}>{i.value}</Descriptions.Item>)}
      </Descriptions>
    </Modal>
  );
};
