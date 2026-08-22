import React from "react";
import { Modal, Descriptions, Table, TableProps, Tag } from "antd";
import { StockDocument, stockDocumentStatusMap } from "../../stockDocument.model";
import { formatDate, formatDateTimeDDMMYYYY } from "@/shared/utils/date.util";
import { formatMoney, formatQuantity } from "@/shared/utils/number.util";
import { resolveByPath } from "@/shared/utils/common.util";
import { StockDocumentLine } from "@/modules/stockDocumentLine/stockDocumentLine.model";

interface Props {
  open: boolean;
  data?: StockDocument;
  onClose: () => void;
  onOpenUpdate?: (r: StockDocument) => void;
}

export const DetailModal: React.FC<Props> = ({ open, data, onClose, onOpenUpdate }) => {
  if (!data) return null;
  const statusColor =
    data.status === "completed" ? "green" : data.status === "exported" ? "blue" : "orange";
  const info = [
    { label: "Số phiếu", value: data.code || "--" },
    {
      label: "Trạng thái",
      value: <Tag color={statusColor}>{stockDocumentStatusMap[data.status] || data.status}</Tag>,
    },
    { label: "Ngày hiệu lực", value: data.effectiveDate ? formatDate(data.effectiveDate) : "--" },
    {
      label: "Ngày xuất thực tế",
      value: data.actualExportDate ? formatDateTimeDDMMYYYY(data.actualExportDate) : "--",
    },
    { label: "Khách hàng", value: resolveByPath(data, ["partner", "name"], "--") },
    { label: "Kho", value: resolveByPath(data, ["warehouse", "name"], "--") },
    { label: "Biển số", value: data.vehiclePlate || "--" },
    { label: "Loại xe", value: data.vehicleType || "--" },
    { label: "Chênh lệch", value: formatMoney(data.totalVarianceAmount || 0) },
    { label: "Ghi chú", value: data.note || "--" },
  ];
  const lineCols: TableProps["columns"] = [
    { title: "STT", width: 50, align: "center", render: (_: any, __: any, i: number) => i + 1 },
    {
      title: "Hàng hóa",
      key: "product",
      width: 220,
      render: (r: StockDocumentLine) => (
        <div className="flex flex-col">
          <span className="font-medium">{resolveByPath(r, ["product", "name"], "--")}</span>
          <span className="text-xs text-gray-400 font-mono">
            {resolveByPath(r, ["product", "code"], "")}
          </span>
        </div>
      ),
    },
    {
      title: "ĐVT",
      key: "unit",
      width: 90,
      align: "center",
      render: (r: StockDocumentLine) => resolveByPath(r, ["unit", "name"], "--"),
    },
    {
      title: "SL yêu cầu",
      dataIndex: "requestQuantity",
      key: "req",
      width: 100,
      align: "right",
      render: (v: any) => formatQuantity(v || 0),
    },
    {
      title: "SL thực xuất",
      dataIndex: "stockQuantity",
      key: "stock",
      width: 100,
      align: "right",
      render: (v: any) => formatQuantity(v || 0),
    },
    {
      title: "SL cộng thêm",
      dataIndex: "additionalQuantity",
      key: "add",
      width: 110,
      align: "right",
      render: (v: any) => formatQuantity(v || 0),
    },
    {
      title: "SL hóa đơn",
      dataIndex: "billingQuantity",
      key: "bill",
      width: 110,
      align: "right",
      render: (v: any) => formatQuantity(v || 0),
    },
    {
      title: "Chênh lệch",
      dataIndex: "varianceQuantity",
      key: "varQty",
      width: 100,
      align: "right",
      render: (v: any) => {
        const val = Number(v) || 0;
        return (
          <span className={val === 0 ? "" : val > 0 ? "text-green-600" : "text-red-600"}>
            {formatQuantity(val)}
          </span>
        );
      },
    },
    {
      title: "Giá trị CL",
      dataIndex: "varianceAmount",
      key: "varAmt",
      width: 130,
      align: "right",
      render: (v: any) => formatMoney(v || 0),
    },
  ];
  return (
    <Modal
      title="Chi tiết phiếu xuất bán"
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      destroyOnClose
      maskClosable={false}
      width="100vw"
      className="fullscreen-modal"
    >
      <div className="flex flex-col gap-4 h-full overflow-y-auto scrollbar-hide">
        <Descriptions column={2} size="small" bordered>
          {info.map((i, idx) => (
            <Descriptions.Item
              key={idx}
              label={i.label}
              styles={{ label: { width: 140 } }}
              span={1}
            >
              {i.value}
            </Descriptions.Item>
          ))}
        </Descriptions>
        <div className="flex flex-col">
          <h4 className="mb-2">Chi tiết dòng phiếu</h4>
          <Table
            pagination={false}
            dataSource={data.lines || []}
            columns={lineCols as any}
            rowKey="id"
            size="small"
          />
        </div>
      </div>
    </Modal>
  );
};
