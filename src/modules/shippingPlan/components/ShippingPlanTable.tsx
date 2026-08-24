import React from "react";
import { TableColumnConfig, ObjectTableProps } from "@/shared";
import { ShippingPlan } from "../shippingPlan.model";
import { formatDate } from "@/shared/utils/date.util";

interface Props extends ObjectTableProps {
  onViewDetail?: (r: ShippingPlan) => void;
}
export const ShippingPlanTable: React.FC<Props> = ({ onViewDetail, ...rest }) => {
  const cols: any = [
    {
      title: "Mã",
      dataIndex: "code",
      key: "code",
      width: 140,
      className: "code-column font-mono",
      fixed: "left",
      render: (v: string, r: ShippingPlan) => (
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
      title: "Ngày KH",
      dataIndex: "plannedDate",
      key: "date",
      width: 100,
      align: "center",
      render: (v: string) => v || "--",
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      width: 150,
      render: (v: string) => v || "--",
    },
  ];
  return (
    <TableColumnConfig
      columns={cols}
      itemName="Kế hoạch giao hàng"
      tableKey="shippingPlan-table"
      {...rest}
    />
  );
};
