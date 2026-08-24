import { usePageState } from "@/shared/hooks/usePageState";
import { useNavigate } from "react-router-dom";
import {
  PartnerDebtReport,
  PartnerDebtRefTypeEnum,
  PartnerCurrentDebt,
  PartnerDebtInvoice,
} from "./partnerDebtReport.model";
import { usePartnerDebtReportStore } from "./partnerDebtReport.store";
import { useCurrentDebtReportStore } from "./currentDebtReport.store";
import { SearchInput } from "@/shared/components";
import { DateRangeFilter } from "@/shared/components";
import { Panel } from "@/shared/components";
import {
  DetailPartnerDebtReportModal,
  ReportTable,
  CurrentDebtTable,
  CurrentDebtDetailModal,
} from "./components";
import { checkSelection } from "@/shared/utils/common.util";
import { PanelFilter } from "@/shared/components";
import { filterUses, rangerItems, sortItems } from "./filterItem";
import {
  sortItems as currentDebtSortItems,
  filterUses as currentDebtFilterUses,
} from "./currentDebtFilterItem";
import { useState } from "react";
import { DebtSideEnum, debtSideOptions, SortOrder } from "@/shared/constants/enum";
import { Radio } from "antd";
import { InvoiceType, invoiceTypeMap } from "../invoice";

export const PartnerDebtReportPage: React.FC = () => {
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
  } = usePageState<PartnerDebtReport>({
    sortBy: "name",
    sortOrder: SortOrder.DESC,
    filterUses,
    size: 20,
  });
  const [side, setSide] = useState<DebtSideEnum>(DebtSideEnum.RECEIVABLE);
  const [refType, setRefType] = useState<PartnerDebtRefTypeEnum | undefined>();

  // TODO For Detail
  const {
    page: pageDetail,
    size: sizeDetail,
    setPage: setPageDetail,
    setSize: setSizeDetail,
  } = usePageState<PartnerDebtReport>();

  const {
    reports,
    loading,
    pagination,
    summary,
    transactions,
    transactionSummary,
    transactionPagination,
  } = usePartnerDebtReportStore({
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
    partnerId: rowData?.id,
    refType,
    side,
    ...filter,
    ...ranger,
  });

  const handleOpenDetailModal = (record: PartnerDebtReport) => {
    setRowData(record);
    setOpenDetail(true);
  };

  const handleSideChange = (key: string) => {
    setSide(key as DebtSideEnum);
    setPageReport(1);
    pageAction.handleSearch("");
  };

  return (
    <div className="flex flex-col h-full w-full gap-1">
      <div className="flex justify-between items-start gap-3">
        <Radio.Group
          value={side}
          onChange={(e) => handleSideChange(e.target.value)}
          options={debtSideOptions}
          optionType="button"
          buttonStyle="solid"
        />
        <div className="flex items-center gap-3 flex-shrink-0">
          <SearchInput value={keyword} onSearch={pageAction.handleSearch} maxWidth={480} />
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

      <DetailPartnerDebtReportModal
        side={side}
        open={openDetail}
        partner={rowData}
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

interface CurrentDebtReportPageProps {
  invoiceType: InvoiceType;
}
export const CurrentDebtReportPage: React.FC<CurrentDebtReportPageProps> = ({ invoiceType }) => {
  const {
    isFilterActive,
    keyword,
    page: pagePartner,
    size: sizePartner,
    sortBy,
    sortOrder,
    reload,
    filter,
    setPage: setPagePartner,
    setSize: setSizePartner,
    openDetail,
    setOpenDetail,
    rowData,
    setRowData,
    pageAction,
  } = usePageState<PartnerCurrentDebt>({
    sortBy: "totalDebt",
    sortOrder: SortOrder.DESC,
    filterUses: currentDebtFilterUses,
    size: 20,
  });

  // TODO For Detail (invoices)
  const {
    page: pageInvoice,
    size: sizeInvoice,
    setPage: setPageInvoice,
    setSize: setSizeInvoice,
  } = usePageState<PartnerDebtInvoice>();

  const { partners, loading, pagination, summary, invoices, invoicePagination } =
    useCurrentDebtReportStore({
      invoiceType,
      keyword,
      page: rowData ? pageInvoice : pagePartner,
      size: rowData ? sizeInvoice : sizePartner,
      reload,
      sortBy,
      sortOrder,
      isLockedReport: !!rowData,
      isLockedTransaction: !rowData,
      partnerId: rowData?.id,
      ...filter,
    });

  const handleOpenDetailModal = (record: PartnerCurrentDebt) => {
    setRowData(record);
    setOpenDetail(true);
  };

  return (
    <div className="flex flex-col h-full w-full gap-1">
      <div className="flex justify-between items-center gap-3">
        <div className="text-base font-semibold">{invoiceTypeMap[invoiceType]}</div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <SearchInput value={keyword} onSearch={pageAction.handleSearch} maxWidth={480} />
          <PanelFilter
            filterActive={isFilterActive}
            sortItems={currentDebtSortItems}
            sortValue={{ sortBy, sortOrder }}
            onSortChange={pageAction.handleSortChange}
            filterUses={currentDebtFilterUses}
            onClearFilter={pageAction.resetFilter}
          />
        </div>
      </div>
      <Panel>
        <CurrentDebtTable
          dataSource={partners}
          loading={loading}
          pagination={pagination}
          summaryData={summary}
          setPage={setPagePartner}
          setSize={setSizePartner}
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

      <CurrentDebtDetailModal
        invoiceType={invoiceType}
        open={openDetail}
        partner={rowData}
        dataSource={invoices}
        pagination={invoicePagination}
        setPage={setPageInvoice}
        setSize={setSizeInvoice}
        onClose={() => {
          pageAction.handleClose();
          setPageInvoice(1);
          setSizeInvoice(50);
        }}
      />
    </div>
  );
};
