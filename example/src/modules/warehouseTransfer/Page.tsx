import React, { useState } from "react";
import { usePageState } from "@/shared/hooks/usePageState";
import { SearchInput } from "@/shared/components/input";
import { useWarehouseTransferStore } from "./warehouseTransfer.store";
import { WarehouseTransfer } from "./warehouseTransfer.model";
import AddButton from "@/shared/components/button/AddButton";
import { Panel } from "@/shared/components/display/Panel";
import {
  WarehouseTransferTable,
  AddUpdateWarehouseTransferModal,
  WarehouseTransferDetailModal,
} from "./components";

const WarehouseTransferPage: React.FC = () => {
  const { keyword, page, size, setPage, setSize, pageAction } = usePageState<WarehouseTransfer>();
  const [open, setOpen] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [rowData, setRowData] = useState<WarehouseTransfer>();
  const { data, loading, pagination, create, update, remove } = useWarehouseTransferStore(
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
          <h2 className="text-xl font-bold text-blue-800 dark:text-blue-200">Chuyển kho</h2>
          <p className="text-xs text-secondary">Quản lý phiếu chuyển kho</p>
        </div>
        <div className="flex items-center gap-3">
          <SearchInput value={keyword} onSearch={pageAction.handleSearch} maxWidth={340} />
          <AddButton
            title="Thêm mới"
            onOpenAdd={() => {
              setRowData(undefined);
              setOpen(true);
            }}
          />
        </div>
      </div>
      <Panel>
        <WarehouseTransferTable
          dataSource={data}
          loading={loading}
          pagination={pagination}
          setPage={setPage}
          setSize={setSize}
          onEdit={(r: WarehouseTransfer) => {
            setRowData(r);
            setOpen(true);
          }}
          onDelete={(r: WarehouseTransfer) => remove?.(r.id)}
          onViewDetail={(r: WarehouseTransfer) => {
            setRowData(r);
            setOpenDetail(true);
          }}
        />
      </Panel>
      <AddUpdateWarehouseTransferModal
        open={open}
        editData={rowData}
        loading={false}
        errors={null}
        onAdd={create}
        onEdit={update}
        onClose={() => setOpen(false)}
      />
      <WarehouseTransferDetailModal
        open={openDetail}
        data={rowData}
        onClose={() => setOpenDetail(false)}
        onOpenUpdate={(r: WarehouseTransfer) => {
          setOpenDetail(false);
          setRowData(r);
          setOpen(true);
        }}
      />
    </div>
  );
};
export default WarehouseTransferPage;
