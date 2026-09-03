import React from "react";
import { AddButton, SearchInput } from "@/shared/components";
import { ButtonFilter } from "@/shared/components/filters";
import { getFilterUses, getSortItems, PartnerType } from "./partner.model";
import { useShipperStore } from "./partner.store";
import { usePartnerBusinessPage } from "./partnerBusinessPage.hook";
import { PartnerDetailModal, ShipperAddUpdateModal, ShipperList } from "./components";

const ShipperPage: React.FC = () => {
  const { pageState, store, handlers } = usePartnerBusinessPage(useShipperStore, PartnerType.SHIPPER);
  const sortItems = getSortItems(PartnerType.SHIPPER);
  const filterUses = getFilterUses(PartnerType.SHIPPER);
  const { isFilterActive, keyword, sortBy, sortOrder, status, open, setOpen, openDetail, setOpenDetail, rowData, pageAction } = pageState;
  const { data, loading, creating, updating, getById, create, update } = store;

  return (
    <div className="flex h-full w-full flex-col gap-3" aria-label="Đơn vị vận chuyển">
      <div className="flex items-center justify-between gap-3">
        <SearchInput value={keyword} onSearch={pageAction.handleSearch} />
        <div className="flex items-center gap-3">
          <ButtonFilter
            filterActive={isFilterActive || status !== "all"}
            sortItems={sortItems}
            sortValue={{ sortBy, sortOrder }}
            onSortChange={pageAction.handleSortChange}
            filterUses={filterUses}
            onClearFilter={() => { pageAction.resetFilter(); pageAction.handleStatusChange("all"); }}
            enumFilters={[{ label: "Phân loại", items: [{ label: "Cá nhân", key: "individual" }, { label: "Tổ chức", key: "organization" }], value: status === "all" ? undefined : status, onChange: (value?: string) => pageAction.handleStatusChange(value || "all") }]}
          />
          <AddButton onOpenAdd={handlers.handleOpenAdd} />
        </div>
      </div>
      <div className="min-h-0 flex-1"><ShipperList dataSource={data} loading={loading} onAdd={handlers.handleOpenAdd} onEdit={handlers.handleOpenEdit} onViewDetail={handlers.handleOpenDetail} onDelete={handlers.handleDelete} /></div>
      <ShipperAddUpdateModal open={open} editData={rowData} loading={creating || updating} errors={store.errors} onAdd={create} onEdit={update} onClose={() => pageAction.handleClose(false)} />
      <PartnerDetailModal open={openDetail} data={rowData} onClose={pageAction.handleClose} onOpenUpdate={update && getById ? () => { setOpen(true); setOpenDetail(false); } : undefined} />
    </div>
  );
};

export default ShipperPage;
