import React from "react";
import { TableColumnConfig, ObjectTableProps } from "@/shared";
import { Production } from "../production.model";
import { formatDate } from "@/shared/utils/date.util";
import { formatMoney } from "@/shared/utils/number.util";

interface Props extends ObjectTableProps {
  onViewDetail?: (r: Production) => void;
}
export const ProductionTable: React.FC<Props> = ({ onViewDetail, ...rest }) => {
  const cols: any = [
    {
      title: "Mã",
      dataIndex: "code",
      key: "code",
      width: 130,
      className: "code-column font-mono",
      fixed: "left",
      render: (v: string, r: Production) => (
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
      dataIndex: "timeAt",
      key: "date",
      width: 110,
      align: "center",
      render: (v: string) => (v ? formatDate(v) : "--"),
    },
    { title: "Loại", dataIndex: "type", key: "type", width: 100 },
    {
      title: "CP NVL",
      dataIndex: "totalInputCost",
      key: "input",
      width: 130,
      align: "right",
      render: (v: number) => (v ? formatMoney(v) : "--"),
    },
    {
      title: "GT TP",
      dataIndex: "totalOutputCost",
      key: "output",
      width: 130,
      align: "right",
      render: (v: number) => (v ? formatMoney(v) : "--"),
    },
    { title: "Trạng thái", dataIndex: "status", key: "status", width: 120, align: "center" },
  ];
  return (
    <TableColumnConfig
      columns={cols}
      itemName="Lệnh sản xuất"
      tableKey="production-table"
      {...rest}
    />
  );
};
