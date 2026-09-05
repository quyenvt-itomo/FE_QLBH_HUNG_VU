import React, { useState } from "react";
import { AddButton, Panel, SearchInput } from "@/shared/components";
import { PanelFilter } from "@/shared/components/filters";
import { usePageState } from "@/shared/hooks/usePageState";
import { useGlobalData } from "@/shared/hooks/useGlobalData";
import { SortOrder } from "@/shared/constants/enum";
import { SaleReturn, OrderStatus, saleReturnStatusItems } from "./model";
import { useSaleReturnStore } from "./store";
import { filterUses, rangerItems, sortItems } from "./filterItem";
import { useSaleReturnHandlers } from "./handlers";
import { SaleReturnTable, SaleReturnDetailModal } from "./components";

const SaleReturnPage: React.FC = () => {
  const { currentStore } = useGlobalData();
  const [statusValues, setStatusValues] = useState<OrderStatus[]>([OrderStatus.DRAFT, OrderStatus.COMPLETED]);
  const state = usePageState<SaleReturn>({ sortBy: "orderAt", sortOrder: SortOrder.DESC, filterUses });
  const store = useSaleReturnStore({
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
  const handlers = useSaleReturnHandlers({
    create: store.create,
    update: store.update,
    remove: store.remove,
    getById: store.getById,
    cancel: store.cancel,
    setOpenDetail: state.setOpenDetail,
    setRowData: state.setRowData,
  });

  return (
    <div className="flex h-full w-full gap-3" aria-label="Phiếu trả hàng">
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
          items: saleReturnStatusItems,
          value: statusValues,
          onChange: (values) => { setStatusValues(values as OrderStatus[]); state.setPage(1); },
        }]}
      />
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <SearchInput value={state.keyword} onSearch={state.pageAction.handleSearch} placeholder="Theo mã phiếu hoặc tên khách hàng" />
          <AddButton
            title="Thêm phiếu trả hàng"
            onOpenAdd={handlers.handleOpenAdd}
            disabled={Boolean(handlers.handleOpenAdd) && !currentStore}
            tooltip={!currentStore && handlers.handleOpenAdd ? "Hãy chuyển sang chi nhánh để thêm phiếu trả hàng" : undefined}
          />
        </div>
        <Panel className="min-w-0 flex-1">
          <SaleReturnTable
            dataSource={store.data}
            loading={store.loading}
            pagination={store.pagination}
            setPage={state.setPage}
            setSize={state.setSize}
            isReturn
            onViewDetail={handlers.handleOpenDetail}
            onEdit={handlers.handleOpenEdit}
            onDelete={handlers.handleDelete}
            onCancel={handlers.handleCancel}
          />
        </Panel>
      </div>
      <SaleReturnDetailModal
        open={state.openDetail}
        data={state.rowData}
        isReturn
        onClose={() => state.pageAction.handleClose()}
        onOpenUpdate={handlers.handleEditFromDetail}
        onDelete={handlers.handleDelete}
        onCancel={handlers.handleCancel}
      />
    </div>
  );
};

export default SaleReturnPage;
