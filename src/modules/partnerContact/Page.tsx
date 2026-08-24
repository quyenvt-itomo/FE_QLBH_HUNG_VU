import React from "react";
import { usePageState } from "@/shared/hooks/usePageState";
import { SearchInput } from "@/shared";
import { usePartnerContactStore } from "./partnerContact.store";
import { AddButton } from "@/shared";
import { Panel } from "@/shared";
import { usePartnerContactHandlers } from "./partnerContact.handlers";
import { Tabs } from "antd";
import {
  // PartnerContactAddUpdateModal,
  // PartnerContactDetailModal,
  PartnerContactTable,
} from "./components";
import { ExcelButton, ExcelEntityType } from "@/modules/excel";
import { partnerTypeOptions } from "../partner/partner.model";
import { PartnerContact } from "./partnerContact.model";

const statusItems = [
  {
    label: "T?t c?",
    key: "all",
    value: "all",
  },
  ...partnerTypeOptions,
];

export const PartnerContactPage: React.FC = () => {
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
  } = usePageState<PartnerContact>();
  const {
    data,
    loading,
    creating,
    updating,
    pagination,
    summary,
    getById,
    create,
    update,
    remove,
  } = usePartnerContactStore(
    { page, size, keyword, sortBy, sortOrder, reload, type: type === "all" ? undefined : type },
    () => pageAction.handleClose(),
  );

  const { handleOpenAdd, handleOpenEdit, handleOpenDetail, handleDelete } =
    usePartnerContactHandlers({
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
          activeKey={type}
          onChange={pageAction.handleTypeChange}
          items={statusItems}
          className="custom-tabs"
        />
        <div className="flex items-center gap-3">
          <SearchInput value={keyword} onSearch={pageAction.handleSearch} maxWidth={340} />
          <ExcelButton
            entityType={ExcelEntityType.PARTNER}
            onSuccess={() => pageAction.handleReload()}
            exportOptions={{
              filters: { type: type === "all" ? undefined : type },
              filename: "Danh_sach_doi_tac_",
            }}
          />
          <AddButton onOpenAdd={handleOpenAdd} />
        </div>
      </div>
      <Panel>
        <PartnerContactTable
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

      {/* <PartnerContactAddUpdateModal
        open={open}
        editData={rowData}
        loading={creating || updating}
        defaultType={type === "all" ? undefined : (type as PartnerContactType)}
        onAdd={create}
        onEdit={update}
        onClose={() => pageAction.handleClose(false)}
      />
      <PartnerContactDetailModal
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
      /> */}
    </div>
  );
};
