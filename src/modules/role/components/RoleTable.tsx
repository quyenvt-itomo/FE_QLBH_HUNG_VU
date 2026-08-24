import React, { useMemo } from "react";
import { TableColumnConfig, ObjectTableProps } from "@/shared/components";
import { Role } from "../role.model";

interface Props extends ObjectTableProps {
  onViewDetail?: (r: Role) => void;
}

export const RoleTable: React.FC<Props> = ({ onViewDetail, ...rest }) => {
  const columns: any = useMemo(
    () => [
      {
        title: "Tên",
        dataIndex: "name",
        key: "name",
        width: 220,
        render: (v: string, r: Role) => (
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
        title: "Số user",
        dataIndex: "userCount",
        key: "userCount",
        width: 100,
        align: "center",
        render: (v: number) => v ?? 0,
      },
      { title: "Ghi chú", dataIndex: "note", key: "note", width: 200, ellipsis: true },
    ],
    [onViewDetail],
  );
  return <TableColumnConfig columns={columns} itemName="Vai trò" tableKey="role-table" {...rest} />;
};
