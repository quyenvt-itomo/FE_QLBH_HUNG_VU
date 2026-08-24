import React from "react";
import { usePageState } from "@/shared/hooks/usePageState";
import { SearchInput } from "@/shared";
import { useCommissionDebtReportStore } from "./commissionDebtReport.store";
import { CommissionDebtReport } from "./commissionDebtReport.model";
import { AddButton } from "@/shared";
import { Panel } from "@/shared";
import { TableColumnConfig } from "@/shared";
import { formatDate } from "@/shared/utils/date.util";

const CommissionDebtReportPage: React.FC = () => {
  const { keyword, page, size, setPage, setSize, pageAction } = usePageState<CommissionDebtReport>();
  const { data, loading, pagination } = useCommissionDebtReportStore({ keyword, page, size });

  const columns: any = [
    { title: "Mã", dataIndex: "code", key: "code", width: 120, className: "code-column font-mono", fixed: "left",
      render: (v: string) => <span className="cursor-pointer text-blue-600 hover:text-blue-800 hover:underline">{v}</span> },
    { title: "Tên", dataIndex: "name", key: "name", width: 200 },
    { title: "Ghi chú", dataIndex: "note", key: "note", width: 200, render: (v: string) => v || "--" },
  ];

  return (
    <div className="flex flex-col h-full w-full gap-3">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex flex-col">
          <h2 className="text-xl font-bold text-blue-800 dark:text-blue-200">Báo cáo CN hoa hồng</h2>
          <p className="text-xs text-secondary">Xem báo cáo công nợ hoa hồng</p>
        </div>
        <div className="flex items-center gap-3">
          <SearchInput value={keyword} onSearch={pageAction.handleSearch} maxWidth={340} />
          <AddButton title="Thêm mới" />
        </div>
      </div>
      <Panel>
        <TableColumnConfig columns={columns} dataSource={data} loading={loading} pagination={pagination} setPage={setPage} setSize={setSize} itemName="Báo cáo CN hoa hồng" tableKey="commissionDebtReport-table" />
      </Panel>
    </div>
  );
};

export default CommissionDebtReportPage;
