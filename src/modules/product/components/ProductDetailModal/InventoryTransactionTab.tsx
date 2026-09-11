import React, { useState } from "react";
import { Table } from "antd";
import { useInventoryReportStore } from "@/modules/inventory";
import {
  inventoryTransactionRefTypeMap,
  InventoryTransaction,
} from "@/modules/inventory/inventory.model";
import { TransactionType } from "@/shared/constants/enum";
import { CustomPagination } from "@/shared/components";
import { formatDateTimeDDMMYYYY } from "@/shared/utils/date.util";
import { formatMoney, formatQuantity } from "@/shared/utils/number.util";
import { Product } from "../../product.model";

export const InventoryTransactionTab: React.FC<{ data: Product }> = ({ data }) => {
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const { loading, transactions, transactionPagination } = useInventoryReportStore({
    productId: data.id,
    page,
    size,
    isLockedReport: true,
  });

  const columns: any[] = [
    {
      title: "Ngày",
      dataIndex: "occurredAt",
      key: "occurredAt",
      width: 150,
      render: (value: string) => formatDateTimeDDMMYYYY(value),
    },
    {
      title: "Số phiếu",
      dataIndex: "refCode",
      key: "refCode",
      width: 140,
      render: (value: string) => value || "—",
    },
    {
      title: "Nội dung",
      dataIndex: "refType",
      key: "refType",
      width: 180,
      render: (value: InventoryTransaction["refType"]) =>
        inventoryTransactionRefTypeMap[value] || value || "—",
    },
    {
      title: "Nhập",
      key: "in",
      width: 120,
      align: "right",
      render: (_value: unknown, record: InventoryTransaction) =>
        record.type === TransactionType.IN ? formatQuantity(record.quantity) : "—",
    },
    {
      title: "Xuất",
      key: "out",
      width: 120,
      align: "right",
      render: (_value: unknown, record: InventoryTransaction) =>
        record.type === TransactionType.OUT ? formatQuantity(record.quantity) : "—",
    },
    {
      title: "Giá trị",
      dataIndex: "amount",
      key: "amount",
      width: 140,
      align: "right",
      render: (value: number) => formatMoney(value),
    },
    {
      title: "Tồn cuối",
      dataIndex: "quantityAfter",
      key: "quantityAfter",
      width: 120,
      align: "right",
      render: (value: number) => formatQuantity(value),
    },
    {
      title: "Giá trị tồn",
      dataIndex: "inventoryValueAfter",
      key: "inventoryValueAfter",
      width: 140,
      align: "right",
      render: (value: number) => formatMoney(value),
    },
  ];

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg border">
      <Table
        loading={loading}
        columns={columns}
        dataSource={transactions}
        rowKey="id"
        pagination={false}
        tableLayout="fixed"
        scroll={{ x: "max-content" }}
        footer={() =>
          transactionPagination ? (
            <CustomPagination
              pagination={transactionPagination}
              itemName="bản ghi"
              length={transactions.length}
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
