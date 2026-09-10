import React, { useState } from "react";
import { usePageState } from "@/shared/hooks/usePageState";
import { useGlobalData } from "@/shared/hooks/useGlobalData";
import { AddButton, Panel, PanelFilter, SearchInput } from "@/shared/components";
import { useInventoryAdjustmentStore } from "./inventoryAdjustment.store";
import { InventoryAdjustment } from "./inventoryAdjustment.model";
import { randomId } from "@/shared/utils/common.util";
import { SortOrder } from "@/shared/constants/enum";
import { filterUses, rangerItems, sortItems } from "./filterItem";
import {
  InventoryAdjustmentTable,
  AddUpdateInventoryAdjustmentModal,
  InventoryAdjustmentDetailModal,
} from "./components";

const InventoryAdjustmentPage: React.FC = () => {
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
    reload,
    setPage,
    setSize,
    pageAction,
  } = usePageState<InventoryAdjustment>({
    sortBy: "occurredAt",
    sortOrder: SortOrder.DESC,
    filterUses,
  });
  const [open, setOpen] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [rowData, setRowData] = useState<InventoryAdjustment>();
  const [defaultData, setDefaultData] = useState<Partial<InventoryAdjustment>>();
  const { data, loading, pagination, create, update, remove } = useInventoryAdjustmentStore(
    {
      keyword,
      page,
      size,
      sortBy,
      sortOrder,
      reload,
      ...filter,
      ...ranger,
    },
    () => {
      setOpen(false);
      setOpenDetail(false);
    },
  );
  const handleCopy = (record: InventoryAdjustment) => {
    setOpenDetail(false);
    setRowData(undefined);
    setDefaultData({
      ...record,
      id: undefined,
      tempId: randomId(),
      code: "",
      status: undefined,
      storeId: undefined,
      lines: (record.lines || []).map((line: any) => ({
        ...line,
        id: undefined,
        tempId: randomId(),
        inventoryAdjustmentId: undefined,
      })),
    } as any);
    setOpen(true);
  };
  const handleOpenAdd = create
    ? () => {
        setRowData(undefined);
        setDefaultData(undefined);
        setOpen(true);
      }
    : undefined;
  const handleOpenEdit = (record: InventoryAdjustment) => {
    setDefaultData(undefined);
    setRowData(record);
    setOpen(true);
  };
  const handleOpenDetail = (record: InventoryAdjustment) => {
    setRowData(record);
    setOpenDetail(true);
  };
  const handleOpenEditFromDetail = (record: InventoryAdjustment) => {
    setOpenDetail(false);
    handleOpenEdit(record);
  };
  const handleDelete = (record: InventoryAdjustment) => remove?.(record.id);
  return (
    <div className="flex flex-col h-full w-full gap-3">
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
            <SearchInput value={keyword} onSearch={pageAction.handleSearch} maxWidth={340} />
            <AddButton
              onOpenAdd={handleOpenAdd}
              disabled={Boolean(create) && !currentStore}
              tooltip={
                !currentStore && create
                  ? "Hãy chuyển sang chi nhánh để thêm phiếu kiểm kho"
                  : undefined
              }
            />
          </div>
          <Panel className="min-w-0 flex-1 p-1">
            <InventoryAdjustmentTable
              dataSource={data}
              loading={loading}
              pagination={pagination}
              setPage={setPage}
              setSize={setSize}
              onEdit={handleOpenEdit}
              onDelete={handleDelete}
              onCopy={create ? handleCopy : undefined}
              onViewDetail={handleOpenDetail}
            />
          </Panel>
        </div>
      </div>
      <AddUpdateInventoryAdjustmentModal
        open={open}
        editData={rowData}
        defaultData={defaultData}
        loading={false}
        errors={null}
        onAdd={create}
        onEdit={update}
        onClose={() => {
          setDefaultData(undefined);
          setOpen(false);
        }}
      />
      <InventoryAdjustmentDetailModal
        open={openDetail}
        data={rowData}
        onClose={() => setOpenDetail(false)}
        onOpenUpdate={handleOpenEditFromDetail}
        onCopy={create ? handleCopy : undefined}
      />
    </div>
  );
};
export default InventoryAdjustmentPage;
