import React from "react";
import { AddButton, Panel, SearchInput } from "@/shared/components";
import { PanelFilter } from "@/shared/components/filters";
import { ExcelButton, ExcelEntityType } from "@/modules/excel";
import {
  getFilterUses,
  getRangerItems,
  getSortItems,
  partnerClassificationOptions,
  PartnerType,
} from "./partner.model";
import { useSupplierStore } from "./partner.store";
import { usePartnerBusinessPage } from "./partnerBusinessPage.hook";
import { PartnerDetailModal, SupplierAddUpdateModal, SupplierTable } from "./components";

const SupplierPage: React.FC = () => {
  const { pageState, store, handlers, partnerFilter } = usePartnerBusinessPage(
    useSupplierStore,
    PartnerType.SUPPLIER,
  );
  const sortItems = getSortItems(PartnerType.SUPPLIER);
  const filterUses = getFilterUses(PartnerType.SUPPLIER);
  const {
    isFilterActive,
    keyword,
    sortBy,
    sortOrder,
    setPage,
    setSize,
    open,
    setOpen,
    openDetail,
    setOpenDetail,
    rowData,
    pageAction,
  } = pageState;
  const { data, loading, creating, updating, pagination, getById, create, update } = store;
  const rangerItems = getRangerItems(PartnerType.SUPPLIER);
  const filterActive = isFilterActive || partnerFilter.isActive;
  const organizationKey =
    partnerFilter.organization === undefined
      ? []
      : [partnerFilter.organization ? "organization" : "individual"];

  return (
    <div className="flex h-full w-full gap-3" aria-label="Nhà cung cấp">
      <PanelFilter
        filterActive={filterActive}
        sortItems={sortItems}
        sortValue={{ sortBy, sortOrder }}
        onSortChange={pageAction.handleSortChange}
        filterUses={filterUses}
        onClearFilter={partnerFilter.reset}
        rangerValue={pageState.ranger}
        rangerItems={rangerItems}
        onRangerChange={pageAction.handleRangerChange}
        enumFilters={[
          {
            label: "Phân loại",
            items: partnerClassificationOptions,
            value: organizationKey,
            multiple: false,
            onChange: (values) => {
              const value = values[0];
              partnerFilter.setOrganization(
                value === "organization" ? true : value === "individual" ? false : undefined,
              );
            },
          },
        ]}
      />
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <SearchInput value={keyword} onSearch={pageAction.handleSearch} />
          <div className="flex items-center gap-3">
            <ExcelButton
              entityType={ExcelEntityType.SUPPLIER}
              onSuccess={pageAction.handleReload}
              exportOptions={{
                filters: { type: PartnerType.SUPPLIER },
                filename: "danh_sach_nha_cung_cap_",
              }}
            />
            <AddButton onOpenAdd={handlers.handleOpenAdd} />
          </div>
        </div>
        <Panel className="min-h-0 flex-1 !p-1">
          <SupplierTable
            dataSource={data}
            loading={loading}
            pagination={pagination}
            setPage={setPage}
            setSize={setSize}
            onEdit={handlers.handleOpenEdit}
            onViewDetail={handlers.handleOpenDetail}
            onDelete={handlers.handleDelete}
          />
        </Panel>
      </div>
      <SupplierAddUpdateModal
        open={open}
        editData={rowData}
        loading={creating || updating}
        errors={store.errors}
        onAdd={create}
        onEdit={update}
        onClose={() => pageAction.handleClose(false)}
      />
      <PartnerDetailModal
        open={openDetail}
        data={rowData}
        onClose={pageAction.handleClose}
        onOpenUpdate={
          update && getById
            ? () => {
                setOpen(true);
                setOpenDetail(false);
              }
            : undefined
        }
      />
    </div>
  );
};

export default SupplierPage;
