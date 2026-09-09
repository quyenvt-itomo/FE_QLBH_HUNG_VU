import React from "react";
import { Button, Descriptions, Modal, Table } from "antd";
import { CopyOutlined } from "@ant-design/icons";
import { DetailModalProps } from "@/shared/interfaces/common";
import { formatDateTimeDDMMYYYY } from "@/shared/utils/date.util";
import { formatQuantity } from "@/shared/utils/number.util";
import { InternalExport } from "../internalExport.model";
import { InternalExportTypeTag } from "./Tag";

interface Props extends DetailModalProps<InternalExport> {
  onCopy?: (record: InternalExport) => void;
}

export const InternalExportDetailModal: React.FC<Props> = ({
  open,
  data,
  onClose,
  onOpenUpdate,
  onCopy,
}) => {
  if (!data) return null;
  return (
    <Modal
      open={open}
      centered
      destroyOnClose
      width={850}
      footer={null}
      title={`Chi tiết phiếu xuất nội bộ ${data.code || ""}`}
      onCancel={onClose}
    >
      <Descriptions bordered size="small" column={2}>
        <Descriptions.Item label="Loại xuất">
          <InternalExportTypeTag value={data.type} />
        </Descriptions.Item>
        <Descriptions.Item label="Ngày xuất">
          {formatDateTimeDDMMYYYY(data.occurredAt)}
        </Descriptions.Item>
        <Descriptions.Item label="Mục đích">{data.reason || "--"}</Descriptions.Item>
      </Descriptions>
      <Table
        className="mt-4"
        rowKey="id"
        pagination={false}
        dataSource={data.lines || []}
        columns={[
          {
            title: "Hàng hóa",
            render: (_: unknown, line: any) =>
              line.product?.name || line.productSnapshot?.name || "--",
          },
          {
            title: "Mã hàng",
            render: (_: unknown, line: any) =>
              line.product?.code || line.productSnapshot?.code || "--",
          },
          {
            title: "ĐVT",
            render: (_: unknown, line: any) => line.unit?.name || line.unitSnapshot?.name || "--",
          },
          {
            title: "Số lượng",
            align: "right" as const,
            render: (_: unknown, line: any) => formatQuantity(line.quantity),
          },
        ]}
      />
      <div className="mt-4 flex justify-end gap-2">
        <Button onClick={onClose}>Đóng</Button>
        {onCopy && (
          <Button icon={<CopyOutlined />} onClick={() => onCopy(data)}>
            Sao chép
          </Button>
        )}
        {onOpenUpdate && (
          <Button type="primary" onClick={() => onOpenUpdate(data)}>
            Chỉnh sửa
          </Button>
        )}
      </div>
    </Modal>
  );
};
