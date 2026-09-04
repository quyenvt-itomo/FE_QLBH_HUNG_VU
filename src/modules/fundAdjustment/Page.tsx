import React from "react";
import { App } from "antd";
import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";
import { AddButton, DateRangeFilter, Panel, PanelFilter, SearchInput } from "@/shared/components";
import { usePageState } from "@/shared/hooks/usePageState";
import { checkSelection } from "@/shared/utils/common.util";
import { SortOrder } from "@/shared/constants/enum";
import { FundAdjustment } from "./fundAdjustment.model";
import { useFundAdjustmentStore } from "./fundAdjustment.store";
import { filterUses, rangerItems, sortItems } from "./filterItem";
import { FundAdjustmentAddUpdateModal, FundAdjustmentDetailModal, FundAdjustmentTable } from "./components";

export const FundAdjustmentPage: React.FC = () => {
  const { modal } = App.useApp();
  const {
    isFilterActive, keyword, page, size, sortBy, sortOrder, filter, ranger, reload, startAt, endAt,
    open, openDetail, rowData, setPage, setSize, setOpen, setOpenDetail, setRowData, pageAction,
  } = usePageState<FundAdjustment>({ sortBy: "occurredAt", sortOrder: SortOrder.DESC, filterUses });
  const store = useFundAdjustmentStore({ keyword, page, size, sortBy, sortOrder, startAt, endAt, reload, ...filter, ...ranger }, pageAction.handleClose);

  const handleDelete = store.remove ? (record: FundAdjustment) => modal.confirm({
    title: "Xóa phiếu điều chỉnh quỹ",
    content: `Bạn có chắc chắn muốn xóa phiếu “${record.code}”?`,
    okText: "Xóa", okButtonProps: { danger: true }, cancelText: "Hủy",
    onOk: () => store.remove?.(record.id),
  }) : undefined;
  const handleEdit = store.update ? (record: FundAdjustment) => { setRowData(record); setOpen(true); } : undefined;
  const handleDetail = (record: FundAdjustment) => { setRowData(record); setOpenDetail(true); };

  return <div className="flex h-full w-full flex-col gap-3">
    <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
      <div>
        <h2 className="flex items-center gap-2 text-xl font-bold text-blue-800 dark:text-blue-200"><AdjustmentsHorizontalIcon className="h-5 w-5" />Điều chỉnh số dư</h2>
        <p className="text-xs text-secondary">Ghi nhận chênh lệch giữa số dư hệ thống và số dư thực tế</p>
      </div>
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
        <SearchInput value={keyword} onSearch={pageAction.handleSearch} maxWidth={300} />
        <DateRangeFilter startDate={startAt} endDate={endAt} onRangeChange={pageAction.handleDateRangerChange} />
        <AddButton title="Thêm phiếu" onOpenAdd={store.create ? () => { setRowData(undefined); setOpen(true); } : undefined} />
      </div>
    </div>
    <div className="flex min-h-0 flex-1 gap-3">
      <PanelFilter filterActive={isFilterActive} sortItems={sortItems} sortValue={{ sortBy, sortOrder }} onSortChange={pageAction.handleSortChange} rangerItems={rangerItems} rangerValue={ranger} onRangerChange={pageAction.handleRangerChange} filterUses={filterUses} onClearFilter={pageAction.resetFilter} />
      <Panel className="min-w-0 flex-1 p-1">
        <FundAdjustmentTable dataSource={store.data} loading={store.loading} pagination={store.pagination} setPage={setPage} setSize={setSize} onEdit={handleEdit} onDelete={handleDelete} onViewDetail={handleDetail} onRow={(record: any) => ({ onClick: () => { if (!checkSelection()) handleDetail(record); } })} />
      </Panel>
    </div>
    <FundAdjustmentAddUpdateModal open={open} editData={rowData} errors={store.errors} loading={store.creating || store.updating} onAdd={store.create} onEdit={store.update} onClose={() => pageAction.handleClose(false)} />
    <FundAdjustmentDetailModal open={openDetail} data={rowData} onClose={pageAction.handleClose} onOpenUpdate={handleEdit} />
  </div>;
};

export default FundAdjustmentPage;
