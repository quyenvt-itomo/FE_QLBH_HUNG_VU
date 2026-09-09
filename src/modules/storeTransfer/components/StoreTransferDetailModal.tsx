import React from "react";
import { Button, Descriptions, Modal, Table } from "antd";
import { DetailModalProps } from "@/shared/interfaces/common";
import { formatDateTimeDDMMYYYY } from "@/shared/utils/date.util";
import { formatQuantity } from "@/shared/utils/number.util";
import { StoreTransfer } from "../storeTransfer.model";

export const StoreTransferDetailModal: React.FC<DetailModalProps<StoreTransfer>> = ({ open, data, onClose, onOpenUpdate }) => {
  if (!data) return null;
  return <Modal open={open} centered destroyOnClose width={900} footer={null} title={`Chi tiết phiếu chuyển kho ${data.code || ""}`} onCancel={onClose}>
    <Descriptions bordered size="small" column={2}>
      <Descriptions.Item label="Ngày chuyển">{formatDateTimeDDMMYYYY(data.occurredAt)}</Descriptions.Item>
      <Descriptions.Item label="Lý do">{data.reason || "--"}</Descriptions.Item>
      <Descriptions.Item label="Kho chuyển đi">{data.fromStore?.name || data.fromStoreSnapshot?.name || "--"}</Descriptions.Item>
      <Descriptions.Item label="Kho nhận">{data.toStore?.name || data.toStoreSnapshot?.name || "--"}</Descriptions.Item>
    </Descriptions>
    <Table rowKey="id" className="mt-4" pagination={false} dataSource={data.lines || []} columns={[
      { title: "Hàng hóa", render: (_: unknown, line: any) => line.product?.name || line.productSnapshot?.name || "--" },
      { title: "Mã hàng", render: (_: unknown, line: any) => line.product?.code || line.productSnapshot?.code || "--" },
      { title: "ĐVT", render: (_: unknown, line: any) => line.unit?.name || line.unitSnapshot?.name || "--" },
      { title: "Số lượng", align: "right" as const, render: (_: unknown, line: any) => formatQuantity(line.quantity) },
    ]} />
    <div className="mt-4 flex justify-end gap-2"><Button onClick={onClose}>Đóng</Button>{onOpenUpdate && <Button type="primary" onClick={() => onOpenUpdate(data)}>Chỉnh sửa</Button>}</div>
  </Modal>;
};
