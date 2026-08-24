import React from "react";
import { TableColumnConfig, ObjectTableProps } from "@/shared";
import { GateLog } from "../gateLog.model";
import { formatDate } from "@/shared/utils/date.util";

interface Props extends ObjectTableProps {
  onViewDetail?: (r: GateLog) => void;
}
export const GateLogTable: React.FC<Props> = ({ onViewDetail, ...rest }) => {
  const cols: any = [
    {
      title: "Mã",
      dataIndex: "code",
      key: "code",
      width: 140,
      className: "code-column font-mono",
      fixed: "left",
      render: (v: string, r: GateLog) => (
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
      dataIndex: "occurredAt",
      key: "date",
      width: 100,
      align: "center",
      render: (v: string) => v || "--",
    },
    { title: "Biển số", dataIndex: "vehiclePlate", key: "plate", width: 120 },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      width: 150,
      render: (v: string) => v || "--",
    },
  ];
  return (
    <TableColumnConfig columns={cols} itemName="Nhật ký cổng" tableKey="gateLog-table" {...rest} />
  );
};
