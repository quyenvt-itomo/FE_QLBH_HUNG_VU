import { usePageState } from "@/shared/hooks/usePageState";
import { useNavigate } from "react-router-dom";
import { InventoryReport, InventoryTransactionRefTypeEnum } from "./inventory.model";
import { useInventoryReportStore } from "./inventory.store";
import { SearchInput } from "@/shared/components/input";
import DateRangeFilter from "@/shared/components/button/DateRangeFilter";
import { Panel } from "@/shared/components/display/Panel";
import { DetailInventoryReportModal, ReportTable } from "./components";
import { checkSelection } from "@/shared/utils/common.util";
import CustomFilter from "@/shared/components/filters";
import { filterUses, rangerItems, sortItems } from "./filterItem";
import { useState } from "react";
import { SortOrderEnum } from "@/shared/constants/enum";
import { Tabs } from "antd";
import { ProductType } from "../product";

export const InventoryPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    isFilterActive,
    keyword,
    page: pageReport,
    size: sizeReport,
    startAt,
    endAt,
    filter,
    reload,
    sortBy,
    sortOrder,
    ranger,
    setPage: setPageReport,
    setSize: setSizeReport,

    openDetail,
    setOpenDetail,
    rowData,
    setRowData,

    pageAction,
  } = usePageState<InventoryReport>({
    sortBy: "name",
    sortOrder: SortOrderEnum.DESC,
    filterUses,
    size: 20,
  });
  const [type, setType] = useState<string>("finished");
  const [refType, setRefType] = useState<InventoryTransactionRefTypeEnum | undefined>();

  // TODO For Detail
  const {
    page: pageDetail,
    size: sizeDetail,
    setPage: setPageDetail,
    setSize: setSizeDetail,
  } = usePageState<InventoryReport>();

  const {
    reports,
    loading,
    pagination,
    summary,
    transactions,
    transactionSummary,
    transactionPagination,
  } = useInventoryReportStore({
    keyword,
    page: rowData ? pageDetail : pageReport,
    size: rowData ? sizeDetail : sizeReport,
    reload,
    startAt,
    endAt,
    sortBy,
    sortOrder,
    isLockedReport: !!rowData,
    isLockedTransaction: !rowData,
    productId: rowData?.id,
    types:
      type === "finished"
        ? [ProductType.FINISHED]
        : [ProductType.MAIN_MATERIAL, ProductType.SUB_MATERIAL],
    refType,
    ...filter,
    ...ranger,
  });

  const handleOpenDetailModal = (record: InventoryReport) => {
    setRowData(record);
    setOpenDetail(true);
  };

  const handleTabChange = (key: string) => {
    setType(key);
    setPageReport(1);
    pageAction.handleSearch("");
  };

  return (
    <div className="flex flex-col h-full w-full gap-1">
      <div className="flex justify-between items-start gap-3">
        <Tabs
          activeKey={type}
          onChange={handleTabChange}
          items={[
            {
              key: "finished",
              label: "Thành phẩm",
            },
            {
              key: "material",
              label: "Nguyên vật liệu",
            },
          ]}
          className="custom-tabs"
        />
        <div className="flex items-center gap-3 flex-shrink-0">
          <SearchInput value={keyword} onSearch={pageAction.handleSearch} maxWidth={480} />
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
        <ReportTable
          dataSource={reports}
          loading={loading}
          pagination={pagination}
          summaryData={summary}
          setPage={setPageReport}
          setSize={setSizeReport}
          onRow={(record: any) => {
            return {
              onClick: () => {
                if (record.isSummary || checkSelection()) return;
                handleOpenDetailModal(record);
              },
              className: rowData?.id === record.id ? "selected-row" : "",
            };
          }}
        />
      </Panel>

      <DetailInventoryReportModal
        open={openDetail}
        product={rowData}
        summaryData={transactionSummary}
        dataSource={transactions}
        pagination={transactionPagination}
        setPage={setPageDetail}
        setSize={setSizeDetail}
        startAt={startAt}
        endAt={endAt}
        refType={refType}
        setRefType={setRefType}
        onDateRangerChange={pageAction.handleDateRangerChange}
        onClose={() => {
          pageAction.handleClose();
          setRefType(undefined);
          setPageDetail(1);
          setSizeDetail(50);
        }}
      />
    </div>
  );
};
