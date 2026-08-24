import React from "react";
import { AddButton } from "@/shared";
import { SearchInput } from "@/shared";
import { PartnerType } from "./partner.model";
import { PartnerBusinessPageModel } from "./partnerBusinessPage.hook";
import { PartnerAddUpdateModal, PartnerDetailModal, PartnerList, PartnerTable } from "./components";

interface PartnerBusinessPageViewProps extends PartnerBusinessPageModel {
  type: PartnerType;
  title: string;
  itemName: string;
}

export const PartnerBusinessPageView: React.FC<PartnerBusinessPageViewProps> = ({
  pageState,
  store,
  handlers,
  type,
  title,
  itemName,
}) => {
  const {
    keyword,
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
    <div className="flex h-full w-full flex-col gap-1">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-lg leading-4 font-semibold">{title}</h1>
          <p className="text-sm text-gray-500">Quản lý {itemName}</p>
        </div>
        <div className="flex items-center gap-3">
          <SearchInput value={keyword} onSearch={pageAction.handleSearch} maxWidth={340} />
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
            itemName={itemName}
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
