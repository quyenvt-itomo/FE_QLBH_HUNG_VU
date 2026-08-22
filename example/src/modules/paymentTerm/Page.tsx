import React from "react";
import { usePageState } from "@/shared/hooks/usePageState";
import { SearchInput } from "@/shared/components/input";
import { usePaymentTermStore } from "./paymentTerm.store";
import { PaymentTerm } from "./paymentTerm.model";
import AddButton from "@/shared/components/button/AddButton";
import { Panel } from "@/shared/components/display/Panel";
import { usePaymentTermHandlers } from "./paymentTerm.handlers";
import { PaymentTermTable, PaymentTermAddUpdateModal, PaymentTermDetailModal } from "./components";

export const PaymentTermPage: React.FC = () => {
  const {
    keyword,
    page,
    size,
    sortBy,
    sortOrder,
    setPage,
    setSize,
    open,
    setOpen,
    openDetail,
    setOpenDetail,
    rowData,
    setRowData,
    reload,
    pageAction,
  } = usePageState<PaymentTerm>();
  const { data, loading, creating, updating, errors, pagination, getById, create, update, remove } =
    usePaymentTermStore({ page, size, keyword, sortBy, sortOrder, reload }, () =>
      pageAction.handleClose(),
    );
  const {
    handleOpenAdd,
    handleOpenEdit,
    handleOpenDetail,
    handleDelete,
    handleCancel,
    handleEditFromDetail,
  } = usePaymentTermHandlers({
    getById,
    create,
    update,
    remove,
    setOpen,
    setOpenDetail,
    setRowData,
  });

  return (
    <div className="flex flex-col h-full w-full gap-1">
      <div className="flex justify-between items-start gap-3">
        <div className="flex flex-col">
          <h2 className="text-xl font-bold text-blue-800">Điều khoản thanh toán</h2>
          <p className="text-xs text-secondary">Quản lý điều khoản thanh toán</p>
        </div>
        <div className="flex items-center gap-3">
          <SearchInput value={keyword} onSearch={pageAction.handleSearch} maxWidth={340} />
          <AddButton onOpenAdd={handleOpenAdd} />
        </div>
      </div>
      <Panel>
        <PaymentTermTable
          dataSource={data}
          loading={loading}
          pagination={pagination}
          setPage={setPage}
          setSize={setSize}
          onEdit={handleOpenEdit}
          onViewDetail={handleOpenDetail}
          onDelete={handleDelete}
          onCancel={handleCancel}
        />
      </Panel>
      <PaymentTermAddUpdateModal
        open={open}
        editData={rowData}
        loading={creating || updating}
        errors={errors}
        onAdd={create}
        onEdit={update}
        onClose={() => pageAction.handleClose(false)}
      />
      <PaymentTermDetailModal
        open={openDetail}
        data={rowData}
        onClose={pageAction.handleClose}
        onOpenUpdate={handleEditFromDetail}
      />
    </div>
  );
};

export default PaymentTermPage;
