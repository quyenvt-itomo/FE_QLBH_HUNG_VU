import React from "react";
import { TableColumnConfig, ObjectTableProps } from "@/shared/components/table/TableColumnConfig";
import { PaymentRequest } from "../paymentRequest.model";
import { formatDate } from "@/shared/utils/date.util";
import { formatMoney } from "@/shared/utils/number.util";

interface Props extends ObjectTableProps {
  onViewDetail?: (r: PaymentRequest) => void;
}
export const PaymentRequestTable: React.FC<Props> = ({ onViewDetail, ...rest }) => {
  const cols: any = [
    {
      title: "Mã",
      dataIndex: "code",
      key: "code",
      width: 130,
      className: "code-column font-mono",
      fixed: "left",
      render: (v: string, r: PaymentRequest) => (
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
    { title: "Loại", dataIndex: "type", key: "type", width: 100 },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      key: "total",
      width: 150,
      align: "right",
      render: (v: number) => (v ? formatMoney(v) : "--"),
    },
  ];
  return (
    <TableColumnConfig
      columns={cols}
      itemName="Đề nghị thanh toán"
      tableKey="paymentRequest-table"
      {...rest}
    />
  );
};
