import React from "react";
import { usePageState } from "@/shared/hooks/usePageState";
import { SearchInput } from "@/shared/components/input";
import { usePartnerStore } from "./partner.store";
import { Partner, PartnerType, partnerTypeOptions } from "./partner.model";
import AddButton from "@/shared/components/button/AddButton";
import { Panel } from "@/shared/components/display/Panel";
import { Tabs } from "antd";
import { PartnerAddUpdateModal, PartnerTable, PartnerDetailModal } from "./components";
import { ExcelButton, ExcelEntityType } from "@/modules/excel";
import { usePartnerHandlers } from "./partner.handlers";

export const typeItems = [
  {
    label: "Tất cả",
    key: "all",
    value: "all",
  },
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
  } = usePartnerStore(
    { page, size, keyword, sortBy, sortOrder, reload, type: type === "all" ? undefined : type },
    () => pageAction.handleClose(),
  );

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
          activeKey={type}
          onChange={pageAction.handleTypeChange}
          items={typeItems}
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
        defaultType={type === "all" ? undefined : (type as PartnerType)}
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
