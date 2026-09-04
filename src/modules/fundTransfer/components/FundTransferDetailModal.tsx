import React from "react";
import { Button, Descriptions, Modal } from "antd";
import { DetailModalProps } from "@/shared/interfaces/common";
import { formatDateTimeDDMMYYYY } from "@/shared/utils/date.util";
import { formatMoney } from "@/shared/utils/number.util";
import { FundTransfer } from "../fundTransfer.model";

export const FundTransferDetailModal: React.FC<DetailModalProps<FundTransfer>> = ({ open, data, onClose, onOpenUpdate }) => {
  if (!data) return null;
  return <Modal open={open} centered destroyOnClose footer={null} title={`Chi tiết phiếu chuyển quỹ ${data.code || ""}`} onCancel={onClose}>
    <Descriptions bordered size="small" column={1}>
      <Descriptions.Item label="Thời gian">{formatDateTimeDDMMYYYY(data.occurredAt)}</Descriptions.Item>
      <Descriptions.Item label="Quỹ chuyển đi">{data.fromFund?.name || "—"}</Descriptions.Item>
      <Descriptions.Item label="Quỹ nhận">{data.toFund?.name || "—"}</Descriptions.Item>
      <Descriptions.Item label="Số tiền">{formatMoney(data.amount)}</Descriptions.Item>
      <Descriptions.Item label="Ghi chú">{data.note || "—"}</Descriptions.Item>
    </Descriptions>
    <div className="mt-4 flex justify-end gap-2"><Button onClick={onClose}>Đóng</Button>{onOpenUpdate && <Button type="primary" onClick={() => onOpenUpdate(data)}>Chỉnh sửa</Button>}</div>
  </Modal>;
};
