import React from "react";
import { BaseStoreReturn } from "@/shared/base/createBaseStore";
import AddButton from "@/shared/components/button/AddButton";
import { SearchInput } from "@/shared/components/input";
import { usePageState } from "@/shared/hooks/usePageState";
import { Partner, PartnerQuery, PartnerType } from "./partner.model";
import { usePartnerHandlers } from "./partner.handlers";
import { PartnerAddUpdateModal, PartnerDetailModal, PartnerTable } from "./components";

type PartnerStoreHook = (
  params?: PartnerQuery,
  onSuccess?: () => void,
) => BaseStoreReturn<Partner>;

export interface PartnerBusinessPageModel {
  pageState: ReturnType<typeof usePageState<Partner>>;
  store: BaseStoreReturn<Partner>;
  handlers: ReturnType<typeof usePartnerHandlers>;
}

export const usePartnerBusinessPage = (
  storeHook: PartnerStoreHook,
  type: PartnerType,
): PartnerBusinessPageModel => {
  const pageState = usePageState<Partner>();
  const { page, size, keyword, sortBy, sortOrder, reload, pageAction } = pageState;
  const store = storeHook(
    { page, size, keyword, sortBy, sortOrder, reload, type },
    pageAction.handleClose,
  );
  const handlers = usePartnerHandlers({
    getById: store.getById,
    create: store.create,
    update: store.update,
    remove: store.remove,
    setOpen: pageState.setOpen,
    setOpenDetail: pageState.setOpenDetail,
    setRowData: pageState.setRowData,
  });

  return { pageState, store, handlers };
};

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
          <h1 className="text-xl font-semibold">{title}</h1>
          <p className="text-sm text-gray-500">Quản lý {itemName}</p>
        </div>
        <div className="flex items-center gap-3">
          <SearchInput value={keyword} onSearch={pageAction.handleSearch} maxWidth={340} />
          <AddButton onOpenAdd={handlers.handleOpenAdd} />
        </div>
      </div>

      <div className="min-h-0 flex-1">
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
      </div>

      <PartnerAddUpdateModal
        open={open}
        editData={rowData}
        loading={creating || updating}
        defaultType={type}
        fixedType={type}
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
