import React, { useState } from "react";
import { usePageState } from "@/shared/hooks/usePageState";
import { SearchInput } from "@/shared";
import { usePurchaseQuotationStore } from "./purchaseQuotation.store";
import {
  PurchaseQuotation,
  PurchaseQuotationType,
  purchaseQuotationTypeOptions,
} from "./purchaseQuotation.model";
import { Panel } from "@/shared";
import { PurchaseQuotationTable, PurchaseQuotationDetailModal } from "./components";
import { Button, Radio, Tabs, Tooltip } from "antd";
import { approvedStatusLiteItems } from "../shared/business.model";
import { DateRangeFilter } from "@/shared";
import { PanelFilter } from "@/shared";
import { filterUses, rangerItems, sortItems } from "./filterItem";
import { usePurchaseQuotationHandlers } from "./purchaseQuotation.handlers";
import { LinkIcon } from "@heroicons/react/24/outline";
import { SortOrder } from "@/shared/constants/enum";

export const PurchaseQuotationPage: React.FC = () => {
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
    openDetail,
    setOpenDetail,
    rowData,
    setRowData,
    pageAction,
  } = usePageState<PurchaseQuotation>({
    sortBy: "timeAt",
    sortOrder: SortOrder.DESC,
    filterUses,
  });
  const [type, setType] = useState<PurchaseQuotationType>(PurchaseQuotationType.QUOTATION);

  const { data, loading, pagination, getById, approve, reject } = usePurchaseQuotationStore({
    keyword,
    page,
    size,
    startAt,
    endAt,
    sortBy,
    sortOrder,
    reload,
    type,
    approveStatus: status === "all" ? undefined : status,
    ...filter,
    ...ranger,
  });

  const { handleOpenDetail, handleApprove, handleReject, handleCopyLink, handleCreatePurchase } =
    usePurchaseQuotationHandlers({
      getById,
      setRowData,
      setOpenDetail,
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
          <Tooltip title="Link b�o gi�">
            <Button onClick={handleCopyLink}>
              <LinkIcon className="w-5 h-5" />
            </Button>
          </Tooltip>
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
          <Radio.Group
            className="flex flex-shrink-0"
            optionType="button"
            buttonStyle="solid"
            value={type}
            onChange={(e) => {
              setType(e.target.value);
              setPage(1);
            }}
            options={purchaseQuotationTypeOptions}
          />
        </div>
      </div>
      <Panel>
        <PurchaseQuotationTable
          dataSource={data}
          loading={loading}
          pagination={pagination}
          setPage={setPage}
          setSize={setSize}
          onViewDetail={handleOpenDetail}
          onApprove={handleApprove}
          onReject={handleReject}
          onCreatePurchase={handleCreatePurchase}
        />
      </Panel>

      <PurchaseQuotationDetailModal
        open={openDetail}
        data={rowData}
        onClose={pageAction.handleClose}
      />
    </div>
  );
};
