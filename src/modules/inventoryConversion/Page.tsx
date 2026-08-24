import React, { useState } from "react";
import { usePageState } from "@/shared/hooks/usePageState";
import { SearchInput } from "@/shared";
import { useInventoryConversionStore } from "./inventoryConversion.store";
import { InventoryConversion } from "./inventoryConversion.model";
import { AddButton } from "@/shared";
import { Panel } from "@/shared";
import {
  InventoryConversionTable,
  AddUpdateInventoryConversionModal,
  InventoryConversionDetailModal,
} from "./components";

const InventoryConversionPage: React.FC = () => {
  const { keyword, page, size, setPage, setSize, pageAction } = usePageState<InventoryConversion>();
  const [open, setOpen] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [rowData, setRowData] = useState<InventoryConversion>();
  const { data, loading, pagination, create, update, remove } = useInventoryConversionStore(
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
          <h2 className="text-xl font-bold text-blue-800 dark:text-blue-200">Chuy?n m?</h2>
          <p className="text-xs text-secondary">Qu?n l? phi?u chuy?n m?</p>
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
        <InventoryConversionTable
          dataSource={data}
          loading={loading}
          pagination={pagination}
          setPage={setPage}
          setSize={setSize}
          onEdit={(r: InventoryConversion) => {
            setRowData(r);
            setOpen(true);
          }}
          onDelete={(r: InventoryConversion) => remove?.(r.id)}
          onViewDetail={(r: InventoryConversion) => {
            setRowData(r);
            setOpenDetail(true);
          }}
        />
      </Panel>
      <AddUpdateInventoryConversionModal
        open={open}
        editData={rowData}
        loading={false}
        errors={null}
        onAdd={create}
        onEdit={update}
        onClose={() => setOpen(false)}
      />
      <InventoryConversionDetailModal
        open={openDetail}
        data={rowData}
        onClose={() => setOpenDetail(false)}
        onOpenUpdate={(r: InventoryConversion) => {
          setOpenDetail(false);
          setRowData(r);
          setOpen(true);
        }}
      />
    </div>
  );
};
export default InventoryConversionPage;
