import React from "react";
import { usePageState } from "@/shared/hooks/usePageState";
import { SearchInput } from "@/shared/components/input";
import { useVatDebtReportStore } from "./vatDebtReport.store";
import { VatDebtReport } from "./vatDebtReport.model";
import AddButton from "@/shared/components/button/AddButton";
import { Panel } from "@/shared/components/display/Panel";
import { TableColumnConfig } from "@/shared/components/table/TableColumnConfig";
import { formatDate } from "@/shared/utils/date.util";

const VatDebtReportPage: React.FC = () => {
  const { keyword, page, size, setPage, setSize, pageAction } = usePageState<VatDebtReport>();
  const { data, loading, pagination } = useVatDebtReportStore({ keyword, page, size });

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
          <h2 className="text-xl font-bold text-blue-800 dark:text-blue-200">Báo cáo thuế VAT</h2>
          <p className="text-xs text-secondary">Xem báo cáo thuế VAT</p>
        </div>
        <div className="flex items-center gap-3">
          <SearchInput value={keyword} onSearch={pageAction.handleSearch} maxWidth={340} />
          <AddButton title="Thêm mới" />
        </div>
      </div>
      <Panel>
        <TableColumnConfig columns={columns} dataSource={data} loading={loading} pagination={pagination} setPage={setPage} setSize={setSize} itemName="Báo cáo thuế VAT" tableKey="vatDebtReport-table" />
      </Panel>
    </div>
  );
};

export default VatDebtReportPage;
