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
import { SortOrder } from "../../../../constants/enum";
import { filterUses, rangerItems, searchItems, sortItems } from "./filterItem";
import DateRangeFilter from "../../../../components/button/DateRangeFilter";
import PurchaseReturnTable from "./components/PurchaseReturnTable";
import { IOrder } from "../../../../models/store/order";
import { usePurchaseReturnData } from "../../../../hooks/order/usePurchaseReturnData";
import { useClientData } from "../../../../hooks/core/useClientData";
import StoreSelect from "../../../../components/select/StoreSelect";

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
    sortOrder: SortOrder.DESC,
    filterUses,
  });
  const { currentStore } = useClientData();

  const {
    purchaseReturns,
    loading,
    pagination,
    summary,
    addPurchaseReturn,
    updatePurchaseReturn,
    deletePurchaseReturn,
  } = usePurchaseReturnData({
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

  const handleOpenDetailPage = (record: IOrder) => {
    navigate(buildUrlWithId(privateRoutesName.purchaseReturn.detail, record.id));
  };

  const handleOpenAddPage = addPurchaseReturn
    ? () => {
        navigate(privateRoutesName.purchaseReturn.add);
      }
    : undefined;

  const handleOpenUpdate = updatePurchaseReturn
    ? (record: IOrder) => {
        navigate(buildUrlWithId(privateRoutesName.purchaseReturn.detail, record.id));
      }
    : undefined;

  const handleDelete = deletePurchaseReturn
    ? (record: IOrder) => {
        modal.confirm({
          title: "Xóa đơn hàng",
          content: `Bạn có chắc chắn muốn xóa đơn hàng "${record.code}"?`,
          okText: "Xóa",
          cancelText: "Hủy",
          onOk: () => {
            deletePurchaseReturn(record.id);
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
              onClearFilter={pageAction.resetFilter}
            />
            <SearchInput value={keyword} onSearch={pageAction.handleSearch} maxWidth={240} />
          </div>
          <AddButton onOpenAdd={handleOpenAddPage} />
        </div>
      </div>
      <div className="flex flex-col w-full h-[calc(100%-40px)] bg-white px-6 py-2 rounded-lg">
        <PurchaseReturnTable
          dataSource={purchaseReturns}
          loading={loading}
          pagination={pagination}
          summaryData={summary}
          setPage={setPage}
          setSize={setSize}
          onEdit={handleOpenUpdate}
          onDelete={handleDelete}
          onRow={(record: any) => ({
            onClick: () => {
              if (record.isSummary || checkSelection()) return;
              handleOpenDetailPage(record);
            },
          })}
        />
      </div>
    </div>
  );
};

export default Page;
