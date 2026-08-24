import React, { useState } from "react";
import { usePageState } from "@/shared/hooks/usePageState";
import { SearchInput } from "@/shared";
import { useBillOfMaterialStore } from "./billOfMaterial.store";
import { BillOfMaterial } from "./billOfMaterial.model";
import { AddButton } from "@/shared";
import { Panel } from "@/shared";
import {
  BillOfMaterialTable,
  AddUpdateBillOfMaterialModal,
  BillOfMaterialDetailModal,
} from "./components";

const BillOfMaterialPage: React.FC = () => {
  const { keyword, page, size, setPage, setSize, pageAction } = usePageState<BillOfMaterial>();
  const [open, setOpen] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [rowData, setRowData] = useState<BillOfMaterial>();
  const { data, loading, pagination, create, update, remove } = useBillOfMaterialStore(
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
          <h2 className="text-xl font-bold text-blue-800 dark:text-blue-200">Ð?nh m?c NVL</h2>
          <p className="text-xs text-secondary">Qu?n l? ð?nh m?c nguyên v?t li?u</p>
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
        <BillOfMaterialTable
          dataSource={data}
          loading={loading}
          pagination={pagination}
          setPage={setPage}
          setSize={setSize}
          onEdit={(r: BillOfMaterial) => {
            setRowData(r);
            setOpen(true);
          }}
          onDelete={(r: BillOfMaterial) => remove?.(r.id)}
          onViewDetail={(r: BillOfMaterial) => {
            setRowData(r);
            setOpenDetail(true);
          }}
        />
      </Panel>
      <AddUpdateBillOfMaterialModal
        open={open}
        editData={rowData}
        loading={false}
        errors={null}
        onAdd={create}
        onEdit={update}
        onClose={() => setOpen(false)}
      />
      <BillOfMaterialDetailModal
        open={openDetail}
        data={rowData}
        onClose={() => setOpenDetail(false)}
        onOpenUpdate={(r: BillOfMaterial) => {
          setOpenDetail(false);
          setRowData(r);
          setOpen(true);
        }}
      />
    </div>
  );
};
export default BillOfMaterialPage;
