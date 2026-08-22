import React from "react";
import { Modal, Descriptions, Table } from "antd";
import { Quotation } from "../quotation.model";
import Title from "@/shared/components/display/Title";
import { formatMoney } from "@/shared/utils/number.util";
import { formatDate } from "@/shared/utils/date.util";
import { resolveByPath } from "@/shared/utils/common.util";

interface Props {
  open: boolean;
  data?: Quotation;
  onClose: () => void;
  onOpenUpdate?: (r: Quotation) => void;
}
export const QuotationDetailModal: React.FC<Props> = ({ open, data, onClose, onOpenUpdate }) => {
  if (!data) return null;
  const lineCols = [
    { title: "Hàng hóa", dataIndex: ["productSnapshot", "name"], key: "product", width: 200 },
    {
      title: "SL",
      dataIndex: "quantity",
      key: "qty",
      width: 80,
      align: "right" as const,
      render: (v: number) => v?.toLocaleString(),
    },
    {
      title: "Đơn giá",
      dataIndex: "unitPrice",
      key: "price",
      width: 120,
      align: "right" as const,
      render: (v: number) => formatMoney(v),
    },
    { title: "Thuế %", dataIndex: "taxRate", key: "tax", width: 70, align: "right" as const },
    {
      title: "Thành tiền",
      key: "total",
      width: 130,
      align: "right" as const,
      render: (_: any, r: any) => formatMoney((r.quantity || 0) * (r.unitPrice || 0)),
    },
  ];
  return (
    <Modal
      title={"Chi tiết báo giá: " + data.code}
      open={open}
      onCancel={onClose}
      footer={
        onOpenUpdate ? (
          <button
            className="text-blue-500 hover:underline text-sm"
            onClick={() => onOpenUpdate(data)}
          >
            Chỉnh sửa
          </button>
        ) : null
      }
      width="90%"
      destroyOnClose
    >
      <Descriptions column={3} size="small" bordered className="mb-4">
        <Descriptions.Item label="Mã BG">{data.code}</Descriptions.Item>
        <Descriptions.Item label="Ngày">
          {data.timeAt ? formatDate(data.timeAt) : "--"}
        </Descriptions.Item>
        <Descriptions.Item label="Hiệu lực đến">
          {data.validUntil ? formatDate(data.validUntil) : "--"}
        </Descriptions.Item>
        <Descriptions.Item label="Khách hàng">
          {resolveByPath(data, ["customer", "name"])}
        </Descriptions.Item>
        <Descriptions.Item label="Tổng tiền">
          <b>{formatMoney(data.totalAmount)}</b>
        </Descriptions.Item>
        <Descriptions.Item label="Trạng thái">{data.approveStatus}</Descriptions.Item>
        <Descriptions.Item label="Ghi chú" span={3}>
          {data.note || "--"}
        </Descriptions.Item>
      </Descriptions>
      <Title content={"Hàng hóa (" + (data.lines?.length || 0) + " dòng)"} />
      <Table
        dataSource={data.lines || []}
        columns={lineCols}
        rowKey="id"
        size="small"
        pagination={false}
      />
    </Modal>
  );
};
