import React from "react";
import { App } from "antd";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import { AddButton, DateRangeFilter, Panel, PanelFilter, SearchInput } from "@/shared/components";
import { usePageState } from "@/shared/hooks/usePageState";
import { SortOrder } from "@/shared/constants/enum";
import { checkSelection } from "@/shared/utils/common.util";
import { InternalExport } from "./internalExport.model";
import { useInternalExportStore } from "./internalExport.store";
import { InternalExportDetailModal, InternalExportModal, InternalExportTable } from "./components";

export const InternalExportPage: React.FC = () => {
  const { modal } = App.useApp();
  const { keyword, page, size, sortBy, sortOrder, startAt, endAt, reload, open, openDetail, rowData, setPage, setSize, setOpen, setOpenDetail, setRowData, pageAction, isFilterActive, filter, ranger } = usePageState<InternalExport>({ sortBy: "occurredAt", sortOrder: SortOrder.DESC });
  const store = useInternalExportStore({ keyword, page, size, sortBy, sortOrder, startAt, endAt, reload, ...filter, ...ranger }, pageAction.handleClose);
  const edit = (record: InternalExport) => { setRowData(record); setOpen(true); };
  const detail = (record: InternalExport) => { setRowData(record); setOpenDetail(true); };
  return <div className="flex h-full w-full flex-col gap-3"><div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-center"><div><h2 className="flex items-center gap-2 text-xl font-bold text-blue-800"><ArrowUpTrayIcon className="h-5 w-5" />Xuất nội bộ</h2><p className="text-xs text-secondary">Xuất hàng sử dụng nội bộ và trừ tồn kho cửa hàng</p></div><div className="flex flex-col gap-3 xl:flex-row xl:items-center"><SearchInput value={keyword} onSearch={pageAction.handleSearch} maxWidth={300} /><DateRangeFilter startDate={startAt} endDate={endAt} onRangeChange={pageAction.handleDateRangerChange} /><AddButton title="Thêm phiếu" onOpenAdd={store.create ? () => { setRowData(undefined); setOpen(true); } : undefined} /></div></div><div className="flex min-h-0 flex-1 gap-3"><PanelFilter filterActive={isFilterActive} sortItems={[{ label: "Ngày xuất", value: "occurredAt", ascLabel: "Cũ nhất trước", descLabel: "Mới nhất trước" }, { label: "Số phiếu", value: "code", ascLabel: "A → Z", descLabel: "Z → A" }]} sortValue={{ sortBy, sortOrder }} onSortChange={pageAction.handleSortChange} rangerItems={[]} rangerValue={ranger} onRangerChange={pageAction.handleRangerChange} filterUses={[]} onClearFilter={pageAction.resetFilter} /><Panel className="min-w-0 flex-1 p-1"><InternalExportTable dataSource={store.data} loading={store.loading} pagination={store.pagination} setPage={setPage} setSize={setSize} onEdit={edit} onDelete={(record) => store.remove?.(record.id)} onViewDetail={detail} onRow={(record: any) => ({ onClick: () => { if (!checkSelection()) detail(record); } })} /></Panel></div><InternalExportModal open={open} editData={rowData} errors={store.errors} loading={store.creating || store.updating} onAdd={store.create} onEdit={store.update} onClose={() => pageAction.handleClose(false)} /><InternalExportDetailModal open={openDetail} data={rowData} onClose={() => pageAction.handleClose()} onOpenUpdate={edit} /></div>;
};

export default InternalExportPage;
