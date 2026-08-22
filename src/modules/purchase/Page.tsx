import React, { useEffect } from "react";
import { usePageState } from "@/shared/hooks/usePageState";
import { useLocation } from "react-router-dom";
import { SearchInput } from "@/shared/components/input";
import { usePurchaseStore } from "./purchase.store";
import { Purchase } from "./purchase.model";
import AddButton from "@/shared/components/button/AddButton";
import { Panel } from "@/shared/components/display/Panel";
import { PurchaseTable, AddUpdatePurchaseModal, PurchaseDetailModal } from "./components";
import { approvedStatusLiteItems } from "../shared/business.model";
import { Tabs } from "antd";
import DateRangeFilter from "@/shared/components/button/DateRangeFilter";
import CustomFilter from "@/shared/components/filters";
import { filterUses, rangerItems, sortItems } from "./filterItem";
import { usePurchaseHandlers } from "./purchase.handlers";
import { SortOrderEnum } from "@/shared/constants/enum";

const PurchasePage: React.FC = () => {
  const location = useLocation();
  const state = location.state as { defaultCreateData?: Partial<Purchase> } | null;

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
    defaultData,
    setDefaultData,
    pageAction,
  } = usePageState<Purchase>({
    sortBy: "orderedAt",
    sortOrder: SortOrderEnum.DESC,
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
    confirmComplete,
  } = usePurchaseStore(
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
    handleConfirmComplete,
    handleEditFromDetail,
    handleApprove,
    handleReject,
    handleExportExcel,
  } = usePurchaseHandlers({
    getById,
    create,
    update,
    remove,
    setOpen,
    setOpenDetail,
    setRowData,
    approve,
    reject,
    complete: confirmComplete,
  });

  // Auto-open add modal when navigated with defaultCreateData (e.g. from PurchaseQuotation)
  useEffect(() => {
    if (state?.defaultCreateData) {
      if (handleOpenAdd) {
        handleOpenAdd();
        setDefaultData(state.defaultCreateData);
      }
      window.history.replaceState({}, "");
    }
  }, []);

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
        <PurchaseTable
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
          onConfirmComplete={handleConfirmComplete}
          onExportExcel={handleExportExcel}
        />
      </Panel>
      <AddUpdatePurchaseModal
        open={open}
        editData={rowData}
        loading={creating || updating}
        defaultData={defaultData}
        errors={errors}
        onAdd={create}
        onEdit={update}
        onClose={() => pageAction.handleClose(false)}
      />
      <PurchaseDetailModal
        open={openDetail}
        data={rowData}
        onClose={pageAction.handleClose}
        onOpenUpdate={handleEditFromDetail}
        onExportExcel={handleExportExcel}
      />
    </div>
  );
};

export default PurchasePage;
