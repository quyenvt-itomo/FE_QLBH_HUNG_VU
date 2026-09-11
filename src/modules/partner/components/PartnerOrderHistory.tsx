import React, { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Table, Tag } from "antd";
import { apiEndpoint } from "@/shared/constants/apiEndpoint";
import { CustomPagination } from "@/shared/components";
import { getData } from "@/shared/api/apiClient";
import { formatPayload } from "@/shared/utils/common.util";
import { formatDateTimeDDMMYYYY } from "@/shared/utils/date.util";
import { formatMoney } from "@/shared/utils/number.util";
import { ApiResponse } from "@/shared/interfaces/api";
import { Order, OrderStatus, OrderType } from "@/modules/order/order.model";
import { CLASSNAME } from "@/shared/constants";

type OrderHistoryMode = "customer" | "supplier" | "shipper";

interface PartnerOrderHistoryProps {
  partnerId: string;
  mode: OrderHistoryMode;
  orderType?: OrderType;
}

const endpointByMode: Record<Exclude<OrderHistoryMode, "shipper">, string> = {
  customer: apiEndpoint.order.sale,
  supplier: apiEndpoint.order.purchase,
};

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

export const PartnerOrderHistory: React.FC<PartnerOrderHistoryProps> = ({
  partnerId,
  mode,
  orderType,
}) => {
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const isShipper = mode === "shipper";
  const selectedOrderType =
    orderType || (mode === "customer" ? OrderType.SALE : OrderType.PURCHASE);
  const endpoint = isShipper
    ? apiEndpoint.order.history
    : selectedOrderType === OrderType.SALE_RETURN
      ? apiEndpoint.order.saleReturn
      : selectedOrderType === OrderType.PURCHASE_RETURN
        ? apiEndpoint.order.purchaseReturn
        : endpointByMode[mode];
  const params = isShipper ? { shipperId: partnerId, page, size } : { partnerId, page, size };

  const {
    data: response,
    isLoading,
    isError,
  } = useQuery<ApiResponse<Order[]>>({
    queryKey: ["partner-order-history", mode, partnerId, page, size],
    queryFn: () => getData<Order[]>(endpoint, formatPayload(params)),
    placeholderData: keepPreviousData,
    enabled: Boolean(partnerId),
  });

  const orders = response?.data || [];
  const pagination = response?.pagination;
  const { currentPage = 1, size: currentSize = 10 } = pagination || {};

  const columns: any[] = [
    {
      title: "#",
      dataIndex: "index",
      key: "index",
      width: 50,
      render: (_value: unknown, _record: Order, index: number) =>
        (currentPage - 1) * currentSize + index + 1,
    },
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
      title: "Người bán",
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
    <div className="flex flex-col h-full rounded-lg border overflow-hidden">
      {isError && (
        <div className="px-4 py-3 text-sm text-red-500">Không thể tải lịch sử đơn hàng.</div>
      )}
      <Table
        loading={isLoading}
        columns={columns}
        dataSource={orders}
        rowKey="id"
        pagination={false}
        className={CLASSNAME.table}
        tableLayout="fixed"
        scroll={{ x: "max-content" }}
        footer={() =>
          pagination ? (
            <CustomPagination
              pagination={pagination}
              itemName="đơn hàng"
              length={orders.length}
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
