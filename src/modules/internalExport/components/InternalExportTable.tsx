import React, { useMemo } from "react";
import { ColumnsConfigType, ObjectTableProps, TableColumnConfig } from "@/shared/components";
import { formatDateTimeDDMMYYYY } from "@/shared/utils/date.util";
import { formatQuantity } from "@/shared/utils/number.util";
import { InternalExport } from "../internalExport.model";
import { InternalExportTypeTag } from "./Tag";

interface Props extends ObjectTableProps {
  onViewDetail?: (record: InternalExport) => void;
}

export const InternalExportTable: React.FC<Props> = ({ onViewDetail, ...rest }) => {
  const columns: ColumnsConfigType<InternalExport> = useMemo(
    () => [
      {
        title: "Số phiếu",
        dataIndex: "code",
        key: "code",
        width: 140,
        fixed: "left",
        className: "font-mono",
        render: (_value: unknown, record: InternalExport) => (
          <button
            type="button"
            className="font-mono text-blue-600 hover:underline"
            onClick={(event) => {
              event.stopPropagation();
              onViewDetail?.(record);
            }}
          >
            {record.code || "--"}
          </button>
        ),
      },
      {
        title: "Loại xuất",
        dataIndex: "type",
        key: "type",
        width: 140,
        render: (value: InternalExport["type"]) => <InternalExportTypeTag value={value} />,
      },
      {
        title: "Ngày xuất",
        dataIndex: "occurredAt",
        key: "occurredAt",
        width: 140,
        render: (value: string) => formatDateTimeDDMMYYYY(value),
      },
      {
        title: "Số dòng",
        key: "lines",
        width: 90,
        align: "right",
        render: (_value: unknown, record: InternalExport) => record.lines?.length || 0,
      },
      {
        title: "Tổng số lượng",
        key: "quantity",
        width: 130,
        align: "right",
        render: (_value: unknown, record: InternalExport) =>
          formatQuantity(
            (record.lines || []).reduce((total, line) => total + Number(line.quantity || 0), 0),
          ),
      },
      {
        title: "Mục đích",
        key: "reason",
        width: 280,
        render: (_value: unknown, record: InternalExport) => record.reason || "--",
      },
    ],
    [onViewDetail],
  );
  return (
    <TableColumnConfig
      columns={columns}
      itemName="phiếu xuất nội bộ"
      tableKey="internal-export-table"
      showCreator={false}
      showUpdater={false}
      onViewDetail={onViewDetail}
      {...rest}
    />
  );
};
