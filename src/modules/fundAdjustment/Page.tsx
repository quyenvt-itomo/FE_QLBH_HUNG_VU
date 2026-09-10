import React from "react";
import { App } from "antd";
import { AddButton, Panel, PanelFilter, SearchInput } from "@/shared/components";
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
    isFilterActive, keyword, page, size, sortBy, sortOrder, filter, ranger, reload,
    open, openDetail, rowData, setPage, setSize, setOpen, setOpenDetail, setRowData, pageAction,
  } = usePageState<FundAdjustment>({ sortBy: "occurredAt", sortOrder: SortOrder.DESC, filterUses });
  const store = useFundAdjustmentStore({ keyword, page, size, sortBy, sortOrder, reload, ...filter, ...ranger }, pageAction.handleClose);

  const handleDelete = store.remove ? (record: FundAdjustment) => modal.confirm({
    title: "Xóa phiếu điều chỉnh quỹ",
    content: `Bạn có chắc chắn muốn xóa phiếu “${record.code}”?`,
    okText: "Xóa", okButtonProps: { danger: true }, cancelText: "Hủy",
    onOk: () => store.remove?.(record.id),
  }) : undefined;
  const handleEdit = store.update ? (record: FundAdjustment) => { setRowData(record); setOpen(true); } : undefined;
  const handleDetail = (record: FundAdjustment) => { setRowData(record); setOpenDetail(true); };

  return <div className="flex h-full w-full gap-3">
    <PanelFilter filterActive={isFilterActive} sortItems={sortItems} sortValue={{ sortBy, sortOrder }} onSortChange={pageAction.handleSortChange} rangerItems={rangerItems} rangerValue={ranger} onRangerChange={pageAction.handleRangerChange} filterUses={filterUses} onClearFilter={pageAction.resetFilter} />
    <div className="flex min-w-0 flex-1 flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <SearchInput value={keyword} onSearch={pageAction.handleSearch} maxWidth={300} />
        <AddButton title="Thêm phiếu" onOpenAdd={store.create ? () => { setRowData(undefined); setOpen(true); } : undefined} />
      </div>
      <Panel className="min-w-0 flex-1 p-1">
        <FundAdjustmentTable dataSource={store.data} loading={store.loading} pagination={store.pagination} setPage={setPage} setSize={setSize} onEdit={handleEdit} onDelete={handleDelete} onViewDetail={handleDetail} onRow={(record: any) => ({ onClick: () => { if (!checkSelection()) handleDetail(record); } })} />
      </Panel>
    </div>
    <FundAdjustmentAddUpdateModal open={open} editData={rowData} errors={store.errors} loading={store.creating || store.updating} onAdd={store.create} onEdit={store.update} onClose={() => pageAction.handleClose(false)} />
    <FundAdjustmentDetailModal open={openDetail} data={rowData} onClose={pageAction.handleClose} onOpenUpdate={handleEdit} />
  </div>;
};

export default FundAdjustmentPage;
