import { usePageState } from "../../../../hooks/core/usePageState";
import AddButton from "../../../../components/button/AddButton";
import { SearchInput } from "../../../../components/input/SearchInput";
import { checkSelection, getLocationNotification } from "../../../../utils/common";
import CustomFilter from "../../../../components/filters";
import { useNavigate } from "react-router-dom";
import { App } from "antd";
import CustomPageTitle from "../../../../layout/Private/header/components/PageTitle";
import { privateRoutesName } from "../../../../constants/routerName";
import { buildUrlWithId } from "../../../../utils/paramUtils";
import { SortOrderEnum } from "../../../../constants/enum";
import { filterUses, rangerItems, searchItems, sortItems } from "./filterItem";
import DateRangeFilter from "../../../../components/button/DateRangeFilter";
import PurchaseTable from "./components/PurchaseTable";
import { IOrder } from "../../../../models/store/order";
import { usePurchaseData } from "../../../../hooks/order/usePurchaseData";
import { useClientData } from "../../../../hooks/core/useClientData";
import StoreSelect from "../../../../components/select/StoreSelect";
import { usePrintHtml, PurchaseOrderPrint } from "../../../../components/print";
import { exportPurchaseOrderToExcel } from "../../../../utils/excelExport";

const Page: React.FC = () => {
  const notification = getLocationNotification();
  const navigate = useNavigate();
  const { modal } = App.useApp();
  const {
    startAt,
    endAt,
    isFilterActive,
    keyword,
    page,
    size,
    status,
    sortBy,
    sortOrder,
    filter,
    ranger,
    search,
    reload,
    storeId,
    setPage,
    setSize,

    containerRef,
    pageAction,
  } = usePageState<IOrder>({
    sortBy: "orderAt",
    sortOrder: SortOrderEnum.DESC,
    filterUses,
  });
  const { currentStore } = useClientData();

  const { purchases, loading, pagination, summary, addPurchase, updatePurchase, deletePurchase } =
    usePurchaseData({
      startAt,
      endAt,
      keyword,
      page,
      size,
      status: status === "all" ? undefined : status,
      sortBy,
      sortOrder,
      filter,
      ranger,
      search,
      reload,
      storeId,
      onCloseModal: () => {},
    });

  const { contentRef, printData, handlePrint } = usePrintHtml<IOrder>();

  const handleExportPdf = (record: IOrder) => {
    handlePrint(record);
  };

  const handleExportExcel = async (data: IOrder) => {
    await exportPurchaseOrderToExcel(data);
  };

  const handleOpenDetailPage = (record: IOrder) => {
    navigate(buildUrlWithId(privateRoutesName.purchase.detail, record.id));
  };

  const handleOpenAddPage = addPurchase
    ? () => {
        navigate(privateRoutesName.purchase.add);
      }
    : undefined;

  const handleOpenUpdate = updatePurchase
    ? (record: IOrder) => {
        navigate(buildUrlWithId(privateRoutesName.purchase.detail, record.id));
      }
    : undefined;

  const handleDelete = deletePurchase
    ? (record: IOrder) => {
        modal.confirm({
          title: "Xóa đơn hàng",
          content: `Bạn có chắc chắn muốn xóa đơn hàng "${record.code}"?`,
          okText: "Xóa",
          cancelText: "Hủy",
          onOk: () => {
            deletePurchase(record.id);
          },
        });
      }
    : undefined;

  return (
    <div ref={containerRef} className="flex flex-col h-full w-full gap-2">
      <div className="flex items-center gap-3 flex-shrink-0">
        <CustomPageTitle />
        <div className="flex items-center justify-between gap-3 flex-1 flex-shrink-0">
          <div className="flex items-center gap-3">
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
              // searchItems={searchItems}
              // searchValue={search}
              // onSearchChange={pageAction.handleSearchChange}
              onClearFilter={pageAction.resetFilter}
            />
            <SearchInput value={keyword} onSearch={pageAction.handleSearch} maxWidth={240} />
          </div>
          <AddButton onOpenAdd={handleOpenAddPage} />
        </div>
      </div>
      <div className="flex flex-col w-full h-[calc(100%-40px)] bg-white px-6 py-2 rounded-lg">
        <PurchaseTable
          dataSource={purchases}
          loading={loading}
          pagination={pagination}
          summaryData={summary}
          setPage={setPage}
          setSize={setSize}
          onEdit={handleOpenUpdate}
          onDelete={handleDelete}
          onPrint={handleExportPdf}
          onExportExcel={handleExportExcel}
          onRow={(record: any) => ({
            onClick: () => {
              if (record.isSummary || checkSelection()) return;
              handleOpenDetailPage(record);
            },
          })}
        />
      </div>
      <div style={{ display: "none" }}>
        <div ref={contentRef}>{printData && <PurchaseOrderPrint data={printData} />}</div>
      </div>
    </div>
  );
};

export default Page;
