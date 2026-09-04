import React, { useMemo } from "react";
import { ObjectTableProps, TableColumnConfig } from "@/shared/components/table";
import { formatDateTimeDDMMYYYY } from "@/shared/utils/date.util";
import { formatMoney } from "@/shared/utils/number.util";
import { FundAdjustment } from "../fundAdjustment.model";

export const FundAdjustmentTable: React.FC<ObjectTableProps> = ({ ...rest }) => {
  const columns = useMemo(
    () => [
      { title: "Số phiếu", dataIndex: "code", key: "code", width: 140, fixed: "left" as const, className: "code-column font-mono" },
      { title: "Thời gian", dataIndex: "occurredAt", key: "occurredAt", width: 150, render: (value: string) => formatDateTimeDDMMYYYY(value) },
      { title: "Quỹ", key: "fund", width: 220, render: (_: unknown, record: FundAdjustment) => record.fund?.name || record.fundSnapshot?.name || "—" },
      { title: "Số dư hệ thống", dataIndex: "expectedAmount", key: "expectedAmount", width: 160, align: "right" as const, render: (value: number) => formatMoney(value) },
      { title: "Số dư thực tế", dataIndex: "countedAmount", key: "countedAmount", width: 160, align: "right" as const, render: (value: number) => formatMoney(value) },
      { title: "Chênh lệch", dataIndex: "deltaAmount", key: "deltaAmount", width: 150, align: "right" as const, render: (value: number) => <span className={value < 0 ? "text-red-600" : "text-emerald-600"}>{formatMoney(value)}</span> },
      { title: "Lý do", dataIndex: "reason", key: "reason", width: 220, render: (value: string | null) => value || "—" },
    ],
    [],
  );
  return <TableColumnConfig columns={columns} itemName="phiếu điều chỉnh quỹ" tableKey="fund-adjustment-table" showCreator={false} showUpdater={false} {...rest} />;
};
