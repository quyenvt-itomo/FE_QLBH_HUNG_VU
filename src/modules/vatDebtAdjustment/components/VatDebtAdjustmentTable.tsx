import React, { useMemo } from "react";
import { Tag } from "antd";
import { ObjectTableProps, TableColumnConfig } from "@/shared/components";
import { formatDateTimeDDMMYYYY } from "@/shared/utils/date.util";
import { formatMoney } from "@/shared/utils/number.util";
import { VatDebtAdjustment } from "../vatDebtAdjustment.model";

interface Props extends ObjectTableProps {
  onViewDetail?: (record: VatDebtAdjustment) => void;
}

export const VatDebtAdjustmentTable: React.FC<Props> = ({ onViewDetail, ...rest }) => {
  const columns = useMemo(
    () => [
      {
        title: "Số phiếu",
        key: "code",
        width: 100,
        fixed: "left" as const,
        className: "font-mono",
        render: (record: VatDebtAdjustment) => (
          <button
            type="button"
            className="font-mono text-blue-600 hover:underline"
            onClick={(event) => {
              event.stopPropagation();
              onViewDetail?.(record);
            }}
          >
            {record.code || "—"}
          </button>
        ),
      },
      {
        title: "Thời gian",
        dataIndex: "occurredAt",
        key: "occurredAt",
        width: 150,
        render: (value: string) => formatDateTimeDDMMYYYY(value),
      },
      {
        title: "VAT hệ thống",
        dataIndex: "expectedAmount",
        key: "expectedAmount",
        width: 160,
        align: "right" as const,
        render: (value: number) => formatMoney(value),
      },
      {
        title: "VAT thực tế",
        dataIndex: "countedAmount",
        key: "countedAmount",
        width: 160,
        align: "right" as const,
        render: (value: number) => formatMoney(value),
      },
      {
        title: "Chênh lệch",
        dataIndex: "deltaAmount",
        key: "deltaAmount",
        width: 150,
        align: "right" as const,
        render: (value: number) => (
          <span className={value < 0 ? "text-red-600" : "text-emerald-600"}>
            {formatMoney(value)}
          </span>
        ),
      },
      {
        title: "Loại",
        dataIndex: "isInitial",
        key: "isInitial",
        width: 140,
        render: (value: boolean) => (
          <Tag color={value ? "blue" : "default"}>{value ? "Đầu kỳ" : "Điều chỉnh"}</Tag>
        ),
      },
      {
        title: "Lý do",
        dataIndex: "reason",
        key: "reason",
        width: 240,
        render: (value: string | null) => value || "—",
      },
    ],
    [onViewDetail],
  );

  return (
    <TableColumnConfig
      columns={columns}
      itemName="phiếu điều chỉnh VAT"
      tableKey="vat-adjustment-table"
      showCreator={false}
      showUpdater={false}
      {...rest}
    />
  );
};
