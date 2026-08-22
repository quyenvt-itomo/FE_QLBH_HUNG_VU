import React from "react";
import { TableColumnConfig, ObjectTableProps } from "@/shared/components/table/TableColumnConfig";
import { InventoryConversion } from "../inventoryConversion.model";
import { formatDate } from "@/shared/utils/date.util";
import { formatMoney } from "@/shared/utils/number.util";

interface Props extends ObjectTableProps {
  onViewDetail?: (r: InventoryConversion) => void;
}
export const InventoryConversionTable: React.FC<Props> = ({ onViewDetail, ...rest }) => {
  const cols: any = [
    {
      title: "Mã",
      dataIndex: "code",
      key: "code",
      width: 130,
      className: "code-column font-mono",
      fixed: "left",
      render: (v: string, r: InventoryConversion) => (
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
      title: "Kho",
      dataIndex: ["warehouseSnapshot", "name"],
      key: "wh",
      width: 150,
      render: (v: string) => v || "--",
    },
  ];
  return (
    <TableColumnConfig
      columns={cols}
      itemName="Chuyển mã"
      tableKey="inventoryConversion-table"
      {...rest}
    />
  );
};
