import React from "react";
import { Modal, Descriptions, Table } from "antd";
import { Quotation } from "../quotation.model";
import { Title } from "@/shared";
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
      key: "quantity",
      width: 80,
      align: "right" as const,
      render: (v: number) => v?.toLocaleString(),
    },
    {
      title: "Ðõn giá",
      dataIndex: "unitPrice",
      key: "price",
      width: 120,
      align: "right" as const,
      render: (v: number) => formatMoney(v),
    },
    { title: "Thu? %", dataIndex: "taxRate", key: "tax", width: 70, align: "right" as const },
    {
      title: "Thành ti?n",
      key: "total",
      width: 130,
      align: "right" as const,
      render: (_: any, r: any) => formatMoney((r.quantity || 0) * (r.unitPrice || 0)),
    },
  ];
  return (
    <Modal
      title={"Chi ti?t báo giá: " + data.code}
      open={open}
      onCancel={onClose}
      footer={
        onOpenUpdate ? (
          <button
            className="text-blue-500 hover:underline text-sm"
            onClick={() => onOpenUpdate(data)}
          >
            Ch?nh s?a
          </button>
        ) : null
      }
      width="90%"
      destroyOnClose
    >
      <Descriptions column={3} size="small" bordered className="mb-4">
        <Descriptions.Item label="M? BG">{data.code}</Descriptions.Item>
        <Descriptions.Item label="Ngày">
          {data.timeAt ? formatDate(data.timeAt) : "--"}
        </Descriptions.Item>
        <Descriptions.Item label="Hi?u l?c ð?n">
          {data.validUntil ? formatDate(data.validUntil) : "--"}
        </Descriptions.Item>
        <Descriptions.Item label="Khách hàng">
          {resolveByPath(data, ["customer", "name"])}
        </Descriptions.Item>
        <Descriptions.Item label="T?ng ti?n">
          <b>{formatMoney(data.totalAmount)}</b>
        </Descriptions.Item>
        <Descriptions.Item label="Tr?ng thái">{data.approveStatus}</Descriptions.Item>
        <Descriptions.Item label="Ghi chú" span={3}>
          {data.note || "--"}
        </Descriptions.Item>
      </Descriptions>
      <Title content={"Hàng hóa (" + (data.lines?.length || 0) + " d?ng)"} />
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
