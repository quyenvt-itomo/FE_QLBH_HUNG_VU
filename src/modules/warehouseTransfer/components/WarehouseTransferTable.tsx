import React from "react";
import { TableColumnConfig, ObjectTableProps } from "@/shared";
import { WarehouseTransfer } from "../warehouseTransfer.model";
import { formatDate } from "@/shared/utils/date.util";
import { formatMoney } from "@/shared/utils/number.util";

interface Props extends ObjectTableProps {
  onViewDetail?: (r: WarehouseTransfer) => void;
}
export const WarehouseTransferTable: React.FC<Props> = ({ onViewDetail, ...rest }) => {
  const cols: any = [
    {
      title: "Mã",
      dataIndex: "code",
      key: "code",
      width: 130,
      className: "code-column font-mono",
      fixed: "left",
      render: (v: string, r: WarehouseTransfer) => (
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
      dataIndex: "effectiveDate",
      key: "date",
      width: 110,
      align: "center",
      render: (v: string) => (v ? formatDate(v) : "--"),
    },
    {
      title: "Kho nguồn",
      dataIndex: ["fromWarehouseSnapshot", "name"],
      key: "from",
      width: 150,
      render: (v: string) => v || "--",
    },
    {
      title: "Kho đích",
      dataIndex: ["toWarehouseSnapshot", "name"],
      key: "to",
      width: 150,
      render: (v: string) => v || "--",
    },
  ];
  return (
    <TableColumnConfig
      columns={cols}
      itemName="Chuyển kho"
      tableKey="warehouseTransfer-table"
      {...rest}
    />
  );
};
