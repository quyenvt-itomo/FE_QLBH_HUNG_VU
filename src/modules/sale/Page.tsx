import React, { useState } from "react";
import { AddButton, Panel, SearchInput } from "@/shared/components";
import { PanelFilter } from "@/shared/components/filters";
import { usePageState } from "@/shared/hooks/usePageState";
import { useGlobalData } from "@/shared/hooks/useGlobalData";
import { SortOrder } from "@/shared/constants/enum";
import { Sale, OrderStatus, saleStatusItems } from "./model";
import { useSaleStore } from "./store";
import { filterUses, rangerItems, sortItems } from "./filterItem";
import { useSaleHandlers } from "./handlers";
import { SaleTable } from "./components/SaleTable";
import { SaleDetailModal } from "./components/SaleDetailModal";

const SalePage: React.FC = () => {
  const { currentStore } = useGlobalData();
  const [statusValues, setStatusValues] = useState<OrderStatus[]>([OrderStatus.DRAFT, OrderStatus.COMPLETED]);
  const state = usePageState<Sale>({ sortBy: "orderAt", sortOrder: SortOrder.DESC, filterUses });
  const store = useSaleStore({
    keyword: state.keyword,
    page: state.page,
    size: state.size,
    sortBy: state.sortBy,
    sortOrder: state.sortOrder,
    reload: state.reload,
    statuses: statusValues,
    ...state.filter,
    ...state.ranger,
  });
  const handlers = useSaleHandlers({
    create: store.create,
    update: store.update,
    remove: store.remove,
    getById: store.getById,
    cancel: store.cancel,
    setOpen: state.setOpen,
    setOpenDetail: state.setOpenDetail,
    setRowData: state.setRowData,
  });

  return (
    <div className="flex h-full w-full gap-3" aria-label="Đơn bán hàng">
      <PanelFilter
        filterActive={state.isFilterActive || statusValues.length !== 2 || !statusValues.includes(OrderStatus.DRAFT) || !statusValues.includes(OrderStatus.COMPLETED)}
        sortItems={sortItems}
        sortValue={{ sortBy: state.sortBy, sortOrder: state.sortOrder }}
        onSortChange={state.pageAction.handleSortChange}
        rangerItems={rangerItems}
        rangerValue={state.ranger}
        onRangerChange={state.pageAction.handleRangerChange}
        filterUses={filterUses}
        onClearFilter={() => {
          state.pageAction.resetFilter();
          setStatusValues([OrderStatus.DRAFT, OrderStatus.COMPLETED]);
        }}
        enumFilters={[{
          label: "Trạng thái",
          items: saleStatusItems,
          value: statusValues,
          onChange: (values) => { setStatusValues(values as OrderStatus[]); state.setPage(1); },
        }]}
      />
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <SearchInput value={state.keyword} onSearch={state.pageAction.handleSearch} placeholder="Theo mã đơn hoặc tên khách hàng" />
          <AddButton
            title="Thêm đơn bán"
            onOpenAdd={handlers.handleOpenAdd}
            disabled={Boolean(handlers.handleOpenAdd) && !currentStore}
            tooltip={!currentStore && handlers.handleOpenAdd ? "Hãy chuyển sang chi nhánh để thêm đơn bán" : undefined}
          />
        </div>
        <Panel className="min-w-0 flex-1">
          <SaleTable
            dataSource={store.data}
            loading={store.loading}
            pagination={store.pagination}
            setPage={state.setPage}
            setSize={state.setSize}
            onViewDetail={handlers.handleOpenDetail}
            onEdit={handlers.handleOpenEdit}
            onDelete={handlers.handleDelete}
            onCancel={handlers.handleCancel}
          />
        </Panel>
      </div>
      <SaleDetailModal
        open={state.openDetail}
        data={state.rowData}
        onClose={() => state.pageAction.handleClose()}
        onOpenUpdate={handlers.handleEditFromDetail}
        onDelete={handlers.handleDelete}
        onCancel={handlers.handleCancel}
      />
    </div>
  );
};

export default SalePage;
