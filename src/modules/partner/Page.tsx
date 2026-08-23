import React from "react";
import { usePageState } from "@/shared/hooks/usePageState";
import { SearchInput } from "@/shared/components/input";
import { useCustomerStore, useShipperStore, useSupplierStore } from "./partner.store";
import { Partner, PartnerType, partnerTypeOptions } from "./partner.model";
import AddButton from "@/shared/components/button/AddButton";
import { Panel } from "@/shared/components/display/Panel";
import { Tabs } from "antd";
import { PartnerAddUpdateModal, PartnerTable, PartnerDetailModal } from "./components";
import { usePartnerHandlers } from "./partner.handlers";

export const typeItems = [
  ...partnerTypeOptions,
];

export const PartnerPage: React.FC = () => {
  const {
    keyword,
    page,
    size,
    sortBy,
    sortOrder,
    reload,
    type,
    setPage,
    setSize,
    open,
    setOpen,
    openDetail,
    setOpenDetail,
    rowData,
    setRowData,
    pageAction,
  } = usePageState<Partner>();
  const activeType = (type as PartnerType) || PartnerType.CUSTOMER;
  const customerStore = useCustomerStore({ page, size, keyword, sortBy, sortOrder, reload, type: PartnerType.CUSTOMER }, () => pageAction.handleClose());
  const supplierStore = useSupplierStore({ page, size, keyword, sortBy, sortOrder, reload, type: PartnerType.SUPPLIER }, () => pageAction.handleClose());
  const shipperStore = useShipperStore({ page, size, keyword, sortBy, sortOrder, reload, type: PartnerType.SHIPPER }, () => pageAction.handleClose());
  const activeStore = activeType === PartnerType.SUPPLIER ? supplierStore : activeType === PartnerType.SHIPPER ? shipperStore : customerStore;
  const { data, loading, creating, updating, pagination, getById, create, update, remove } = activeStore;

  const { handleOpenAdd, handleOpenEdit, handleOpenDetail, handleDelete } = usePartnerHandlers({
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
        <Tabs
          activeKey={activeType}
          onChange={pageAction.handleTypeChange}
          items={typeItems}
          className="custom-tabs"
        />
        <div className="flex items-center gap-3">
          <SearchInput value={keyword} onSearch={pageAction.handleSearch} maxWidth={340} />
          <AddButton onOpenAdd={handleOpenAdd} />
        </div>
      </div>
      <Panel>
        <PartnerTable
          dataSource={data}
          loading={loading}
          pagination={pagination}
          setPage={setPage}
          setSize={setSize}
          onEdit={handleOpenEdit}
          onViewDetail={handleOpenDetail}
          onDelete={handleDelete}
        />
      </Panel>

      <PartnerAddUpdateModal
        open={open}
        editData={rowData}
        loading={creating || updating}
        defaultType={activeType}
        onAdd={create}
        onEdit={update}
        onClose={() => pageAction.handleClose(false)}
      />
      <PartnerDetailModal
        open={openDetail}
        data={rowData}
        onClose={pageAction.handleClose}
        onOpenUpdate={
          update
            ? () => {
                setOpen(true);
              }
            : undefined
        }
      />
    </div>
  );
};
