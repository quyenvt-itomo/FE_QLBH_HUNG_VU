import React from "react";
import { TableColumnConfig, ObjectTableProps } from "@/shared/components/table/TableColumnConfig";
import { BillOfMaterial } from "../billOfMaterial.model";
import { formatQuantity } from "@/shared/utils/number.util";
import { resolveByPath } from "@/shared/utils/common.util";

interface Props extends ObjectTableProps {
  onViewDetail?: (r: BillOfMaterial) => void;
}
export const BillOfMaterialTable: React.FC<Props> = ({ onViewDetail, ...rest }) => {
  const cols: any = [
    {
      title: "Hàng hóa",
      dataIndex: ["productSnapshot", "code"],
      key: "code",
      width: 120,
      className: "code-column font-mono",
      fixed: "left",
      render: (v: string, r: BillOfMaterial) => (
        <span
          className="cursor-pointer text-blue-600 hover:text-blue-800 hover:underline"
          onClick={(e) => {
            e.stopPropagation();
            onViewDetail?.(r);
          }}
        >
          {v || resolveByPath(r, ["product", "code"])}
        </span>
      ),
    },
    {
      title: "Tên SP",
      dataIndex: ["productSnapshot", "name"],
      key: "name",
      width: 250,
      render: (v: string) => v || "--",
    },
    {
      title: "Số dòng NVL",
      key: "lineCount",
      width: 100,
      align: "center",
      render: (_: any, r: BillOfMaterial) => r.lines?.length || 0,
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      key: "active",
      width: 100,
      align: "center",
      render: (v: boolean) =>
        v ? (
          <span className="text-green-600">Hoạt động</span>
        ) : (
          <span className="text-red-500">Khóa</span>
        ),
    },
  ];
  return (
    <TableColumnConfig
      columns={cols}
      itemName="Định mức NVL"
      tableKey="billOfMaterial-table"
      {...rest}
    />
  );
};
