import React from "react";
import { usePageState } from "@/shared/hooks/usePageState";
import { SearchInput } from "@/shared/components/input";
import { usePurchaseRequisitionStore } from "./purchaseRequisition.store";
import { PurchaseRequisition } from "./purchaseRequisition.model";
import AddButton from "@/shared/components/button/AddButton";
import { Panel } from "@/shared/components/display/Panel";
import {
  PurchaseRequisitionTable,
  PurchaseRequisitionAddUpdateModal,
  PurchaseRequisitionDetailModal,
} from "./components";
import { approvedStatusLiteItems } from "../shared/business.model";
import { Tabs } from "antd";
import DateRangeFilter from "@/shared/components/button/DateRangeFilter";
import CustomFilter from "@/shared/components/filters";
import { filterUses, rangerItems, sortItems } from "./filterItem";
import { usePurchaseRequisitionHandlers } from "./purchaseRequisition.handlers";
import { SortOrder } from "@/shared/constants/enum";

export const PurchaseRequisitionPage: React.FC = () => {
  const {
    isFilterActive,
    keyword,
    page,
    size,
    startAt,
    endAt,
    sortBy,
    sortOrder,
    status,
    filter,
    ranger,
    reload,
    setPage,
    setSize,
    open,
    setOpen,
    openDetail,
    setOpenDetail,
    rowData,
    setRowData,
    pageAction,
  } = usePageState<PurchaseRequisition>({
    sortBy: "timeAt",
    sortOrder: SortOrder.DESC,
    filterUses,
  });

  const {
    data,
    loading,
    creating,
    updating,
    pagination,
    errors,
    getById,
    create,
    update,
    remove,
    approve,
    reject,
  } = usePurchaseRequisitionStore(
    {
      keyword,
      page,
      size,
      startAt,
      endAt,
      sortBy,
      sortOrder,
      reload,
      approveStatus: status === "all" ? undefined : status,
      ...filter,
      ...ranger,
    },
    () => pageAction.handleClose(),
  );

  const {
    handleOpenAdd,
    handleOpenEdit,
    handleOpenDetail,
    handleDelete,
    handleEditFromDetail,
    handleApprove,
    handleReject,
  } = usePurchaseRequisitionHandlers({
    getById,
    create,
    update,
    remove,
    setOpen,
    setOpenDetail,
    setRowData,

    approve,
    reject,
  });

  return (
    <div className="flex flex-col h-full w-full gap-1">
      <div className="flex justify-between items-start gap-3">
        <Tabs
          activeKey={status}
          onChange={pageAction.handleStatusChange}
          items={approvedStatusLiteItems}
          className="custom-tabs"
        />
        <div className="flex items-center gap-3 flex-shrink-0">
          <SearchInput value={keyword} onSearch={pageAction.handleSearch} maxWidth={340} />
          <DateRangeFilter
            startDate={startAt}
            endDate={endAt}
            onRangeChange={pageAction.handleDateRangerChange}
          />
          <CustomFilter
            filterActive={isFilterActive}
            sortItems={sortItems}
            sortValue={{ sortBy, sortOrder }}
            onSortChange={pageAction.handleSortChange}
            rangerItems={rangerItems}
            rangerValue={ranger}
            onRangerChange={pageAction.handleRangerChange}
            filterUses={filterUses}
            onClearFilter={pageAction.resetFilter}
          />
          <AddButton title="Thêm mới" onOpenAdd={handleOpenAdd} />
        </div>
      </div>
      <Panel>
        <PurchaseRequisitionTable
          dataSource={data}
          loading={loading}
          pagination={pagination}
          setPage={setPage}
          setSize={setSize}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          onViewDetail={handleOpenDetail}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      </Panel>
      <PurchaseRequisitionAddUpdateModal
        open={open}
        editData={rowData}
        loading={creating || updating}
        errors={errors}
        onAdd={create}
        onEdit={update}
        onClose={() => pageAction.handleClose(false)}
      />
      <PurchaseRequisitionDetailModal
        open={openDetail}
        data={rowData}
        onClose={pageAction.handleClose}
        onOpenUpdate={handleEditFromDetail}
      />
    </div>
  );
};
