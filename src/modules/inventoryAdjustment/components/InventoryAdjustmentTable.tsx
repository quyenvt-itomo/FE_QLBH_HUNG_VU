import React from "react";
import { Tag } from "antd";
import { TableColumnConfig, ObjectTableProps } from "@/shared/components";
import { InventoryAdjustment } from "../inventoryAdjustment.model";
import { formatDateTimeDDMMYYYY } from "@/shared/utils/date.util";
import { formatMoney, formatQuantity } from "@/shared/utils/number.util";

interface Props extends ObjectTableProps {
  onViewDetail?: (r: InventoryAdjustment) => void;
}
export const InventoryAdjustmentTable: React.FC<Props> = ({ onViewDetail, ...rest }) => {
  const cols: any = [
    {
      title: "Mã",
      dataIndex: "code",
      key: "code",
      width: 130,
      className: "code-column font-mono",
      fixed: "left",
      render: (v: string, r: InventoryAdjustment) => (
        <button
          type="button"
          className="font-mono text-blue-600 hover:underline"
          onClick={(e) => {
            e.stopPropagation();
            onViewDetail?.(r);
          }}
        >
          {v}
        </button>
      ),
    },
    {
      title: "Ngày",
      dataIndex: "occurredAt",
      key: "date",
      width: 110,
      align: "center",
      render: (v: string) => (v ? formatDateTimeDDMMYYYY(v) : "--"),
    },
    {
      title: "SL chênh lệch",
      dataIndex: "totalAdjustmentQuantity",
      key: "quantity",
      width: 120,
      align: "right",
      render: (v: number) => (v === null || v === undefined ? "--" : formatQuantity(v)),
    },
    {
      title: "Lý do",
      dataIndex: "reason",
      key: "reason",
      width: 220,
      render: (v: string | null) => v || "--",
    },
    {
      title: "Giá trị CL",
      dataIndex: "totalAdjustmentAmount",
      key: "val",
      width: 150,
      align: "right",
      render: (v: number) => formatMoney(v),
    },
    {
      title: "Loại phiếu",
      dataIndex: "isInitial",
      key: "isInitial",
      width: 120,
      align: "center",
      render: (v: boolean) => (
        <Tag color={v ? "blue" : "default"}>{v ? "Tồn đầu kỳ" : "Kiểm kho"}</Tag>
      ),
    },
  ];
  return (
    <TableColumnConfig
      columns={cols}
      itemName="Kiểm kho"
      tableKey="inventoryAdjustment-table"
      onViewDetail={onViewDetail}
      {...rest}
    />
  );
};
