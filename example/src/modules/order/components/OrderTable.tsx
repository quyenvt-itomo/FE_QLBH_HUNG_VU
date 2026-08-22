import React from "react";
import { TableColumnConfig, ObjectTableProps } from "@/shared/components/table/TableColumnConfig";
import { Order } from "../order.model";
import Tag from "@/shared/components/display/Tag";
import { formatMoney } from "@/shared/utils/number.util";
import { formatDate } from "@/shared/utils/date.util";

export interface OrderTableProps extends ObjectTableProps {
  onViewDetail?: (record: Order) => void;
}

export const OrderTable: React.FC<OrderTableProps> = ({ onViewDetail, ...rest }) => {
  const columns: any = [
    {
      title: "Số đơn",
      dataIndex: "code",
      key: "code",
      width: 140,
      className: "code-column font-mono",
      fixed: "left",
      render: (v: string, record: Order) => (
        <span
          className="cursor-pointer text-blue-600 hover:text-blue-800 hover:underline"
          onClick={(e) => {
            e.stopPropagation();
            onViewDetail?.(record);
          }}
        >
          {v}
        </span>
      ),
    },
    {
      title: "Ngày",
      dataIndex: "timeAt",
      key: "timeAt",
      width: 100,
      align: "center",
      render: (v: string) => (v ? formatDate(v) : "--"),
    },
    {
      title: "Khách hàng",
      dataIndex: ["customerSnapshot", "name"],
      key: "customerName",
      width: 180,
      render: (v: string) => v || "--",
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      width: 130,
      align: "right",
      render: (v: number) => (v ? formatMoney(v) : "--"),
    },
    {
      title: "Số dòng",
      dataIndex: "lines",
      key: "totalLines",
      width: 80,
      align: "center",
      render: (lines: any[]) => (lines ? lines.length : 0),
    },
    {
      title: "Trạng thái",
      dataIndex: "isCompleted",
      key: "status",
      width: 100,
      align: "center",
      fixed: "right",
      render: (v: boolean) =>
        v ? <Tag type="success">Hoàn thành</Tag> : <Tag type="default">Đang xử lý</Tag>,
    },
  ];
  return (
    <TableColumnConfig columns={columns} itemName="đơn hàng" tableKey="order-table" {...rest} />
  );
};
