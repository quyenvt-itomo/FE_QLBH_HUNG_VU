import React, { useMemo } from "react";
import { ObjectTableProps, TableColumnConfig } from "@/shared/components/table";
import { formatDateTimeDDMMYYYY } from "@/shared/utils/date.util";
import { formatMoney } from "@/shared/utils/number.util";
import { FundTransfer } from "../fundTransfer.model";

export const FundTransferTable: React.FC<ObjectTableProps> = ({ ...rest }) => {
  const columns = useMemo(
    () => [
      { title: "Số phiếu", dataIndex: "code", key: "code", width: 140, fixed: "left" as const, className: "code-column font-mono" },
      { title: "Thời gian", dataIndex: "occurredAt", key: "occurredAt", width: 150, render: (value: string) => formatDateTimeDDMMYYYY(value) },
      { title: "Quỹ chuyển đi", key: "fromFund", width: 200, render: (_: unknown, record: FundTransfer) => record.fromFund?.name || "—" },
      { title: "Quỹ nhận", key: "toFund", width: 200, render: (_: unknown, record: FundTransfer) => record.toFund?.name || "—" },
      { title: "Số tiền", dataIndex: "amount", key: "amount", width: 160, align: "right" as const, render: (value: number) => formatMoney(value) },
      { title: "Ghi chú", dataIndex: "note", key: "note", width: 240, render: (value: string | null) => value || "—" },
    ],
    [],
  );
  return <TableColumnConfig columns={columns} itemName="phiếu chuyển quỹ" tableKey="fund-transfer-table" showCreator={false} showUpdater={false} {...rest} />;
};
