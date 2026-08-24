import React, { useState } from "react";
import { usePageState } from "@/shared/hooks/usePageState";
import { SearchInput } from "@/shared";
import { useInventoryAdjustmentStore } from "./inventoryAdjustment.store";
import { InventoryAdjustment } from "./inventoryAdjustment.model";
import { AddButton } from "@/shared";
import { Panel } from "@/shared";
import {
  InventoryAdjustmentTable,
  AddUpdateInventoryAdjustmentModal,
  InventoryAdjustmentDetailModal,
} from "./components";

const InventoryAdjustmentPage: React.FC = () => {
  const { keyword, page, size, setPage, setSize, pageAction } = usePageState<InventoryAdjustment>();
  const [open, setOpen] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [rowData, setRowData] = useState<InventoryAdjustment>();
  const { data, loading, pagination, create, update, remove } = useInventoryAdjustmentStore(
    { keyword, page, size },
    () => {
      setOpen(false);
      setOpenDetail(false);
    },
  );
  return (
    <div className="flex flex-col h-full w-full gap-3">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex flex-col">
          <h2 className="text-xl font-bold text-blue-800 dark:text-blue-200">Ki?m kê</h2>
          <p className="text-xs text-secondary">Qu?n l? phi?u ki?m kê</p>
        </div>
        <div className="flex items-center gap-3">
          <SearchInput value={keyword} onSearch={pageAction.handleSearch} maxWidth={340} />
          <AddButton
            title="Thêm m?i"
            onOpenAdd={() => {
              setRowData(undefined);
              setOpen(true);
            }}
          />
        </div>
      </div>
      <Panel>
        <InventoryAdjustmentTable
          dataSource={data}
          loading={loading}
          pagination={pagination}
          setPage={setPage}
          setSize={setSize}
          onEdit={(r: InventoryAdjustment) => {
            setRowData(r);
            setOpen(true);
          }}
          onDelete={(r: InventoryAdjustment) => remove?.(r.id)}
          onViewDetail={(r: InventoryAdjustment) => {
            setRowData(r);
            setOpenDetail(true);
          }}
        />
      </Panel>
      <AddUpdateInventoryAdjustmentModal
        open={open}
        editData={rowData}
        loading={false}
        errors={null}
        onAdd={create}
        onEdit={update}
        onClose={() => setOpen(false)}
      />
      <InventoryAdjustmentDetailModal
        open={openDetail}
        data={rowData}
        onClose={() => setOpenDetail(false)}
        onOpenUpdate={(r: InventoryAdjustment) => {
          setOpenDetail(false);
          setRowData(r);
          setOpen(true);
        }}
      />
    </div>
  );
};
export default InventoryAdjustmentPage;
