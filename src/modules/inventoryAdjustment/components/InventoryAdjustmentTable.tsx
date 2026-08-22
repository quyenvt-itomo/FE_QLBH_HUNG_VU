import React from "react";
import { TableColumnConfig, ObjectTableProps } from "@/shared/components/table/TableColumnConfig";
import { InventoryAdjustment } from "../inventoryAdjustment.model";
import { formatDate } from "@/shared/utils/date.util";
import { formatMoney } from "@/shared/utils/number.util";

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
        <span
          className="cursor-pointer text-blue-600 hover:text-blue-800 hover:underline"
          onClick={(e) => {
            e.stopPropagation();
            onViewDetail?.(r);
          }}
        >
          {v}
        </span>
      ),
    },
    {
      title: "Ngày",
      dataIndex: "occurredAt",
      key: "date",
      width: 110,
      align: "center",
      render: (v: string) => (v ? formatDate(v) : "--"),
    },
    {
      title: "SL chênh lệch",
      dataIndex: "totalAdjustmentQuantity",
      key: "qty",
      width: 120,
      align: "right",
      render: (v: number) => v ?? "--",
    },
    {
      title: "Giá trị CL",
      dataIndex: "totalAdjustmentValue",
      key: "val",
      width: 150,
      align: "right",
      render: (v: number) => (v ? formatMoney(v) : "--"),
    },
  ];
  return (
    <TableColumnConfig
      columns={cols}
      itemName="Kiểm kê"
      tableKey="inventoryAdjustment-table"
      {...rest}
    />
  );
};
