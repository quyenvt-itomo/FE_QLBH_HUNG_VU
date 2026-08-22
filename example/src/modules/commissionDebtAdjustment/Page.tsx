import React, { useState } from "react";
import { usePageState } from "@/shared/hooks/usePageState";
import { SearchInput } from "@/shared/components/input";
import { useCommissionDebtAdjustmentStore } from "./commissionDebtAdjustment.store";
import { CommissionDebtAdjustment } from "./commissionDebtAdjustment.model";
import AddButton from "@/shared/components/button/AddButton";
import { Panel } from "@/shared/components/display/Panel";
import {
  CommissionDebtAdjustmentTable,
  AddUpdateCommissionDebtAdjustmentModal,
  CommissionDebtAdjustmentDetailModal,
} from "./components";

const CommissionDebtAdjustmentPage: React.FC = () => {
  const { keyword, page, size, setPage, setSize, pageAction } =
    usePageState<CommissionDebtAdjustment>();
  const [open, setOpen] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [rowData, setRowData] = useState<CommissionDebtAdjustment>();
  const { data, loading, pagination, create, update, remove } = useCommissionDebtAdjustmentStore(
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
          <h2 className="text-xl font-bold text-blue-800 dark:text-blue-200">
            Điều chỉnh CN hoa hồng
          </h2>
          <p className="text-xs text-secondary">Điều chỉnh công nợ hoa hồng</p>
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
        <CommissionDebtAdjustmentTable
          dataSource={data}
          loading={loading}
          pagination={pagination}
          setPage={setPage}
          setSize={setSize}
          onEdit={(r: CommissionDebtAdjustment) => {
            setRowData(r);
            setOpen(true);
          }}
          onDelete={(r: CommissionDebtAdjustment) => remove?.(r.id)}
          onViewDetail={(r: CommissionDebtAdjustment) => {
            setRowData(r);
            setOpenDetail(true);
          }}
        />
      </Panel>
      <AddUpdateCommissionDebtAdjustmentModal
        open={open}
        editData={rowData}
        loading={false}
        errors={null}
        onAdd={create}
        onEdit={update}
        onClose={() => setOpen(false)}
      />
      <CommissionDebtAdjustmentDetailModal
        open={openDetail}
        data={rowData}
        onClose={() => setOpenDetail(false)}
        onOpenUpdate={(r: CommissionDebtAdjustment) => {
          setOpenDetail(false);
          setRowData(r);
          setOpen(true);
        }}
      />
    </div>
  );
};
export default CommissionDebtAdjustmentPage;
