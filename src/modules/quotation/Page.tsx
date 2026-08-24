import React, { useEffect, useState } from "react";
import { usePageState } from "@/shared/hooks/usePageState";
import { SearchInput } from "@/shared";
import { useQuotationStore } from "./quotation.store";
import { Quotation } from "./quotation.model";
import { ApproveStatus, approvedStatusOptions } from "../shared/business.model";
import { AddButton } from "@/shared";
import { Panel } from "@/shared";
import { CustomFilter } from "@/shared";
import { filterUses, rangerItems, sortItems } from "./filterItem";
import { SortOrder } from "@/shared/constants/enum";
import { DateRangeFilter } from "@/shared";
import { Tabs } from "antd";
import { QuotationTable, AddUpdateQuotationModal, QuotationDetailModal } from "./components";
import { useLocation } from "react-router-dom";
import { useQuotationHandlers } from "./quotation.handlers";

export const QuotationPage: React.FC = () => {
  const location = useLocation();
  const state = location.state as { defaultCreateData?: Partial<Quotation> } | null;
  const {
    isFilterActive,
    keyword,
    page,
    size,
    startAt,
    endAt,
    sortBy,
    sortOrder,
    filter,
    ranger,
    reload,
    status,
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
  } = usePageState<Quotation>({
    sortBy: "effectiveDate",
    sortOrder: SortOrder.DESC,
    filterUses,
  });

  const {
    data,
    loading,
    pagination,
    creating,
    updating,
    errors,
    getById,
    create,
    update,
    remove,
    approve,
    reject,
    customerApprove,
    customerReject,
  } = useQuotationStore(
    {
      keyword,
      page,
      size,
      startAt,
      endAt,
      reload,
      sortBy,
      sortOrder,
      status: status === "all" ? undefined : status,
      ...filter,
      ...ranger,
    },
    () => {
      pageAction.handleClose();
    },
  );

  const {
    handleOpenAdd,
    handleOpenEdit,
    handleOpenDetail,
    handleDelete,
    handleEditFromDetail,
    handleApprove,
    handleReject,
    handleCustomerApprove,
    handleCustomerReject,
  } = useQuotationHandlers({
    getById,
    create,
    update,
    remove,
    setOpen,
    setOpenDetail,
    setRowData,
    approve,
    reject,
    customerApprove,
    customerReject,
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
        <div className="flex-1 min-w-0">
          <Tabs
            className="custom-tabs"
            activeKey={status}
            onChange={pageAction.handleStatusChange}
            items={[
              { label: "T?t c?", key: "all" },
              ...approvedStatusOptions.map((o: any) => ({ ...o, key: o.value })),
            ]}
          />
        </div>
        <div className="flex flex-col xl:flex-row xl:items-center gap-3 flex-shrink-0">
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
          <AddButton title="T?o b�o gi�" onOpenAdd={handleOpenAdd} />
        </div>
      </div>
      <Panel>
        <QuotationTable
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
          onCustomerApprove={handleCustomerApprove}
          onCustomerReject={handleCustomerReject}
          // onExportExcel={handleExportExcel}
        />
      </Panel>
      <AddUpdateQuotationModal
        open={open}
        editData={rowData}
        loading={creating || updating}
        defaultData={defaultData}
        errors={errors}
        onAdd={create}
        onEdit={update}
        onClose={() => pageAction.handleClose(false)}
      />
      <QuotationDetailModal
        open={openDetail}
        data={rowData}
        onClose={() => setOpenDetail(false)}
        onOpenUpdate={(r: Quotation) => {
          setOpenDetail(false);
          setRowData(r);
          setOpen(true);
        }}
      />
    </div>
  );
};
