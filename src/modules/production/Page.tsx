import React, { useState } from "react";
import { usePageState } from "@/shared/hooks/usePageState";
import { SearchInput } from "@/shared";
import { useProductionStore } from "./production.store";
import { Production } from "./production.model";
import { AddButton } from "@/shared";
import { Panel } from "@/shared";
import { ProductionTable, AddUpdateProductionModal, ProductionDetailModal } from "./components";

const ProductionPage: React.FC = () => {
  const { keyword, page, size, setPage, setSize, pageAction } = usePageState<Production>();
  const [open, setOpen] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [rowData, setRowData] = useState<Production>();
  const { data, loading, pagination, create, update, remove } = useProductionStore(
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
          <h2 className="text-xl font-bold text-blue-800 dark:text-blue-200">L?nh s?n xu?t</h2>
          <p className="text-xs text-secondary">Qu?n l? l?nh s?n xu?t</p>
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
        <ProductionTable
          dataSource={data}
          loading={loading}
          pagination={pagination}
          setPage={setPage}
          setSize={setSize}
          onEdit={(r: Production) => {
            setRowData(r);
            setOpen(true);
          }}
          onDelete={(r: Production) => remove?.(r.id)}
          onViewDetail={(r: Production) => {
            setRowData(r);
            setOpenDetail(true);
          }}
        />
      </Panel>
      <AddUpdateProductionModal
        open={open}
        editData={rowData}
        loading={false}
        errors={null}
        onAdd={create}
        onEdit={update}
        onClose={() => setOpen(false)}
      />
      <ProductionDetailModal
        open={openDetail}
        data={rowData}
        onClose={() => setOpenDetail(false)}
        onOpenUpdate={(r: Production) => {
          setOpenDetail(false);
          setRowData(r);
          setOpen(true);
        }}
      />
    </div>
  );
};
export default ProductionPage;
