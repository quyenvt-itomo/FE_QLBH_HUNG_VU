import React, { useMemo, useState } from "react";
import { App, Button } from "antd";
import { BanknotesIcon } from "@heroicons/react/24/outline";
import { AddButton, DateRangeFilter, Panel, PanelFilter, SearchInput } from "@/shared/components";
import { usePageState } from "@/shared/hooks/usePageState";
import { checkSelection } from "@/shared/utils/common.util";
import { formatMoney } from "@/shared/utils/number.util";
import { SortOrder } from "@/shared/constants/enum";
import { IncomeExpense, IncomeExpenseTypeEnum } from "./incomeExpense.model";
import { useIncomeExpenseStore } from "./incomeExpense.store";
import { filterUses, rangerItems, sortItems } from "./filterItem";
import { IncomeExpenseAddUpdateModal, IncomeExpenseDetailModal, IncomeExpenseTable } from "./components";

export const IncomeExpensePage: React.FC = () => {
  const { modal } = App.useApp();
  const [filterType, setFilterType] = useState<IncomeExpenseTypeEnum | undefined>();
  const [openType, setOpenType] = useState<IncomeExpenseTypeEnum>(IncomeExpenseTypeEnum.INCOME);
  const { isFilterActive, keyword, page, size, sortBy, sortOrder, filter, ranger, reload, startAt, endAt, open, openDetail, rowData, setPage, setSize, setOpen, setOpenDetail, setRowData, pageAction } = usePageState<IncomeExpense>({ sortBy: "occurredAt", sortOrder: SortOrder.DESC, filterUses });
  const store = useIncomeExpenseStore({ keyword, page, size, sortBy, sortOrder, startAt, endAt, reload, type: filterType, ...filter, ...ranger }, pageAction.handleClose);
  const totalIncome = useMemo(() => store.data.filter((item) => item.type === IncomeExpenseTypeEnum.INCOME).reduce((sum, item) => sum + Number(item.amount || 0), 0), [store.data]);
  const totalExpense = useMemo(() => store.data.filter((item) => item.type === IncomeExpenseTypeEnum.EXPENSE).reduce((sum, item) => sum + Number(item.amount || 0), 0), [store.data]);
  const handleDelete = store.remove ? (record: IncomeExpense) => modal.confirm({ title: "Xóa phiếu thu chi", content: `Bạn có chắc chắn muốn xóa phiếu “${record.code}”?`, okText: "Xóa", okButtonProps: { danger: true }, cancelText: "Hủy", onOk: () => store.remove?.({ id: record.id, type: record.type } as any) }) : undefined;
  const handleEdit = store.update ? (record: IncomeExpense) => { setRowData(record); setOpen(true); } : undefined;
  const handleDetail = (record: IncomeExpense) => { setRowData(record); setOpenDetail(true); };
  const resetFilters = () => { setFilterType(undefined); pageAction.resetFilter(); };

  return <div className="flex h-full w-full flex-col gap-3">
    <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
      <div><h2 className="flex items-center gap-2 text-xl font-bold text-blue-800 dark:text-blue-200"><BanknotesIcon className="h-5 w-5" />Sổ quỹ</h2><p className="text-xs text-secondary">Theo dõi phiếu thu, phiếu chi và dòng tiền của cửa hàng</p></div>
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center"><SearchInput value={keyword} onSearch={pageAction.handleSearch} maxWidth={300} /><DateRangeFilter startDate={startAt} endDate={endAt} onRangeChange={pageAction.handleDateRangerChange} />{store.create && <div className="flex items-center gap-2"><Button type="primary" className="!bg-emerald-600 hover:!bg-emerald-700" onClick={() => { setRowData(undefined); setOpenType(IncomeExpenseTypeEnum.INCOME); setOpen(true); }}>+ Phiếu thu</Button><Button danger type="primary" onClick={() => { setRowData(undefined); setOpenType(IncomeExpenseTypeEnum.EXPENSE); setOpen(true); }}>+ Phiếu chi</Button></div>}</div>
    </div>
    <div className="flex min-h-0 flex-1 gap-3">
      <PanelFilter filterActive={isFilterActive || !!filterType} sortItems={sortItems} sortValue={{ sortBy, sortOrder }} onSortChange={pageAction.handleSortChange} rangerItems={rangerItems} rangerValue={ranger} onRangerChange={pageAction.handleRangerChange} filterUses={filterUses} enumFilters={[{ label: "Loại chứng từ", items: [{ key: IncomeExpenseTypeEnum.INCOME, label: "Phiếu thu" }, { key: IncomeExpenseTypeEnum.EXPENSE, label: "Phiếu chi" }], value: filterType ? [filterType] : [], multiple: false, onChange: (values: string[]) => { setFilterType(values[0] as IncomeExpenseTypeEnum | undefined); setPage(1); } }]} onClearFilter={resetFilters} />
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3"><div className="rounded-lg border border-gray-200 bg-white px-4 py-3"><div className="text-xs text-secondary">Tổng thu trên trang</div><div className="mt-1 text-lg font-semibold text-emerald-600">{formatMoney(totalIncome)}</div></div><div className="rounded-lg border border-gray-200 bg-white px-4 py-3"><div className="text-xs text-secondary">Tổng chi trên trang</div><div className="mt-1 text-lg font-semibold text-red-600">{formatMoney(totalExpense)}</div></div><div className="rounded-lg border border-gray-200 bg-white px-4 py-3"><div className="text-xs text-secondary">Chênh lệch trên trang</div><div className={`mt-1 text-lg font-semibold ${totalIncome - totalExpense < 0 ? "text-red-600" : "text-blue-600"}`}>{formatMoney(totalIncome - totalExpense)}</div></div></div>
        <Panel className="min-h-0 flex-1 p-1"><IncomeExpenseTable dataSource={store.data} loading={store.loading} pagination={store.pagination} setPage={setPage} setSize={setSize} onEdit={handleEdit} onDelete={handleDelete} onViewDetail={handleDetail} onRow={(record: any) => ({ onClick: () => { if (!checkSelection()) handleDetail(record); } })} /></Panel>
      </div>
    </div>
    <IncomeExpenseAddUpdateModal open={open} editData={rowData} type={rowData?.type || openType} errors={store.errors} loading={store.creating || store.updating} onAdd={store.create} onEdit={store.update} onClose={() => pageAction.handleClose(false)} />
    <IncomeExpenseDetailModal open={openDetail} data={rowData} onClose={pageAction.handleClose} onOpenUpdate={handleEdit} />
  </div>;
};

export default IncomeExpensePage;
