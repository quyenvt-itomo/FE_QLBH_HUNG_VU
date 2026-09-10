import React, { useMemo } from "react";
import { Tag } from "antd";
import { ColumnsConfigType, ObjectTableProps, TableColumnConfig } from "@/shared/components/table";
import { formatDateTimeDDMMYYYY } from "@/shared/utils/date.util";
import { formatMoney } from "@/shared/utils/number.util";
import {
  IncomeExpense,
  IncomeExpenseStatus,
  IncomeExpenseType,
  incomeExpenseStatusMap,
  incomeExpenseTypeMap,
} from "../incomeExpense.model";
import { IncomeExpenseStatusTag, IncomeExpenseTypeTag } from "./Tag";

interface IncomeExpenseTableProps extends ObjectTableProps {
  onViewDetail?: (record: IncomeExpense) => void;
}

export const IncomeExpenseTable: React.FC<IncomeExpenseTableProps> = ({
  onViewDetail,
  ...rest
}) => {
  const columns = useMemo(
    (): ColumnsConfigType<IncomeExpense> => [
      {
        title: "Số phiếu",
        dataIndex: "code",
        key: "code",
        width: 140,
        fixed: "left",
        className: "code-column font-mono",
        render: (value: string, record: IncomeExpense) => (
          <button
            type="button"
            className="font-mono text-left text-primary hover:underline"
            onClick={(event) => {
              event.stopPropagation();
              onViewDetail?.(record);
            }}
          >
            {value}
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
        title: "Loại",
        dataIndex: "type",
        key: "type",
        width: 110,
        align: "center",
        render: (value: IncomeExpenseType) => <IncomeExpenseTypeTag value={value} />,
      },
      {
        title: "Số tiền",
        dataIndex: "amount",
        key: "amount",
        width: 160,
        align: "right",
        render: (value: number, record: IncomeExpense) => (
          <span
            className={
              record.type === IncomeExpenseType.INCOME
                ? "font-medium text-emerald-600"
                : "font-medium text-red-600"
            }
          >
            {formatMoney(value)}
          </span>
        ),
      },
      {
        title: "Danh mục",
        key: "category",
        width: 180,
        render: (_: unknown, record: IncomeExpense) =>
          record.category?.name || record.categorySnapshot?.name || "—",
      },
      {
        title: "Đối tác",
        key: "partner",
        width: 200,
        render: (_: unknown, record: IncomeExpense) =>
          record.partner?.name || record.partnerSnapshot?.name || "—",
      },
      {
        title: "Quỹ",
        key: "fund",
        width: 180,
        render: (_: unknown, record: IncomeExpense) =>
          record.fund?.name || record.fundSnapshot?.name || "—",
      },
      {
        title: "Nội dung",
        dataIndex: "description",
        key: "description",
        width: 240,
        render: (value: string | null) => value || "—",
      },
      {
        title: "Ghi chú",
        dataIndex: "note",
        key: "note",
        width: 220,
        render: (value: string | null) => value || "—",
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        key: "status",
        width: 80,
        align: "center",
        fixed: "right",
        render: (value: IncomeExpenseStatus) => <IncomeExpenseStatusTag value={value} />,
      },
    ],
    [onViewDetail],
  );
  return (
    <TableColumnConfig
      columns={columns}
      itemName="phiếu thu chi"
      tableKey="income-expense-table"
      showCreator={false}
      showUpdater={false}
      {...rest}
    />
  );
};
