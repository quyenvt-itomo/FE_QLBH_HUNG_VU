import React from "react";
import { Modal, Table, Card, Tag, Button, Divider } from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { PurchaseQuotation, PurchaseQuotationLine } from "../purchaseQuotation.model";
import { formatDate } from "@/shared/utils/date.util";
import { formatMoney, formatQuantity } from "@/shared/utils/number.util";
import { ApproveStatus } from "@/modules/shared/business.model";
import { resolveByPath } from "@/shared/utils/common.util";
import { DocumentGroup } from "@/shared";
import { EntityInfo } from "@/shared";

interface Props {
  open: boolean;
  data?: PurchaseQuotation;
  onClose: () => void;
  onOpenUpdate?: (r: PurchaseQuotation) => void;
}

export const PurchaseQuotationDetailModal: React.FC<Props> = ({
  open,
  data,
  onClose,
  onOpenUpdate,
}) => {
  if (!data) return null;

  const isApproved = data.approveStatus === ApproveStatus.APPROVED;
  const isRejected = data.approveStatus === ApproveStatus.REJECTED;

  const statusConfig = isApproved
    ? { color: "green", icon: <CheckCircleOutlined />, label: "Đã duyệt" }
    : isRejected
      ? { color: "red", icon: <CloseCircleOutlined />, label: "Đã từ chối" }
      : { color: "orange", icon: <ClockCircleOutlined />, label: "Chờ duyệt" };

  const subTotal = (data.lines || []).reduce((s, l) => s + (l.subTotal || 0), 0);
  const taxAmount = (data.lines || []).reduce((s, l) => s + (l.taxAmount || 0), 0);

  const lineColumns = [
    {
      title: "HÀNG HÓA",
      key: "product",
      width: 220,
      render: (_: any, r: PurchaseQuotationLine) => (
        <EntityInfo
          title={resolveByPath(r, ["product", "name"])}
          subTitle={resolveByPath(r, ["product", "code"])}
        />
      ),
    },
    {
      title: "ĐVT",
      key: "unit",
      width: 80,
      render: (_: any, r: PurchaseQuotationLine) => (
        <span className="text-gray-600">{resolveByPath(r, ["unit", "name"], "—")}</span>
      ),
    },
    {
      title: "SL",
      dataIndex: "quantity",
      key: "quantity",
      width: 80,
      align: "right" as const,
      render: (v: number) => <span className="font-medium">{formatQuantity(v)}</span>,
    },
    {
      title: "ĐƠN GIÁ",
      dataIndex: "unitPrice",
      key: "price",
      width: 130,
      align: "right" as const,
      render: (v: number) => formatMoney(v),
    },
    {
      title: "THÀNH TIỀN",
      dataIndex: "subTotal",
      key: "sub",
      width: 140,
      align: "right" as const,
      render: (v: number) => <span className="font-medium">{formatMoney(v)}</span>,
    },
    {
      title: "%VAT",
      dataIndex: "taxRate",
      key: "tax",
      width: 65,
      align: "right" as const,
      render: (v: number) => v + "%",
    },
    {
      title: "TỔNG",
      dataIndex: "grossAmount",
      key: "gross",
      width: 150,
      align: "right" as const,
      render: (v: number) => <span className="font-semibold">{formatMoney(v)}</span>,
    },
  ];

  return (
    <Modal
      title={
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold text-gray-800">Chi tiết báo giá mua</span>
          <Tag color={statusConfig.color} icon={statusConfig.icon} className="rounded-full">
            {statusConfig.label}
          </Tag>
        </div>
      }
      open={open}
      onCancel={onClose}
      width={960}
      destroyOnClose
      className="purchase-quotation-detail-modal"
      footer={
        onOpenUpdate && !isApproved ? (
          <div className="flex justify-end">
            <Button type="primary" icon={<EditOutlined />} onClick={() => onOpenUpdate(data)}>
              Chỉnh sửa
            </Button>
          </div>
        ) : null
      }
    >
      <div className="space-y-4">
        {/* Header summary */}
        <div className="flex items-center justify-between bg-gray-50 rounded-lg px-5 py-3">
          <div className="flex items-center gap-6">
            <div>
              <span className="text-xs text-gray-500">Mã phiếu</span>
              <div className="font-mono font-bold text-gray-800">{data.code}</div>
            </div>
            <Divider type="vertical" className="h-8" />
            <div>
              <span className="text-xs text-gray-500">Ngày tạo</span>
              <div className="text-gray-700">{formatDate(data.timeAt) || "—"}</div>
            </div>
            <Divider type="vertical" className="h-8" />
            <div>
              <span className="text-xs text-gray-500">Loại</span>
              <div className="text-gray-700">
                {data.type === "quotation" ? "Báo giá" : "Chào giá"}
              </div>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-gray-500">Tổng giá trị</span>
            <div className="text-lg font-bold text-blue-600">{formatMoney(data.totalAmount)}</div>
          </div>
        </div>

        {/* Reject reason */}
        {data.rejectReason && (
          <Card
            size="small"
            className="border-red-200 bg-red-50"
            styles={{ body: { padding: "10px 14px" } }}
          >
            <div className="flex items-start gap-2">
              <CloseCircleOutlined className="text-red-500 mt-0.5" />
              <div>
                <span className="text-red-600 font-medium text-sm">Lý do từ chối: </span>
                <span className="text-red-600 text-sm">{data.rejectReason}</span>
              </div>
            </div>
          </Card>
        )}

        {/* Info cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card
            title={
              <span className="text-gray-600 font-semibold text-xs uppercase tracking-wide">
                Thông tin nhà cung cấp
              </span>
            }
            size="small"
            className="shadow-sm"
            styles={{
              header: {
                borderBottom: "1px solid #f0f0f0",
                padding: "10px 16px",
                minHeight: "auto",
              },
            }}
          >
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500 text-xs">Tên NCC</span>
                <span className="text-gray-800 font-medium text-sm">
                  {resolveByPath(data, ["supplier", "name"], "—")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 text-xs">MST</span>
                <span className="text-gray-800 font-mono text-sm">
                  {resolveByPath(data, ["supplier", "taxCode"], "—")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 text-xs">Người báo giá</span>
                <span className="text-gray-800 text-sm">
                  {resolveByPath(data, ["quoter", "name"], "—")}
                </span>
              </div>
            </div>
          </Card>

          <Card
            title={
              <span className="text-gray-600 font-semibold text-xs uppercase tracking-wide">
                Thông tin xử lý
              </span>
            }
            size="small"
            className="shadow-sm"
            styles={{
              header: {
                borderBottom: "1px solid #f0f0f0",
                padding: "10px 16px",
                minHeight: "auto",
              },
            }}
          >
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500 text-xs">Người phụ trách</span>
                <span className="text-gray-800 text-sm">
                  {resolveByPath(data, ["staff", "name"], "—")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 text-xs">Người duyệt</span>
                <span className="text-gray-800 text-sm">
                  {resolveByPath(data, ["approver", "name"], "—")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 text-xs">Ngày duyệt</span>
                <span className="text-gray-800 text-sm">
                  {data.approvedAt ? formatDate(data.approvedAt) : "—"}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Products table */}
        <Card
          title={
            <span className="text-gray-600 font-semibold text-xs uppercase tracking-wide">
              Hàng hóa báo giá
            </span>
          }
          size="small"
          className="shadow-sm"
          styles={{
            header: { borderBottom: "1px solid #f0f0f0", padding: "10px 16px", minHeight: "auto" },
          }}
        >
          <Table
            columns={lineColumns}
            dataSource={data.lines || []}
            rowKey="id"
            pagination={false}
            size="small"
            summary={() => (
              <Table.Summary.Row className="bg-gray-50">
                <Table.Summary.Cell index={0} colSpan={3}>
                  <span className="font-semibold text-gray-700">Tổng cộng</span>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={3} />
                <Table.Summary.Cell index={4} align="right">
                  <span className="font-semibold">{formatMoney(subTotal)}</span>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={5} align="right">
                  <span className="font-semibold">{formatMoney(taxAmount)}</span>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={6} align="right">
                  <span className="font-semibold text-blue-700 text-base">
                    {formatMoney(data.totalAmount)}
                  </span>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            )}
          />
        </Card>

        <div className="grid grid-cols-2 sticky bottom-0 bg-white dark:bg-gray-900 pt-2 pb-2 ">
          <div className="flex flex-col">
            <h4 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
              Tài liệu báo giá
            </h4>
            <DocumentGroup files={data.document} />
          </div>
          <div className="flex flex-col">
            <h4 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
              Tài liệu khác
            </h4>
            <DocumentGroup files={data.attachment} />
          </div>
        </div>
      </div>
    </Modal>
  );
};
