import React, { useMemo } from "react";
import { TableColumnConfig, ObjectTableProps } from "@/shared/components";
import { Product, ProductType, productLabel, productTypeMap } from "../product.model";
import { formatMoney, formatPercentage } from "@/shared/utils/number.util";
import { ProductTypeTag } from "./Tag";
import { TableBooleanCell } from "@/shared/components";

interface Props extends ObjectTableProps {
  type: ProductType;
  onViewDetail?: (r: Product) => void;
}

export const ProductTable: React.FC<Props> = ({ type, onViewDetail, ...rest }) => {
  const columns: any = useMemo(
    () => [
      {
        title: `Mã ${productTypeMap[type].toLowerCase()}`,
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
      { title: productLabel(type, "Tên"), dataIndex: "name", key: "name", width: 220 },
      {
        title: "Loại",
        dataIndex: "type",
        key: "type",
        width: 80,
        align: "center",
        render: (val: any) => <ProductTypeTag value={val} />,
      },
      {
        title: "ĐVT",
        dataIndex: ["baseUnit", "name"],
        key: "baseUnit",
        align: "center",
        width: 80,
      },
      {
        title: "Giá",
        dataIndex: "price",
        key: "price",
        width: 130,
        align: "right",
        render: (v: number) => (v != null ? formatMoney(v) : "--"),
      },
      {
        title: "%VAT",
        dataIndex: "taxRate",
        key: "taxRate",
        width: 80,
        align: "right",
        render: (v: number) => formatPercentage(v),
      },
      {
        title: "Công khai",
        dataIndex: "isPublic",
        key: "isPublic",
        width: 90,
        align: "center",
        render: (v: boolean) => <TableBooleanCell value={v} />,
      },
      { title: "Ghi chú", dataIndex: "note", key: "note", width: 200, ellipsis: true },
    ],
    [type, onViewDetail],
  );

  return (
    <TableColumnConfig
      columns={columns}
      itemName={productTypeMap[type]}
      tableKey="product-table"
      onViewDetail={onViewDetail}
      {...rest}
    />
  );
};
