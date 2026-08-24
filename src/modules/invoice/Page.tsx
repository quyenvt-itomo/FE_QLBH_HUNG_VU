import React, { useState } from "react";
import { Tabs } from "antd";
import { usePageState } from "@/shared/hooks/usePageState";
import { SearchInput } from "@/shared";
import { useInvoiceStore } from "./invoice.store";
import { Invoice, InvoiceType, invoiceTypeOptions } from "./invoice.model";
import { AddButton } from "@/shared";
import { Panel } from "@/shared";
import { InvoiceTable, AddUpdateInvoiceModal, InvoiceDetailModal } from "./components";

const InvoicePage: React.FC = () => {
  const { keyword, page, size, setPage, setSize, pageAction } = usePageState<Invoice>();
  // Page luôn gi? Type (v? có d?ng t?ng), bên trong modal m?i ch?n SourceType
  const [type, setType] = useState<InvoiceType>(InvoiceType.INPUT);
  const [open, setOpen] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [rowData, setRowData] = useState<Invoice>();
  const { data, loading, pagination, create, update, remove } = useInvoiceStore(
    { keyword, page, size, type },
    () => {
      setOpen(false);
      setOpenDetail(false);
    },
  );
  return (
    <div className="flex flex-col h-full w-full gap-1">
      <div className="flex justify-between items-start gap-3">
        <Tabs
          activeKey={type}
          onChange={(key) => setType(key as InvoiceType)}
          items={invoiceTypeOptions}
          className="custom-tabs"
        />
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
        <InvoiceTable
          dataSource={data}
          loading={loading}
          pagination={pagination}
          setPage={setPage}
          setSize={setSize}
          onEdit={(r: Invoice) => {
            setRowData(r);
            setOpen(true);
          }}
          onDelete={(r: Invoice) => remove?.(r.id)}
          onViewDetail={(r: Invoice) => {
            setRowData(r);
            setOpenDetail(true);
          }}
        />
      </Panel>
      <AddUpdateInvoiceModal
        open={open}
        editData={rowData}
        type={type}
        loading={false}
        errors={null}
        onAdd={create}
        onEdit={update}
        onClose={() => setOpen(false)}
      />
      <InvoiceDetailModal
        open={openDetail}
        data={rowData}
        onClose={() => setOpenDetail(false)}
        onOpenUpdate={(r: Invoice) => {
          setOpenDetail(false);
          setRowData(r);
          setOpen(true);
        }}
      />
    </div>
  );
};
export default InvoicePage;
