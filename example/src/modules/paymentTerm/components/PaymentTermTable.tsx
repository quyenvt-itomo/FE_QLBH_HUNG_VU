import React, { useMemo } from "react";
import { TableColumnConfig, ObjectTableProps } from "@/shared/components/table/TableColumnConfig";
import { PaymentTerm } from "../paymentTerm.model";
import { formatMoney } from "@/shared/utils/number.util";

interface Props extends ObjectTableProps {
  onViewDetail?: (r: PaymentTerm) => void;
}

export const PaymentTermTable: React.FC<Props> = ({ onViewDetail, ...rest }) => {
  const columns: any = useMemo(
    () => [
      {
        title: "Mã",
        dataIndex: "code",
        key: "code",
        width: 130,
        className: "code-column font-mono",
        fixed: "left",
        render: (v: string, r: PaymentTerm) => (
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
      { title: "Tên", dataIndex: "name", key: "name", width: 220 },
      {
        title: "Tỷ lệ cọc",
        dataIndex: "depositRate",
        key: "depositRate",
        width: 100,
        align: "right",
        render: (v: number) => (v != null ? `${v}%` : "--"),
      },
      {
        title: "Ngày nợ tối đa",
        dataIndex: "maxDebtDays",
        key: "maxDebtDays",
        width: 130,
        align: "right",
        render: (v: number) => v ?? "--",
      },
      {
        title: "Nợ tối đa",
        dataIndex: "maxDebtAmount",
        key: "maxDebtAmount",
        width: 150,
        align: "right",
        render: (v: number) => (v != null ? formatMoney(v) : "--"),
      },
      { title: "Ghi chú", dataIndex: "note", key: "note", width: 200, ellipsis: true },
    ],
    [onViewDetail],
  );
  return (
    <TableColumnConfig
      columns={columns}
      itemName="Điều khoản thanh toán"
      tableKey="paymentterm-table"
      {...rest}
    />
  );
};
