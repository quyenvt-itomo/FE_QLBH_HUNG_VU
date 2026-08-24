import { usePageState } from "../../../hooks/core/usePageState";
import { useEffect, useState } from "react";
import {
  checkSelection,
  connectToInventoryStream,
  getLocationNotification,
} from "../../../utils/common";
import { useNavigate } from "react-router-dom";
import ReportTable from "./components/ReportTable";
import { buildUrlWithId } from "../../../utils/paramUtils";
import { privateRoutesName } from "../../../constants/routerName";
import { useInventoryData } from "../../../hooks/inventory/useInventoryData";
import { SearchInput } from "../../../components/input";
import DateRangeFilter from "../../../components/button/DateRangeFilter";
import StoreSelect from "../../../components/select/StoreSelect";
import { IInventoryReport, InventoryStreamData } from "../../../models/store/inventory";
import { useClientData } from "../../../hooks/core/useClientData";
import CustomPageTitle from "../../../layout/Private/header/components/PageTitle";
import CustomFilter from "../../../components/filters";
import { filterUses, rangerItems, sortItems } from "./filterItem";
import { ExcelEntityType, SortOrder } from "../../../constants/enum";
import { ExcelButton } from "../../../components/button/ExcelButton";
import dayjs from "dayjs";
import { apiEndpoint, BASE_URL } from "../../../constants/ApiEndpoint";
import InventoryStreamInline from "./components/InventoryStreamStatus";

const Page: React.FC = () => {
  const notification = getLocationNotification();
  const navigate = useNavigate();
  const {
    isFilterActive,
    storeId,
    keyword,
    page,
    size,
    startAt,
    endAt,
    filter,
    reload,
    sortBy,
    sortOrder,
    ranger,
    setPage,
    setSize,

    rowData,
    setRowData,

    pageAction,
  } = usePageState<IInventoryReport>({
    sortBy: "closingQty",
    sortOrder: SortOrder.DESC,
    filterUses,
  });
  const { currentStore } = useClientData();
  const [streamData, setStreamData] = useState<InventoryStreamData | undefined>();

  const { inventoryReports, loading, pagination, summary } = useInventoryData({
    keyword,
    page,
    size,
    filter,
    reload,
    startAt,
    endAt,
    sortBy,
    sortOrder,
    ranger,
    storeId,
  });

  useEffect(() => {
    if (!rowData) return;

    const updatedRow = inventoryReports.find((item) => item.id === rowData.id);

    if (updatedRow) {
      setRowData(updatedRow);
    } else {
      setRowData(undefined);
    }
  }, [inventoryReports]);

  useEffect(() => {
    connectToInventoryStream(setStreamData);
  }, []);

  useEffect(() => {
    if (!streamData || streamData.pendingVariants !== 0 || streamData.processingVariants !== 0)
      return;

    const timer = setTimeout(() => {
      pageAction.handleReload();
    }, 1000);

    return () => clearTimeout(timer);
  }, [streamData]);

  return (
    <div className="flex flex-col h-full w-full gap-2">
      <div className="flex items-center gap-3 flex-shrink-0">
        <CustomPageTitle />
        <InventoryStreamInline data={streamData} />
        <SearchInput value={keyword} onSearch={pageAction.handleSearch} maxWidth={340} />
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
        <ExcelButton
          entityType={ExcelEntityType.INVENTORY_REPORT}
          onSuccess={pageAction.handleReload}
          exportOptions={{
            filename: "Bao_cao_ton_kho",
            filters: {
              ...filter,
              ...ranger,
              startAt: dayjs(startAt).startOf("day").toISOString(),
              endAt: dayjs(endAt).endOf("day").toISOString(),
              sortBy,
              sortOrder,
              storeId: currentStore?.id || storeId,
            },
          }}
        />
      </div>
      <div className="flex flex-col h-[calc(100%-40px)] gap-4 bg-white px-6 py-2 rounded-lg shadow-md">
        <ReportTable
          dataSource={inventoryReports}
          loading={loading}
          pagination={pagination}
          summaryData={summary}
          setPage={setPage}
          setSize={setSize}
          onRow={(record: any) => {
            return {
              onClick: () => {
                if (record.isSummary || checkSelection()) return;
                navigate(buildUrlWithId(privateRoutesName.inventory.detail, record.id));
              },
              className: rowData?.id === record.id ? "selected-row" : "",
            };
          }}
        />
      </div>
    </div>
  );
};

export default Page;
