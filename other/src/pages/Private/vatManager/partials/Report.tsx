import { usePageState } from "../../../../hooks/core/usePageState";
import { useClientData } from "../../../../hooks/core/useClientData";
import { getLocationNotification } from "../../../../utils/common";
import { useNavigate } from "react-router-dom";
import ReportTable from "../components/report/ReportTable";
import { useVatData } from "../../../../hooks/vat/useVatData";
import { SearchInput } from "../../../../components/input";
import DateRangeFilter from "../../../../components/button/DateRangeFilter";
import StoreSelect from "../../../../components/select/StoreSelect";
import { IVatTransaction } from "../../../../models/store/vat";

export const Report: React.FC = () => {
  const notification = getLocationNotification();
  const navigate = useNavigate();
  const {
    storeId,
    keyword,
    page,
    size,
    startAt,
    endAt,
    filter,
    reload,
    setPage,
    setSize,

    pageAction,
  } = usePageState<IVatTransaction>();
  const { currentStore } = useClientData();

  const { vatTransactions, loading, pagination, summary } = useVatData({
    keyword,
    page,
    size,
    filter,
    reload,
    startAt,
    endAt,
    storeId,
  });

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
        <SearchInput value={keyword} onSearch={pageAction.handleSearch} />
      </div>
      <div className="flex flex-col h-[calc(100%-40px)] gap-4 bg-white px-6 py-2 rounded-lg border">
        <ReportTable
          dataSource={vatTransactions}
          loading={loading}
          pagination={pagination}
          summaryData={summary}
          setPage={setPage}
          setSize={setSize}
        />
      </div>
    </div>
  );
};
