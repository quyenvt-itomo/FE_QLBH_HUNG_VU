import React from "react";
import { TableColumnConfig, ObjectTableProps } from "@/shared";
import { CommissionDebtAdjustment } from "../commissionDebtAdjustment.model";
import { formatDate } from "@/shared/utils/date.util";
import { formatMoney } from "@/shared/utils/number.util";

interface Props extends ObjectTableProps {
  onViewDetail?: (r: CommissionDebtAdjustment) => void;
}
export const CommissionDebtAdjustmentTable: React.FC<Props> = ({ onViewDetail, ...rest }) => {
  const cols: any = [
    {
      title: "Mã",
      dataIndex: "code",
      key: "code",
      width: 130,
      className: "code-column font-mono",
      fixed: "left",
      render: (v: string, r: CommissionDebtAdjustment) => (
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
      title: "Số tiền",
      dataIndex: "amount",
      key: "amount",
      width: 150,
      align: "right",
      render: (v: number) => (v ? formatMoney(v) : "--"),
    },
    {
      title: "Lý do",
      dataIndex: "reason",
      key: "reason",
      width: 250,
      render: (v: string) => v || "--",
    },
  ];
  return (
    <TableColumnConfig
      columns={cols}
      itemName="Điều chỉnh CN hoa hồng"
      tableKey="commissionDebtAdjustment-table"
      {...rest}
    />
  );
};
