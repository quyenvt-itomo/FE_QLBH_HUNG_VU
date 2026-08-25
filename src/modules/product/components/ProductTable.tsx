import React, { useMemo } from "react";
import { TableColumnConfig, ObjectTableProps } from "@/shared/components";
import { Product } from "../product.model";
import { formatMoney } from "@/shared/utils/number.util";

interface Props extends ObjectTableProps {
  onViewDetail?: (r: Product) => void;
}

export const ProductTable: React.FC<Props> = ({ onViewDetail, ...rest }) => {
  const columns: any = useMemo(
    () => [
      {
        title: "Mã hàng",
        dataIndex: "code",
        key: "code",
        width: 130,
        className: "code-column font-mono",
        fixed: "left",
        render: (v: string, r: Product) => (
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
      { title: "Tên hàng", dataIndex: "name", key: "name", width: 220 },

      {
        title: "ĐVT",
        dataIndex: ["baseUnit", "name"],
        key: "baseUnit",
        align: "center",
        width: 80,
      },
      {
        title: "Giá bán",
        dataIndex: "salePrice",
        key: "salePrice",
        width: 130,
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
      itemName="hàng hóa"
      tableKey="product-table"
      onViewDetail={onViewDetail}
      {...rest}
    />
  );
};
