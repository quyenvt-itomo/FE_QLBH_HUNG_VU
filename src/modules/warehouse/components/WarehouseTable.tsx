import React, { useMemo } from "react";
import { TableColumnConfig, ObjectTableProps } from "@/shared";
import { Warehouse } from "../warehouse.model";
import { getFullAddress } from "@/shared/utils/common.util";

interface Props extends ObjectTableProps {
  onViewDetail?: (r: Warehouse) => void;
}

export const WarehouseTable: React.FC<Props> = ({ onViewDetail, ...rest }) => {
  const columns: any = useMemo(
    () => [
      {
        title: "Mã",
        dataIndex: "code",
        key: "code",
        width: 130,
        className: "code-column font-mono",
        fixed: "left",
        render: (v: string, r: Warehouse) => (
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
      { title: "Tên", dataIndex: "name", key: "name", width: 220 },
      { title: "SĐT", dataIndex: "phone", key: "phone", width: 130 },
      {
        title: "Địa chỉ",
        dataIndex: "address",
        key: "address",
        width: 250,
        render: (v: Warehouse["address"]) => getFullAddress(v),
      },
      { title: "Thủ kho", dataIndex: ["manager", "name"], key: "managerName", width: 130 },
      {
        title: "Mặc định",
        dataIndex: "isDefault",
        key: "isDefault",
        width: 90,
        align: "center",
        render: (v: boolean) => (v ? "✅" : "—"),
      },
      { title: "Ghi chú", dataIndex: "note", key: "note", width: 200 },
    ],
    [onViewDetail],
  );
  return (
    <TableColumnConfig columns={columns} itemName="Kho" tableKey="warehouse-table" {...rest} />
  );
};
