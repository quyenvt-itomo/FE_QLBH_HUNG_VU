import { usePageState } from "../../../../hooks/core/usePageState";
import AddButton from "../../../../components/button/AddButton";
import { SearchInput } from "../../../../components/input/SearchInput";
import { checkSelection, getLocationNotification } from "../../../../utils/common";
import CustomFilter from "../../../../components/filters";
import { useNavigate } from "react-router-dom";
import { App, Tabs } from "antd";
import CustomPageTitle from "../../../../layout/Private/header/components/PageTitle";
import { privateRoutesName } from "../../../../constants/routerName";
import { buildUrlWithId } from "../../../../utils/paramUtils";
import { ExcelEntityType, OrderStatusEnum, SortOrder } from "../../../../constants/enum";
import { filterUses, rangerItems, searchItems, sortItems } from "./filterItem";
import DateRangeFilter from "../../../../components/button/DateRangeFilter";
import { IOrder } from "../../../../models/store/order";
import SaleTable from "./components/SaleTable";
import { useSaleData } from "../../../../hooks/order/useSaleData";
import { useClientData } from "../../../../hooks/core/useClientData";
import StoreSelect from "../../../../components/select/StoreSelect";
import { useSaleOrderCache } from "../../../../hooks/cache/useSaleOrderCache";
import { ExcelButton } from "../../../../components/button/ExcelButton";
import { useEffect } from "react";
import dayjs from "dayjs";

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

  const { sales, sale, loading, pagination, summary, getSale, addSale, updateSale, deleteSale } =
    useSaleData({
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

  const { createNewCache } = useSaleOrderCache();

  useEffect(() => {
    if (!sale) return;

    createNewCache(sale);
    navigate(privateRoutesName.sale.add);
  }, [sale]);

  const handleOpenDetailPage = (record: IOrder) => {
    navigate(buildUrlWithId(privateRoutesName.sale.detail, record.id));
  };

  const handleOpenAddPage = addSale
    ? () => {
        createNewCache();
        navigate(privateRoutesName.sale.add);
      }
    : undefined;

  const handleCopy = addSale
    ? async (record: IOrder) => {
        getSale?.(record.id);
      }
    : undefined;

  const handleOpenUpdate = updateSale
    ? (record: IOrder) => {
        navigate(buildUrlWithId(privateRoutesName.sale.detail, record.id));
      }
    : undefined;

  const handleCancel = updateSale
    ? (record: IOrder) => {
        if (record.status === OrderStatusEnum.CANCELLED) return;
        modal.confirm({
          title: "Hủy đơn hàng",
          content: `Bạn có chắc chắn muốn hủy đơn hàng "${record.code}"?`,
          okText: "Xác nhận",
          cancelText: "Hủy",
          onOk: () => {
            updateSale({
              id: record.id,
              status: OrderStatusEnum.CANCELLED,
            });
          },
        });
      }
    : undefined;

  const handleRestore = updateSale
    ? (record: IOrder) => {
        if (record.status === OrderStatusEnum.POSTED) return;
        modal.confirm({
          title: "Khôi phục đơn hàng",
          content: `Bạn có chắc chắn muốn khôi đơn hàng "${record.code}"?`,
          okText: "Xác nhận",
          cancelText: "Hủy",
          onOk: () => {
            updateSale({
              id: record.id,
              status: OrderStatusEnum.POSTED,
            });
          },
        });
      }
    : undefined;

  const handleDelete = deleteSale
    ? (record: IOrder) => {
        modal.confirm({
          title: "Xóa đơn hàng",
          content: `Bạn có chắc chắn muốn xóa đơn hàng "${record.code}"?`,
          okText: "Xóa",
          cancelText: "Hủy",
          onOk: () => {
            deleteSale(record.id);
          },
        });
      }
    : undefined;

  return (
    <div
      ref={containerRef}
      className="flex flex-col h-full overflow-x-hidden overflow-y-auto w-full gap-0.5"
    >
      <div className="flex items-start gap-3 flex-shrink-0">
        <Tabs
          activeKey={status}
          onChange={pageAction.handleStatusChange}
          items={[
            { key: "all", label: "Danh sách đơn hàng" },
            { key: "cancelled", label: "Đơn đã hủy" },
          ]}
          className="flex-1"
        />
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="flex items-center gap-3">
            <SearchInput value={keyword} onSearch={pageAction.handleSearch} maxWidth={240} />
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
          </div>
          <ExcelButton
            entityType={ExcelEntityType.SALE_ORDER}
            onSuccess={pageAction.handleReload}
            exportOptions={{
              filename: "Danh_sach_don_hang",
              filters: {
                ...filter,
                startAt: dayjs(startAt).startOf("day").toISOString(),
                endAt: dayjs(endAt).endOf("day").toISOString(),
                sortBy,
                sortOrder,
                ranger,
                storeId: currentStore?.id || storeId,
              },
            }}
          />
          <AddButton onOpenAdd={handleOpenAddPage} />
        </div>
      </div>
      <div className="flex flex-col w-full h-[calc(100%-40px)] bg-white px-6 py-2 rounded-lg border">
        <SaleTable
          dataSource={sales}
          loading={loading}
          pagination={pagination}
          summaryData={summary}
          setPage={setPage}
          setSize={setSize}
          onEdit={handleOpenUpdate}
          onCancel={handleCancel}
          onCopy={handleCopy}
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
