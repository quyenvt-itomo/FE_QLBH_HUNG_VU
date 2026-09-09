import React, { useMemo } from "react";
import { ObjectTableProps, TableColumnConfig, ColumnsConfigType } from "@/shared/components";
import { StoreTransfer } from "../storeTransfer.model";
import { formatDateTimeDDMMYYYY } from "@/shared/utils/date.util";

export const StoreTransferTable: React.FC<ObjectTableProps> = (props) => {
  const columns: ColumnsConfigType<StoreTransfer> = useMemo(() => [
    { title: "Số phiếu", key: "code", width: 140, fixed: "left", className: "font-mono", render: (record: StoreTransfer) => record.code },
    { title: "Ngày chuyển", key: "occurredAt", width: 140, render: (record: StoreTransfer) => formatDateTimeDDMMYYYY(record.occurredAt) },
    { title: "Kho chuyển đi", key: "fromStore", width: 180, render: (record: StoreTransfer) => record.fromStore?.name || record.fromStoreSnapshot?.name || "--" },
    { title: "Kho nhận", key: "toStore", width: 180, render: (record: StoreTransfer) => record.toStore?.name || record.toStoreSnapshot?.name || "--" },
    { title: "Số dòng", key: "lines", width: 90, align: "right", render: (record: StoreTransfer) => record.lines?.length || 0 },
    { title: "Lý do", key: "reason", width: 240, render: (record: StoreTransfer) => record.reason || "--" },
  ], []);
  return <TableColumnConfig columns={columns} itemName="phiếu chuyển kho" tableKey="store-transfer-table" showCreator={false} showUpdater={false} {...props} />;
};
