import React, { useMemo } from "react";
import { ColumnsConfigType, ObjectTableProps, TableColumnConfig } from "@/shared/components";
import { formatDateTimeDDMMYYYY } from "@/shared/utils/date.util";
import { InternalExport, internalExportTypeItems } from "../internalExport.model";

export const InternalExportTable: React.FC<ObjectTableProps> = (props) => {
  const columns: ColumnsConfigType<InternalExport> = useMemo(() => [
    { title: "Số phiếu", key: "code", width: 140, fixed: "left", className: "font-mono", render: (record: InternalExport) => record.code },
    { title: "Loại xuất", key: "type", width: 140, render: (record: InternalExport) => internalExportTypeItems.find((item) => item.value === record.type)?.label || record.type || "--" },
    { title: "Ngày xuất", key: "occurredAt", width: 140, render: (record: InternalExport) => formatDateTimeDDMMYYYY(record.occurredAt) },
    { title: "Số dòng", key: "lines", width: 90, align: "right", render: (record: InternalExport) => record.lines?.length || 0 },
    { title: "Mục đích", key: "reason", width: 280, render: (record: InternalExport) => record.reason || "--" },
  ], []);
  return <TableColumnConfig columns={columns} itemName="phiếu xuất nội bộ" tableKey="internal-export-table" showCreator={false} showUpdater={false} {...props} />;
};
