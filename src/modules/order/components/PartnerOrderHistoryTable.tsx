import React from "react";
import { Table, Tag } from "antd";
import { CustomPagination } from "@/shared/components";
import { formatDateTimeDDMMYYYY } from "@/shared/utils/date.util";
import { formatMoney } from "@/shared/utils/number.util";
import { Order, OrderStatus, OrderType } from "../order.model";

type HistoryMode = "customer" | "supplier" | "shipper";

interface PartnerOrderHistoryTableProps {
  dataSource: Order[];
  loading?: boolean;
  pagination?: any;
  mode: HistoryMode;
  setPage?: (page: number) => void;
  setSize?: (size: number) => void;
}

const typeLabel: Record<OrderType, string> = {
  [OrderType.PURCHASE]: "Nhập hàng",
  [OrderType.SALE]: "Bán hàng",
  [OrderType.PURCHASE_RETURN]: "Trả nhà cung cấp",
  [OrderType.SALE_RETURN]: "Khách trả hàng",
};

const statusLabel: Record<OrderStatus, string> = {
  [OrderStatus.DRAFT]: "Phiếu tạm",
  [OrderStatus.COMPLETED]: "Hoàn thành",
  [OrderStatus.CANCELED]: "Đã hủy",
};

const statusColor: Record<OrderStatus, string> = {
  [OrderStatus.DRAFT]: "gold",
  [OrderStatus.COMPLETED]: "green",
  [OrderStatus.CANCELED]: "red",
};

const isReturnOrder = (type: OrderType) =>
  type === OrderType.PURCHASE_RETURN || type === OrderType.SALE_RETURN;

export const PartnerOrderHistoryTable: React.FC<PartnerOrderHistoryTableProps> = ({
  dataSource,
  loading,
  pagination,
  mode,
  setPage,
  setSize,
}) => {
  const isShipper = mode === "shipper";
  const columns: any[] = [
    {
      title: "Mã hóa đơn",
      dataIndex: "code",
      key: "code",
      width: 150,
      render: (value: string) => <span className="text-primary">{value || "—"}</span>,
    },
    ...(isShipper
      ? [
          {
            title: "Loại đơn",
            dataIndex: "type",
            key: "type",
            width: 150,
            render: (value: OrderType) => typeLabel[value] || value || "—",
          },
        ]
      : []),
    {
      title: "Thời gian",
      dataIndex: "orderAt",
      key: "orderAt",
      width: 160,
      render: (_value: string, record: Order) =>
        formatDateTimeDDMMYYYY(record.orderAt || record.occurredAt),
    },
    {
      title: mode === "supplier" ? "Người nhập" : "Người bán",
      key: "seller",
      width: 150,
      render: (_value: unknown, record: Order) =>
        (record as any).completerSnapshot?.name || record.creatorSnapshot?.name || "—",
    },
    {
      title: "Chi nhánh",
      key: "store",
      width: 190,
      render: (_value: unknown, record: Order) => record.store?.name || "—",
    },
    {
      title: "Tổng cộng",
      key: "totalAmount",
      width: 140,
      align: "right",
      render: (_value: unknown, record: Order) =>
        formatMoney(isReturnOrder(record.type) ? record.returnTotalAmount : record.totalAmount),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (value: OrderStatus) => (
        <Tag color={statusColor[value] || "default"}>{statusLabel[value] || value || "—"}</Tag>
      ),
    },
  ];

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg border">
      <Table
        loading={loading}
        columns={columns}
        dataSource={dataSource}
        rowKey="id"
        pagination={false}
        tableLayout="fixed"
        scroll={{ x: "max-content" }}
        footer={() =>
          pagination ? (
            <CustomPagination
              pagination={pagination}
              itemName="đơn hàng"
              length={dataSource.length}
              showTotal
              setPage={setPage}
              setSize={setSize}
            />
          ) : null
        }
      />
    </div>
  );
};
