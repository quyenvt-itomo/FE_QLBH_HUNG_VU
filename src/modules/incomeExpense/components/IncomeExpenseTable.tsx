import React, { useMemo } from "react";
import { Tag } from "antd";
import { ObjectTableProps, TableColumnConfig } from "@/shared/components/table";
import { formatDateTimeDDMMYYYY } from "@/shared/utils/date.util";
import { formatMoney } from "@/shared/utils/number.util";
import { IncomeExpense, IncomeExpenseTypeEnum, incomeExpenseTypeMap } from "../incomeExpense.model";

export const IncomeExpenseTable: React.FC<ObjectTableProps> = ({ ...rest }) => {
  const columns = useMemo(
    () => [
      { title: "Số phiếu", dataIndex: "code", key: "code", width: 140, fixed: "left" as const, className: "code-column font-mono" },
      { title: "Thời gian", dataIndex: "occurredAt", key: "occurredAt", width: 150, render: (value: string) => formatDateTimeDDMMYYYY(value) },
      {
        title: "Loại",
        dataIndex: "type",
        key: "type",
        width: 110,
        align: "center" as const,
        render: (value: IncomeExpenseTypeEnum) => <Tag color={value === IncomeExpenseTypeEnum.INCOME ? "success" : "error"}>{incomeExpenseTypeMap[value] || value}</Tag>,
      },
      { title: "Số tiền", dataIndex: "amount", key: "amount", width: 160, align: "right" as const, render: (value: number, record: IncomeExpense) => <span className={record.type === IncomeExpenseTypeEnum.INCOME ? "font-medium text-emerald-600" : "font-medium text-red-600"}>{formatMoney(value)}</span> },
      { title: "Danh mục", key: "category", width: 180, render: (_: unknown, record: IncomeExpense) => record.category?.name || record.categorySnapshot?.name || "—" },
      { title: "Đối tác", key: "partner", width: 200, render: (_: unknown, record: IncomeExpense) => record.partner?.name || record.partnerSnapshot?.name || "—" },
      { title: "Quỹ", key: "fund", width: 180, render: (_: unknown, record: IncomeExpense) => record.fund?.name || record.fundSnapshot?.name || "—" },
      { title: "Nội dung", dataIndex: "description", key: "description", width: 240, render: (value: string | null) => value || "—" },
      { title: "Ghi chú", dataIndex: "note", key: "note", width: 220, render: (value: string | null) => value || "—" },
    ],
    [],
  );
  return <TableColumnConfig columns={columns} itemName="phiếu thu chi" tableKey="income-expense-table" showCreator={false} showUpdater={false} {...rest} />;
};
