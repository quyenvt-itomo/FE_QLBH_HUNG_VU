import React, { useState } from "react";
import { usePageState } from "@/shared/hooks/usePageState";
import { SearchInput } from "@/shared";
import { usePaymentRequestStore } from "./paymentRequest.store";
import { PaymentRequest } from "./paymentRequest.model";
import { AddButton } from "@/shared";
import { Panel } from "@/shared";
import {
  PaymentRequestTable,
  AddUpdatePaymentRequestModal,
  PaymentRequestDetailModal,
} from "./components";

const PaymentRequestPage: React.FC = () => {
  const { keyword, page, size, setPage, setSize, pageAction } = usePageState<PaymentRequest>();
  const [open, setOpen] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [rowData, setRowData] = useState<PaymentRequest>();
  const { data, loading, pagination, create, update, remove } = usePaymentRequestStore(
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
          <h2 className="text-xl font-bold text-blue-800 dark:text-blue-200">Ð? ngh? thanh toán</h2>
          <p className="text-xs text-secondary">Qu?n l? phi?u ð? ngh? thanh toán</p>
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
        <PaymentRequestTable
          dataSource={data}
          loading={loading}
          pagination={pagination}
          setPage={setPage}
          setSize={setSize}
          onEdit={(r: PaymentRequest) => {
            setRowData(r);
            setOpen(true);
          }}
          onDelete={(r: PaymentRequest) => remove?.(r.id)}
          onViewDetail={(r: PaymentRequest) => {
            setRowData(r);
            setOpenDetail(true);
          }}
        />
      </Panel>
      <AddUpdatePaymentRequestModal
        open={open}
        editData={rowData}
        loading={false}
        errors={null}
        onAdd={create}
        onEdit={update}
        onClose={() => setOpen(false)}
      />
      <PaymentRequestDetailModal
        open={openDetail}
        data={rowData}
        onClose={() => setOpenDetail(false)}
        onOpenUpdate={(r: PaymentRequest) => {
          setOpenDetail(false);
          setRowData(r);
          setOpen(true);
        }}
      />
    </div>
  );
};
export default PaymentRequestPage;
