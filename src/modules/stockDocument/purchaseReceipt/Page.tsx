import { Radio } from "antd";
import React, { useState } from "react";
import { usePageState } from "@/shared/hooks/usePageState";
import { SortOrder } from "@/shared/constants/enum";
import { SearchInput } from "@/shared";
import { DateRangeFilter } from "@/shared";
import { PanelFilter } from "@/shared";
import { AddButton } from "@/shared";

import { filterUses, rangerItems, sortItems, statusItems } from "./filterItem";
import { useStockDocumentStore } from "../stockDocument.store";
import { StockDocument, StockDocumentType } from "../stockDocument.model";
import { Table, AddUpdateModal, DetailModal, ConfirmImportModal } from "./components";
import { useStockDocumentHandlers } from "../stockDocument.handlers";

export const PurchaseReceiptPage: React.FC = () => {
  const type = StockDocumentType.PURCHASE_RECEIPT;
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
  } = usePageState<StockDocument>({
    sortBy: "effectiveDate",
    sortOrder: SortOrder.DESC,
    filterUses,
  });
  const [openConfirmImport, setOpenConfirmImport] = useState(false);

  const {
    data,
    loading,
    pagination,
    errors,
    creating,
    updating,
    getById,
    create,
    update,
    remove,
    confirmImport,
  } = useStockDocumentStore(
    {
      keyword,
      page,
      size,
      startAt,
      endAt,
      sortBy,
      sortOrder,
      reload,
      status: status === "all" ? undefined : status,
      type,
      ...filter,
      ...ranger,
    },
    () => {
      pageAction.handleClose();
      setOpenConfirmImport(false);
    },
  );

  const {
    handleOpenAdd,
    handleOpenEdit,
    handleOpenDetail,
    handleDelete,
    handleOpenConfirmImport,
    handleEditFromDetail,
  } = useStockDocumentHandlers({
    getById,
    update,
    remove,
    setOpen,
    setOpenDetail,
    setRowData,
    setOpenConfirmImport,
    confirmImport,
  });

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-start gap-3 p-2">
        <Radio.Group
          optionType="button"
          buttonStyle="solid"
          value={status}
          onChange={(e) => pageAction.handleStatusChange(e.target.value)}
          options={statusItems}
        />
        <div className="flex items-center gap-3 flex-shrink-0">
          <SearchInput value={keyword} onSearch={pageAction.handleSearch} maxWidth={240} />
          <DateRangeFilter
            startDate={startAt}
            endDate={endAt}
            onRangeChange={pageAction.handleDateRangerChange}
          />
          <PanelFilter
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
      <div className="flex flex-col h-[calc(100%-56px)]">
        <Table
          dataSource={data}
          loading={loading}
          pagination={pagination}
          setPage={setPage}
          setSize={setSize}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          onViewDetail={handleOpenDetail}
          onImport={handleOpenConfirmImport}
        />
      </div>
      <AddUpdateModal
        open={open}
        editData={rowData}
        loading={creating || updating}
        errors={errors}
        onAdd={create}
        onEdit={update}
        onClose={pageAction.handleClose}
      />
      <DetailModal
        open={openDetail}
        data={rowData}
        onClose={pageAction.handleClose}
        onOpenUpdate={handleEditFromDetail}
      />
      <ConfirmImportModal
        open={openConfirmImport}
        data={rowData}
        loading={false}
        onClose={() => {
          setOpenConfirmImport(false);
          setRowData(undefined);
        }}
        onConfirm={confirmImport}
      />
    </div>
  );
};
