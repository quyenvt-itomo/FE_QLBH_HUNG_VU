import React from "react";
import { Modal, Descriptions, Table, TableProps } from "antd";
import { QuotationRequest, QuotationRequestLine } from "../quotationRequest.model";
import { formatDateTime } from "@/shared/utils/date.util";
import { resolveByPath } from "@/shared/utils/common.util";
import { ApproveStatusTag } from "@/shared/components/display/Tag";

interface Props {
  open: boolean;
  data?: QuotationRequest;
  onClose: () => void;
  onEdit?: () => void;
}

export const QuotationRequestDetailModal: React.FC<Props> = ({ open, data, onClose, onEdit }) => {
  if (!data) return null;

  const lineColumns: TableProps<QuotationRequestLine>["columns"] = [
    { title: "STT", key: "idx", width: 50, align: "center", render: (_, __, i) => i + 1 },
    {
      title: "Hàng hóa",
      key: "product",
      render: (_, r) => resolveByPath(r, ["product", "name"]) || "--",
    },
    {
      title: "ĐVT",
      key: "unit",
      width: 80,
      render: (_, r) => resolveByPath(r, ["unit", "name"]) || "--",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      width: 100,
      align: "right" as const,
    },
    { title: "Ghi chú", dataIndex: "note", key: "note", render: (v: string) => v || "--" },
  ];

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={
        <div className="flex items-center gap-2">
          <span>Chi tiết yêu cầu báo giá</span>
          <span className="font-mono text-blue-600">{data.code}</span>
          <ApproveStatusTag value={data.approveStatus} />
        </div>
      }
      width={800}
      footer={null}
    >
      <Descriptions column={2} size="small" bordered className="mb-4">
        <Descriptions.Item label="Mã phiếu">{data.code}</Descriptions.Item>
        <Descriptions.Item label="Ngày">{formatDateTime(data.timeAt)}</Descriptions.Item>
        <Descriptions.Item label="Khách hàng">
          {resolveByPath(data, ["customer", "name"]) || "--"}
        </Descriptions.Item>
        <Descriptions.Item label="Người phụ trách">
          {resolveByPath(data, ["staff", "name"]) || "--"}
        </Descriptions.Item>
        {data.rejectReason && (
          <Descriptions.Item label="Lý do từ chối" span={2}>
            <span className="text-red-500">{data.rejectReason}</span>
          </Descriptions.Item>
        )}
      </Descriptions>

      <div className="font-semibold mb-2">Danh sách hàng hóa</div>
      <Table
        columns={lineColumns}
        dataSource={data.lines || []}
        rowKey="id"
        size="small"
        pagination={false}
        bordered
      />
    </Modal>
  );
};
