import React from "react";
import { Button, Tabs, Tooltip } from "antd";
import { usePageState } from "@/shared/hooks/usePageState";
import { QuotationRequest } from "./quotationRequest.model";
import { useQuotationRequestStore } from "./quotationRequest.store";
import { useQuotationRequestHandlers } from "./quotationRequest.handlers";
import { Panel } from "@/shared/components/display/Panel";
import { SearchInput } from "@/shared/components/input";
import DateRangeFilter from "@/shared/components/button/DateRangeFilter";
import CustomFilter from "@/shared/components/filters";
import { QuotationRequestTable } from "./components/QuotationRequestTable";
import { QuotationRequestDetailModal } from "./components/QuotationRequestDetailModal";
import { sortItems, filterUses, rangerItems } from "./filterItem";
import { approvedStatusLiteItems } from "../shared/business.model";
import { LinkIcon } from "@heroicons/react/24/outline";
import { SortOrder } from "@/shared/constants/enum";

const QuotationRequestPage: React.FC = () => {
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
  } = usePageState<QuotationRequest>({
    sortBy: "timeAt",
    sortOrder: SortOrder.DESC,
    filterUses,
  });

  const { data, loading, pagination, getById, approve, reject } = useQuotationRequestStore({
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
  });

  const { handleOpenDetail, handleApprove, handleReject, handleCopyLink, handleCreateQuotation } =
    useQuotationRequestHandlers({
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
          <Tooltip title="Link đề nghị báo giá">
            <Button onClick={handleCopyLink}>
              <LinkIcon className="w-5 h-5" />
            </Button>
          </Tooltip>
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
        </div>
      </div>
      <Panel>
        <QuotationRequestTable
          dataSource={data}
          loading={loading}
          pagination={pagination}
          setPage={setPage}
          setSize={setSize}
          onViewDetail={handleOpenDetail}
          onApprove={handleApprove}
          onReject={handleReject}
          onCreateQuotation={handleCreateQuotation}
        />
      </Panel>

      <QuotationRequestDetailModal
        open={openDetail}
        data={rowData}
        onClose={pageAction.handleClose}
      />
    </div>
  );
};

export default QuotationRequestPage;
