import React from "react";
import { Button, Descriptions, Modal, Table } from "antd";
import { DetailModalProps } from "@/shared/interfaces/common";
import { formatDateTimeDDMMYYYY } from "@/shared/utils/date.util";
import { formatMoney, formatQuantity } from "@/shared/utils/number.util";
import { InventoryAdjustment } from "../inventoryAdjustment.model";

export const InventoryAdjustmentDetailsModal: React.FC<DetailModalProps<InventoryAdjustment>> = ({ open, data, onClose, onOpenUpdate }) => {
  if (!data) return null;
  return <Modal open={open} centered destroyOnClose width={900} footer={null} title={`Chi tiết phiếu kiểm kho ${data.code || ""}`} onCancel={onClose}>
    <Descriptions bordered size="small" column={2}><Descriptions.Item label="Ngày kiểm">{formatDateTimeDDMMYYYY(data.occurredAt)}</Descriptions.Item><Descriptions.Item label="Lý do">{data.reason || "--"}</Descriptions.Item><Descriptions.Item label="SL chênh lệch">{formatQuantity(data.totalAdjustmentQuantity)}</Descriptions.Item><Descriptions.Item label="Giá trị chênh lệch">{formatMoney(data.totalAdjustmentAmount)}</Descriptions.Item></Descriptions>
    <Table className="mt-4" rowKey="id" pagination={false} dataSource={data.lines || []} columns={[{ title: "Hàng hóa", render: (_: unknown, line: any) => line.product?.name || line.productSnapshot?.name || "--" }, { title: "Mã hàng", render: (_: unknown, line: any) => line.product?.code || line.productSnapshot?.code || "--" }, { title: "Tồn hệ thống", align: "right" as const, render: (_: unknown, line: any) => formatQuantity(line.expectedQuantity) }, { title: "Thực tế", align: "right" as const, render: (_: unknown, line: any) => formatQuantity(line.countedQuantity) }, { title: "Chênh lệch", align: "right" as const, render: (_: unknown, line: any) => formatQuantity(line.adjustmentQuantity) }]} />
    <div className="mt-4 flex justify-end gap-2"><Button onClick={onClose}>Đóng</Button>{onOpenUpdate && <Button type="primary" onClick={() => onOpenUpdate(data)}>Chỉnh sửa</Button>}</div>
  </Modal>;
};
