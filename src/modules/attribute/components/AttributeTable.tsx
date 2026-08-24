import React, { useMemo } from "react";
import { TableColumnConfig, ObjectTableProps } from "@/shared";
import { Attribute } from "../attribute.model";
import { AttributeType, attributeTypeMap } from "../attribute.enum";
import { AttributeTypeTag } from "./Tag";

interface Props extends ObjectTableProps {
  onViewDetail?: (r: Attribute) => void;
}

export const AttributeTable: React.FC<Props> = ({ onViewDetail, ...rest }) => {
  const columns: any = useMemo(
    () => [
      {
        title: "Tên",
        dataIndex: "name",
        key: "name",
        width: 220,
        render: (v: string, r: Attribute) => (
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
        title: "Loại",
        dataIndex: "type",
        key: "type",
        width: 200,
        render: (t: AttributeType) => <AttributeTypeTag value={t} size="sm" />,
      },
      { title: "Ghi chú", dataIndex: "note", key: "note", width: 200, ellipsis: true },
    ],
    [onViewDetail],
  );
  return (
    <TableColumnConfig
      columns={columns}
      itemName="Thuộc tính"
      tableKey="attribute-table"
      {...rest}
    />
  );
};
