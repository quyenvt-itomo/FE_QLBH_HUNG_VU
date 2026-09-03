import React from "react";
import { AddButton, Panel, SearchInput } from "@/shared/components";
import { ButtonFilter } from "@/shared/components/filters";
import { ExcelButton, ExcelEntityType } from "@/modules/excel";
import { getFilterUses, getSortItems, PartnerType } from "./partner.model";
import { useCustomerStore } from "./partner.store";
import { usePartnerBusinessPage } from "./partnerBusinessPage.hook";
import { CustomerAddUpdateModal, CustomerTable, PartnerDetailModal } from "./components";

const CustomerPage: React.FC = () => {
  const { pageState, store, handlers } = usePartnerBusinessPage(
    useCustomerStore,
    PartnerType.CUSTOMER,
  );
  const sortItems = getSortItems(PartnerType.CUSTOMER);
  const filterUses = getFilterUses(PartnerType.CUSTOMER);
  const {
    isFilterActive,
    keyword,
    sortBy,
    sortOrder,
    status,
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

  return (
    <div className="flex h-full w-full flex-col gap-3" aria-label="Khách hàng">
      <div className="flex items-center justify-between gap-3">
        <SearchInput value={keyword} onSearch={pageAction.handleSearch} />
        <div className="flex items-center gap-3">
          <ButtonFilter
            filterActive={isFilterActive || status !== "all"}
            sortItems={sortItems}
            sortValue={{ sortBy, sortOrder }}
            onSortChange={pageAction.handleSortChange}
            filterUses={filterUses}
            onClearFilter={() => {
              pageAction.resetFilter();
              pageAction.handleStatusChange("all");
            }}
            enumFilters={[
              {
                label: "Phân loại",
                items: [
                  { label: "Cá nhân", key: "individual" },
                  { label: "Tổ chức", key: "organization" },
                ],
                value: status === "all" ? undefined : status,
                onChange: (value?: string) => pageAction.handleStatusChange(value || "all"),
              },
            ]}
          />
          <ExcelButton
            entityType={ExcelEntityType.CUSTOMER}
            onSuccess={pageAction.handleReload}
            exportOptions={{
              filters: { type: PartnerType.CUSTOMER },
              filename: "danh_sach_khach_hang_",
            }}
          />
          <AddButton onOpenAdd={handlers.handleOpenAdd} />
        </div>
      </div>
      <Panel className="h-[calc(100%-44px)] !p-1">
        <CustomerTable
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
      <CustomerAddUpdateModal
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

export default CustomerPage;
