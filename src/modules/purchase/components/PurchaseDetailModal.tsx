import React, { useMemo } from "react";
import { Button, Card, Col, Descriptions, Divider, Modal, Row, Space, Table, Tag } from "antd";
import { CopyOutlined, DeleteOutlined, EditOutlined, FileExcelOutlined, PrinterOutlined, BarcodeOutlined } from "@ant-design/icons";
import { formatDateTimeDDMMYYYY } from "@/shared/utils/date.util";
import { Purchase, OrderStatus, purchaseStatusMap } from "../purchase.model";
import { formatVnd, getLineProduct, getLineUnit } from "../purchase.util";

interface Props {
  open: boolean;
  data?: Purchase;
  onClose: () => void;
  onOpenUpdate?: (record: Purchase) => void;
  onDelete?: (record: Purchase) => void;
  onCancel?: (record: Purchase) => void;
  onCopy?: (record: Purchase) => void;
  onExportExcel?: (record: Purchase) => void;
  onPrint?: (record: Purchase) => void;
  onPrintBarcode?: (record: Purchase) => void;
  onComplete?: (record: Purchase) => void;
}

export const PurchaseDetailModal: React.FC<Props> = ({
  open,
  data,
  onClose,
  onOpenUpdate,
  onDelete,
  onCancel,
  onCopy,
  onExportExcel,
  onPrint,
  onPrintBarcode,
  onComplete,
}) => {
  const products = useMemo(() => {
    const map = new Map<string, any>();
    (data?.lines || []).forEach((line: any) => {
      const product = line.product;
      if (product?.id) map.set(product.id, product);
    });
    return Array.from(map.values());
  }, [data]);

  if (!data) return null;
  const isDraft = data.status === OrderStatus.DRAFT;

  return (
    <>
      <Modal
        title={<div className="flex items-center gap-3"><span>Chi tiết phiếu nhập hàng</span><Tag color={data.status === OrderStatus.COMPLETED ? "success" : data.status === OrderStatus.CANCELED ? "error" : "default"}>{purchaseStatusMap[data.status]}</Tag></div>}
        open={open}
        onCancel={onClose}
        footer={null}
        width={1180}
        centered
        destroyOnClose
      >
        <div className="space-y-4 py-2">
          <Card size="small" className="border-blue-200 bg-blue-50">
            <div className="flex items-center justify-between">
              <div><div className="font-mono text-xl font-semibold text-blue-700">{data.code}</div><div className="text-sm text-gray-500">Tạo lúc {formatDateTimeDDMMYYYY(data.createdAt)}</div></div>
              <div className="text-right"><div className="text-xs text-gray-500">Tổng đơn</div><div className="text-2xl font-semibold text-blue-700">{formatVnd(data.totalAmount)}</div></div>
            </div>
          </Card>
          <Descriptions bordered size="small" column={3}>
            <Descriptions.Item label="Nhà cung cấp">{data.partner?.name || data.partnerSnapshot?.name || "—"}</Descriptions.Item>
            <Descriptions.Item label="Mã NCC">{data.partner?.code || data.partnerSnapshot?.code || "—"}</Descriptions.Item>
            <Descriptions.Item label="Số hóa đơn">{data.invoiceNumber || "—"}</Descriptions.Item>
            <Descriptions.Item label="Người tạo">{data.creatorSnapshot?.name || "—"}</Descriptions.Item>
            <Descriptions.Item label="Ngày đặt hàng">{formatDateTimeDDMMYYYY(data.orderAt)}</Descriptions.Item>
            <Descriptions.Item label="Ngày hoàn thành">{data.occurredAt ? formatDateTimeDDMMYYYY(data.occurredAt) : "—"}</Descriptions.Item>
            <Descriptions.Item label="Người hoàn thành">{data.completer?.name || data.completerSnapshot?.name || "—"}</Descriptions.Item>
          </Descriptions>
          <Card title="Danh sách hàng hóa" size="small" styles={{ body: { padding: 0 } }}>
            <Table
              size="small"
              pagination={false}
              rowKey={(line: any) => line.id || line.tempId}
              dataSource={data.lines || []}
              columns={[
                { title: "STT", width: 55, align: "center", render: (_: unknown, __: unknown, index: number) => index + 1 },
                { title: "Mã hàng", width: 150, render: (_: unknown, line: any) => <span className="font-mono text-blue-600">{getLineProduct(line).code || "—"}</span> },
                { title: "Tên hàng", render: (_: unknown, line: any) => getLineProduct(line).name || "—" },
                { title: "ĐVT", width: 120, render: (_: unknown, line: any) => getLineUnit(line).name || "—" },
                { title: "Số lượng", width: 110, align: "right", render: (_: unknown, line: any) => line.quantity },
                { title: "Đơn giá", width: 140, align: "right", render: (_: unknown, line: any) => formatVnd(line.unitPrice) },
                { title: "Thành tiền", width: 160, align: "right", render: (_: unknown, line: any) => formatVnd(Number(line.quantity || 0) * Number(line.unitPrice || 0)) },
              ]}
              summary={(lines) => <Table.Summary><Table.Summary.Row><Table.Summary.Cell index={0} colSpan={4}><b>Tổng</b></Table.Summary.Cell><Table.Summary.Cell index={4} align="right"><b>{lines.reduce((sum, line: any) => sum + Number(line.quantity || 0), 0)}</b></Table.Summary.Cell><Table.Summary.Cell index={5} /><Table.Summary.Cell index={6} align="right"><b>{formatVnd(data.grossAmount)}</b></Table.Summary.Cell></Table.Summary.Row></Table.Summary>}
            />
          </Card>
          {data.note && <Card size="small" title="Ghi chú">{data.note}</Card>}
          <Divider className="my-2" />
          <div className="flex items-center justify-between">
            <Space>
              {isDraft && onCancel && <Button danger icon={<DeleteOutlined />} onClick={() => onCancel(data)}>Hủy phiếu</Button>}
              {isDraft && onDelete && <Button danger type="text" icon={<DeleteOutlined />} onClick={() => onDelete(data)}>Xóa phiếu</Button>}
              {onCopy && <Button icon={<CopyOutlined />} onClick={() => onCopy(data)}>Sao chép</Button>}
              {onExportExcel && <Button icon={<FileExcelOutlined />} onClick={() => onExportExcel(data)}>Xuất file</Button>}
              {onPrint && <Button icon={<PrinterOutlined />} onClick={() => onPrint(data)}>In</Button>}
              {onPrintBarcode && <Button icon={<BarcodeOutlined />} disabled={!products.length} onClick={() => onPrintBarcode(data)}>In tem mã</Button>}
            </Space>
            {isDraft && onComplete && <Button type="primary" onClick={() => onComplete(data)}>Nhập kho ngay</Button>}
            {isDraft && onOpenUpdate && <Button type="primary" icon={<EditOutlined />} onClick={() => onOpenUpdate(data)}>Chỉnh sửa</Button>}
          </div>
        </div>
      </Modal>
    </>
  );
};
