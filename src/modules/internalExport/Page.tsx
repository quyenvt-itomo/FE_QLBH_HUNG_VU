import React from "react";
import { AddButton, DateRangeFilter, Panel, PanelFilter, SearchInput } from "@/shared/components";
import { useGlobalData } from "@/shared/hooks/useGlobalData";
import { usePageState } from "@/shared/hooks/usePageState";
import { SortOrder } from "@/shared/constants/enum";
import { checkSelection, randomId } from "@/shared/utils/common.util";
import { InternalExport } from "./internalExport.model";
import { useInternalExportStore } from "./internalExport.store";
import { InternalExportDetailModal, InternalExportModal, InternalExportTable } from "./components";

export const InternalExportPage: React.FC = () => {
  const { currentStore } = useGlobalData();
  const {
    keyword,
    page,
    size,
    sortBy,
    sortOrder,
    startAt,
    endAt,
    reload,
    open,
    openDetail,
    rowData,
    defaultData,
    setPage,
    setSize,
    setOpen,
    setOpenDetail,
    setRowData,
    setDefaultData,
    pageAction,
    isFilterActive,
    filter,
    ranger,
  } = usePageState<InternalExport>({ sortBy: "occurredAt", sortOrder: SortOrder.DESC });
  const store = useInternalExportStore(
    { keyword, page, size, sortBy, sortOrder, startAt, endAt, reload, ...filter, ...ranger },
    pageAction.handleClose,
  );
  const edit = (record: InternalExport) => {
    setDefaultData(undefined);
    setRowData(record);
    setOpen(true);
  };
  const detail = (record: InternalExport) => {
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
  const handleDelete = (record: InternalExport) => store.remove?.(record.id);
  const handleCopy = (record: InternalExport) => {
    setOpenDetail(false);
    setRowData(undefined);
    setDefaultData({
      ...record,
      id: undefined,
      tempId: randomId(),
      code: "",
      lines: (record.lines || []).map((line: any) => ({
        ...line,
        id: undefined,
        tempId: randomId(),
        internalExportId: undefined,
      })),
    } as any);
    setOpen(true);
  };

  return (
    <div className="flex h-full w-full flex-col gap-3">
      <div className="flex min-h-0 flex-1 gap-3">
        <PanelFilter
          filterActive={isFilterActive}
          sortItems={[
            {
              label: "Ngày xuất",
              value: "occurredAt",
              ascLabel: "Cũ nhất",
              descLabel: "Mới nhất",
            },
            { label: "Số phiếu", value: "code", ascLabel: "A → Z", descLabel: "Z → A" },
          ]}
          sortValue={{ sortBy, sortOrder }}
          onSortChange={pageAction.handleSortChange}
          rangerItems={[]}
          rangerValue={ranger}
          onRangerChange={pageAction.handleRangerChange}
          filterUses={[]}
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
                    ? "Hãy chuyển sang chi nhánh để thêm phiếu xuất nội bộ"
                    : undefined
                }
              />
            </div>
          </div>
          <Panel className="min-w-0 flex-1 p-1">
            <InternalExportTable
              dataSource={store.data}
              loading={store.loading}
              pagination={store.pagination}
              setPage={setPage}
              setSize={setSize}
              onEdit={edit}
              onDelete={handleDelete}
              onCopy={store.create ? handleCopy : undefined}
              onViewDetail={detail}
              onRow={(record: any) => ({
                onClick: () => {
                  if (!checkSelection()) detail(record);
                },
              })}
            />
          </Panel>
        </div>
      </div>
      <InternalExportModal
        open={open}
        editData={rowData}
        defaultData={defaultData}
        errors={store.errors}
        loading={store.creating || store.updating}
        onAdd={store.create}
        onEdit={store.update}
        onClose={() => pageAction.handleClose(false)}
      />
      <InternalExportDetailModal
        open={openDetail}
        data={rowData}
        onClose={() => pageAction.handleClose()}
        onOpenUpdate={edit}
        onCopy={store.create ? handleCopy : undefined}
      />
    </div>
  );
};

export default InternalExportPage;
