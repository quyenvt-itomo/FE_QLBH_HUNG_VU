import { usePageState } from "../../../../hooks/core/usePageState";
import { useEffect } from "react";
import { checkSelection, getLocationNotification } from "../../../../utils/common";
import { useNavigate } from "react-router-dom";
import ReportTable from "../components/report/ReportTable";
import { useFundBalanceData } from "../../../../hooks/fund/useFundBalanceData";
import { SearchInput } from "../../../../components/input";
import DateRangeFilter from "../../../../components/button/DateRangeFilter";
import { IFundBalanceReport } from "../../../../models/fundBalance";
import DetailModal from "../components/report/DetailModal";
import Title from "../../../../components/display/Title";
import { useClientData } from "../../../../hooks/core/useClientData";
import StoreSelect from "../../../../components/select/StoreSelect";

export const Report: React.FC = () => {
  const notification = getLocationNotification();
  const navigate = useNavigate();
  const {
    keyword,
    page,
    size,
    startAt,
    endAt,
    filter,
    reload,
    storeId,
    setPage,
    setSize,

    open,
    setOpen,
    rowData,
    setRowData,

    pageAction,
  } = usePageState<IFundBalanceReport>();

  const { fundBalanceReports, fundBalanceTransactions, loading, pagination, summary } =
    useFundBalanceData({
      keyword,
      page,
      size,
      filter,
      reload,
      startAt,
      endAt,
      storeId,
      fundId: rowData?.id,
    });
  const { currentStore } = useClientData();

  useEffect(() => {
    if (!open || !rowData) return;
    const exists = fundBalanceReports.find((fund) => fund.id === rowData.id);
    if (!exists) {
      setOpen(false);
      setRowData(undefined);
    } else {
      setRowData(exists);
    }
  }, [fundBalanceReports]);

  return (
    <div className="flex flex-col h-full w-full gap-2">
      <div className="flex items-center gap-3 flex-shrink-0">
        {!currentStore && (
          <div className="w-80 flex">
            <StoreSelect
              value={storeId}
              onChange={pageAction.handleStoreChange}
              placeholder="Lọc theo cửa hàng"
            />
          </div>
        )}
        <DateRangeFilter
          startDate={startAt}
          endDate={endAt}
          onRangeChange={pageAction.handleDateRangerChange}
        />
        <SearchInput maxWidth={428} value={keyword} onSearch={pageAction.handleSearch} />
      </div>
      <div className="flex flex-col h-[calc(100%-40px)] gap-4 bg-white px-6 py-2 rounded-lg border">
        <ReportTable
          dataSource={fundBalanceReports}
          loading={loading}
          pagination={pagination}
          summaryData={summary}
          setPage={setPage}
          setSize={setSize}
          onRow={(record: any) => {
            return {
              onClick: () => {
                if (record.isSummary || checkSelection()) return;
                setRowData(record);
                setOpen(true);
              },
              className: rowData?.id === record.id ? "selected-row" : "",
            };
          }}
          onViewDetails={(record) => {
            if (record.isSummary) return;
            setRowData(record);
            setOpen(true);
          }}
        />
      </div>

      <DetailModal
        fund={rowData}
        data={fundBalanceTransactions}
        open={open}
        startAt={startAt}
        endAt={endAt}
        onDateRangerChange={pageAction.handleDateRangerChange}
        onClose={pageAction.handleClose}
      />
    </div>
  );
};
