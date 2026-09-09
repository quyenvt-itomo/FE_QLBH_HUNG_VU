import React from "react";
import { App } from "antd";
import { AddButton, DateRangeFilter, Panel, PanelFilter, SearchInput } from "@/shared/components";
import { usePageState } from "@/shared/hooks/usePageState";
import { useGlobalData } from "@/shared/hooks/useGlobalData";
import { SortOrder } from "@/shared/constants/enum";
import { checkSelection, randomId } from "@/shared/utils/common.util";
import {
  StoreTransfer,
  canCancelStoreTransfer,
  canEditStoreTransfer,
  canExportStoreTransfer,
  canImportStoreTransfer,
} from "./storeTransfer.model";
import { useStoreTransferStore } from "./storeTransfer.store";
import { filterUses, rangerItems, sortItems } from "./filterItem";
import { StoreTransferDetailModal, StoreTransferModal, StoreTransferTable } from "./components";

export const StoreTransferPage: React.FC = () => {
  const { modal } = App.useApp();
  const { currentStore } = useGlobalData();
  const {
    isFilterActive,
    keyword,
    page,
    size,
    sortBy,
    sortOrder,
    filter,
    ranger,
    startAt,
    endAt,
    reload,
    open,
    openDetail: isDetailOpen,
    rowData,
    setPage,
    setSize,
    setOpen,
    setOpenDetail,
    setRowData,
    defaultData,
    setDefaultData,
    pageAction,
  } = usePageState<StoreTransfer>({ sortBy: "occurredAt", sortOrder: SortOrder.DESC, filterUses });
  const store = useStoreTransferStore(
    { keyword, page, size, sortBy, sortOrder, startAt, endAt, reload, ...filter, ...ranger },
    pageAction.handleClose,
  );
  const openEdit = (record: StoreTransfer) => {
    if (!canEditStoreTransfer(record, currentStore?.id)) return;
    setRowData(record);
    setDefaultData(undefined);
    setOpen(true);
  };
  const openDetail = (record: StoreTransfer) => {
    setRowData(record);
    setOpenDetail(true);
  };
  const handleOpenAdd = store.create
    ? () => {
        setRowData(undefined);
        setDefaultData(undefined);
        setOpen(true);
      }
    : undefined;
  const handleDelete = (record: StoreTransfer) => store.remove?.(record.id);
  const handleExport = (record: StoreTransfer) => {
    if (!canExportStoreTransfer(record, currentStore?.id)) return;
    modal.confirm({
      title: "Xuất kho chuyển hàng",
      content: "Xác nhận đã xuất hàng khỏi kho chuyển?",
      okText: "Xác nhận",
      cancelText: "Đóng",
      onOk: () => store.exportTransfer?.(record.id),
    });
  };
  const handleImport = (record: StoreTransfer) => {
    if (!canImportStoreTransfer(record, currentStore?.id)) return;
    modal.confirm({
      title: "Nhập kho chuyển hàng",
      content: "Xác nhận đã nhập hàng vào kho nhận?",
      okText: "Xác nhận",
      cancelText: "Đóng",
      onOk: () => store.importTransfer?.(record.id),
    });
  };
  const handleCancel = (record: StoreTransfer) => {
    if (!canCancelStoreTransfer(record, currentStore?.id)) return;
    modal.confirm({
      title: "Hủy phiếu chuyển kho",
      content: "Phiếu sẽ tạo giao dịch đảo kho theo các mốc đã thực hiện. Tiếp tục?",
      okText: "Hủy phiếu",
      okButtonProps: { danger: true },
      cancelText: "Đóng",
      onOk: () => store.cancelTransfer?.(record.id),
    });
  };
  const handleCopy = (record: StoreTransfer) => {
    setOpenDetail(false);
    setRowData(undefined);
    setDefaultData({
      ...record,
      id: undefined,
      tempId: randomId(),
      code: "",
      status: undefined,
      exportedAt: null,
      exporterId: null,
      exporterSnapshot: null,
      importedAt: null,
      importerId: null,
      importerSnapshot: null,
      canceledAt: null,
      cancelerId: null,
      cancelerSnapshot: null,
      lines: (record.lines || []).map((line) => ({
        ...line,
        id: undefined,
        tempId: randomId(),
        transferId: undefined,
      })),
    } as any);
    setOpen(true);
  };
  const handleCreateAndExport = (data: Partial<StoreTransfer>) => {
    store.create?.(data, {
      onSuccess: (created) => {
        if (created?.id) void store.exportTransfer?.(created.id);
      },
    });
  };
  const handleUpdateAndExport = (data: Partial<StoreTransfer>) => {
    store.update?.(data, {
      onSuccess: (updated) => {
        if (updated?.id) void store.exportTransfer?.(updated.id);
      },
    });
  };
  return (
    <div className="flex h-full w-full flex-col gap-3">
      <div className="flex min-h-0 flex-1 gap-3">
        <PanelFilter
          filterActive={isFilterActive}
          sortItems={sortItems}
          sortValue={{ sortBy, sortOrder }}
          onSortChange={pageAction.handleSortChange}
          rangerItems={rangerItems}
          rangerValue={ranger}
          onRangerChange={pageAction.handleRangerChange}
          filterUses={filterUses}
          onClearFilter={pageAction.resetFilter}
        />
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <SearchInput value={keyword} onSearch={pageAction.handleSearch} maxWidth={300} />
            <div className="flex items-center gap-2">
              <DateRangeFilter
                startDate={startAt}
                endDate={endAt}
                onRangeChange={pageAction.handleDateRangerChange}
              />
              <AddButton
                onOpenAdd={handleOpenAdd}
                disabled={Boolean(store.create) && !currentStore}
                tooltip={
                  !currentStore && store.create
                    ? "Hãy chuyển sang chi nhánh để thêm phiếu chuyển kho"
                    : undefined
                }
              />
            </div>
          </div>
          <Panel className="min-w-0 flex-1 p-1">
            <StoreTransferTable
              dataSource={store.data}
              loading={store.loading}
              pagination={store.pagination}
              setPage={setPage}
              setSize={setSize}
              onEdit={openEdit}
              onDelete={handleDelete}
              onExport={handleExport}
              onImport={handleImport}
              onCancel={handleCancel}
              onCopy={store.create ? handleCopy : undefined}
              onViewDetail={openDetail}
              onRow={(record: any) => ({
                onClick: () => {
                  if (!checkSelection()) openDetail(record);
                },
              })}
            />
          </Panel>
        </div>
      </div>
      <StoreTransferModal
        open={open}
        editData={rowData}
        defaultData={defaultData}
        errors={store.errors}
        loading={store.creating || store.updating}
        onAdd={store.create}
        onEdit={store.update}
        onAddAndExport={handleCreateAndExport}
        onEditAndExport={handleUpdateAndExport}
        onExportTransfer={store.exportTransfer}
        onImportTransfer={store.importTransfer}
        onCancelTransfer={store.cancelTransfer}
        onClose={() => pageAction.handleClose(false)}
      />
      <StoreTransferDetailModal
        open={isDetailOpen}
        data={rowData}
        onClose={() => pageAction.handleClose()}
        onOpenUpdate={openEdit}
        onCopy={store.create ? handleCopy : undefined}
      />
    </div>
  );
};

export default StoreTransferPage;
