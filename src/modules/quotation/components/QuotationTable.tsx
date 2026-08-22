import React from "react";
import { TableColumnConfig, ObjectTableProps } from "@/shared/components/table/TableColumnConfig";
import { Quotation } from "../quotation.model";
import { approvedStatusMap } from "../../shared/business.model";
import Tag from "@/shared/components/display/Tag";
import { formatMoney } from "@/shared/utils/number.util";
import { formatDate } from "@/shared/utils/date.util";

interface Props extends ObjectTableProps {
  onViewDetail?: (r: Quotation) => void;
}
export const QuotationTable: React.FC<Props> = ({ onViewDetail, ...rest }) => {
  const cols: any = [
    {
      title: "Số BG",
      dataIndex: "code",
      key: "code",
      width: 130,
      className: "code-column font-mono",
      fixed: "left",
      render: (v: string, r: Quotation) => (
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
      width: 100,
      align: "center",
      render: (v: string) => (v ? formatDate(v) : "--"),
    },
    {
      title: "Khách hàng",
      dataIndex: ["customerSnapshot", "name"],
      key: "customer",
      width: 180,
      render: (v: string) => v || "--",
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      key: "total",
      width: 140,
      align: "right",
      render: (v: number) => (v ? formatMoney(v) : "--"),
    },
    {
      title: "Số dòng",
      dataIndex: "lines",
      key: "lineCount",
      width: 80,
      align: "center",
      render: (lines: any[]) => lines?.length || 0,
    },
    {
      title: "Trạng thái",
      dataIndex: "approveStatus",
      key: "status",
      width: 120,
      align: "center",
      fixed: "right",
      render: (v: string) =>
        v ? <Tag>{approvedStatusMap[v as keyof typeof approvedStatusMap] || v}</Tag> : null,
    },
  ];
  return (
    <TableColumnConfig columns={cols} itemName="báo giá" tableKey="quotation-table" {...rest} />
  );
};
