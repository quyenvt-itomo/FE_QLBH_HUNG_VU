import React from "react";
import { AddButton } from "@/shared/components";
import { SearchInput } from "@/shared/components";
import { getFilterUses, getSortItems, PartnerType } from "./partner.model";
import { PartnerBusinessPageModel } from "./partnerBusinessPage.hook";
import { PartnerAddUpdateModal, PartnerDetailModal, PartnerList, PartnerTable } from "./components";
import { ButtonFilter } from "@/shared/components/filters";
import { ExcelButton, ExcelEntityType } from "@/modules/excel";

interface PartnerBusinessPageViewProps extends PartnerBusinessPageModel {
  type: PartnerType;
  title?: string;
  itemName?: string;
}

export const PartnerBusinessPageView: React.FC<PartnerBusinessPageViewProps> = ({
  pageState,
  store,
  handlers,
  type,
  title,
  itemName,
}) => {
  const sortItems = getSortItems(type);
  const filterUses = getFilterUses(type);
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
    <div className="flex h-full w-full flex-col gap-1" aria-label={title || itemName}>
      <div className="flex items-center justify-between gap-3">
        <SearchInput value={keyword} onSearch={pageAction.handleSearch} />{" "}
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
                  { label: "Tổ chức", key: "organizatil" },
                ],
                value: status === "all" ? undefined : status,
                onChange: (value?: string) => pageAction.handleStatusChange(value || "all"),
              },
            ]}
          />
          <ExcelButton
            entityType={ExcelEntityType.PARTNER}
            onSuccess={() => pageAction.handleReload()}
            exportOptions={{
              filters: { type },
              filename: type === "customer" ? "Danh_sach_khach_hang_" : type === "supplier" ? "Danh_sach_nha_cung_cap_" : "Danh_sach_doi_tac_",
            }}
          />
          <AddButton onOpenAdd={handlers.handleOpenAdd} />
        </div>
      </div>

      <div className="min-h-0 flex-1">
        {type === PartnerType.SHIPPER ? (
          <PartnerList
            dataSource={data}
            type={type}
            loading={loading}
            onAdd={handlers.handleOpenAdd}
            onEdit={handlers.handleOpenEdit}
            onDelete={handlers.handleDelete}
            onViewDetail={handlers.handleOpenDetail}
          />
        ) : (
          <PartnerTable
            dataSource={data}
            loading={loading}
            pagination={pagination}
            setPage={setPage}
            setSize={setSize}
            partnerType={type}
            onEdit={handlers.handleOpenEdit}
            onViewDetail={handlers.handleOpenDetail}
            onDelete={handlers.handleDelete}
          />
        )}
      </div>

      <PartnerAddUpdateModal
        open={open}
        editData={rowData}
        loading={creating || updating}
        type={type}
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
