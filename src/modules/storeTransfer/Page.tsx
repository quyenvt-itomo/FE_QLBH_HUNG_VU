import React from "react";
import { App } from "antd";
import { ArrowsRightLeftIcon } from "@heroicons/react/24/outline";
import { AddButton, DateRangeFilter, Panel, PanelFilter, SearchInput } from "@/shared/components";
import { usePageState } from "@/shared/hooks/usePageState";
import { SortOrder } from "@/shared/constants/enum";
import { checkSelection } from "@/shared/utils/common.util";
import { StoreTransfer } from "./storeTransfer.model";
import { useStoreTransferStore } from "./storeTransfer.store";
import { filterUses, rangerItems, sortItems } from "./filterItem";
import { StoreTransferDetailModal, StoreTransferModal, StoreTransferTable } from "./components";

export const StoreTransferPage: React.FC = () => {
  const { modal } = App.useApp();
  const { isFilterActive, keyword, page, size, sortBy, sortOrder, filter, ranger, startAt, endAt, reload, open, openDetail: isDetailOpen, rowData, setPage, setSize, setOpen, setOpenDetail, setRowData, pageAction } = usePageState<StoreTransfer>({ sortBy: "occurredAt", sortOrder: SortOrder.DESC, filterUses });
  const store = useStoreTransferStore({ keyword, page, size, sortBy, sortOrder, startAt, endAt, reload, ...filter, ...ranger }, pageAction.handleClose);
  const openEdit = (record: StoreTransfer) => { setRowData(record); setOpen(true); };
  const openDetail = (record: StoreTransfer) => { setRowData(record); setOpenDetail(true); };
  return <div className="flex h-full w-full flex-col gap-3">
    <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-center"><div><h2 className="flex items-center gap-2 text-xl font-bold text-blue-800"><ArrowsRightLeftIcon className="h-5 w-5" />Chuyển kho</h2><p className="text-xs text-secondary">Chuyển hàng giữa các cửa hàng và cập nhật tồn hai kho</p></div><div className="flex flex-col gap-3 xl:flex-row xl:items-center"><SearchInput value={keyword} onSearch={pageAction.handleSearch} maxWidth={300} /><DateRangeFilter startDate={startAt} endDate={endAt} onRangeChange={pageAction.handleDateRangerChange} /><AddButton title="Thêm phiếu" onOpenAdd={store.create ? () => { setRowData(undefined); setOpen(true); } : undefined} /></div></div>
    <div className="flex min-h-0 flex-1 gap-3"><PanelFilter filterActive={isFilterActive} sortItems={sortItems} sortValue={{ sortBy, sortOrder }} onSortChange={pageAction.handleSortChange} rangerItems={rangerItems} rangerValue={ranger} onRangerChange={pageAction.handleRangerChange} filterUses={filterUses} onClearFilter={pageAction.resetFilter} /><Panel className="min-w-0 flex-1 p-1"><StoreTransferTable dataSource={store.data} loading={store.loading} pagination={store.pagination} setPage={setPage} setSize={setSize} onEdit={openEdit} onDelete={(record) => store.remove?.(record.id)} onViewDetail={openDetail} onRow={(record: any) => ({ onClick: () => { if (!checkSelection()) openDetail(record); } })} /></Panel></div>
    <StoreTransferModal open={open} editData={rowData} errors={store.errors} loading={store.creating || store.updating} onAdd={store.create} onEdit={store.update} onClose={() => pageAction.handleClose(false)} />
    <StoreTransferDetailModal open={isDetailOpen} data={rowData} onClose={() => pageAction.handleClose()} onOpenUpdate={openEdit} />
  </div>;
};

export default StoreTransferPage;
