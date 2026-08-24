import { usePageState } from "../../../hooks/core/usePageState";
import { useInventoryAdjustmentData } from "../../../hooks/inventory/useInventoryAdjustmentData";
import { useEffect, useState } from "react";
import {
  checkSelection,
  connectToInventoryStream,
  getLocationNotification,
} from "../../../utils/common";
import { useNavigate } from "react-router-dom";
import { App } from "antd";
import AddModal from "./components/AddModal";
import InventoryAdjustmentTable from "./components/InventoryAdjustmentTable";
import DateRangeFilter from "../../../components/button/DateRangeFilter";
import CustomFilter from "../../../components/filters";
import { SearchInput } from "../../../components/input";
import AddButton from "../../../components/button/AddButton";
import DetailModal from "./components/DetailModal";
import { IInventoryAdjustment } from "../../../models/store/inventoryAdjustment";
import CustomPageTitle from "../../../layout/Private/header/components/PageTitle";
import { ExcelEntityType, SortOrder } from "../../../constants/enum";
import { filterUses, rangerItems, sortItems } from "./filterItem";
import { ExcelButton } from "../../../components/button/ExcelButton";
import dayjs from "dayjs";
import { useClientData } from "../../../hooks/core/useClientData";
import StoreSelect from "../../../components/select/StoreSelect";
import { InventoryStreamData } from "../../../models/store/inventory";
import { exportInventoryAdjustmentToExcel } from "../../../utils/excelExport";

const Page: React.FC = () => {
  const notification = getLocationNotification();
  const navigate = useNavigate();
  const { modal } = App.useApp();
  const {
    isFilterActive,
    keyword,
    page,
    size,
    startAt,
    endAt,
    filter,
    ranger,
    reload,
    sortBy,
    sortOrder,
    storeId,
    setPage,
    setSize,

    open,
    setOpen,
    openDetail,
    setOpenDetail,
    rowData,
    setRowData,

    pageAction,
  } = usePageState<IInventoryAdjustment>({
    sortBy: "occurredAt",
    sortOrder: SortOrder.DESC,
    filterUses,
  });
  const { currentStore } = useClientData();
  const [streamData, setStreamData] = useState<InventoryStreamData | undefined>();

  const {
    inventoryAdjustments,
    errors,
    loading,
    pagination,
    summary,
    addInventoryAdjustment,
    updateInventoryAdjustment,
    deleteInventoryAdjustment,
  } = useInventoryAdjustmentData({
    keyword,
    page,
    size,
    filter,
    sortBy,
    sortOrder,
    ranger,
    reload,
    startAt,
    endAt,
    onCloseModal: (data) => {
      pageAction.handleClose(false);
    },
  });

  useEffect(() => {
    if (!rowData) return;

    const newRowData = inventoryAdjustments.find((item) => item.id === rowData?.id);

    setRowData(newRowData);
  }, [inventoryAdjustments, rowData]);

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

  const handleOpenDetailModal = (record: IInventoryAdjustment) => {
    setRowData(record);
    setOpenDetail(true);
  };

  const handleOpenAddModal = addInventoryAdjustment
    ? () => {
        setOpen(true);
      }
    : undefined;

  const handleOpenUpdateModal = updateInventoryAdjustment
    ? (record: IInventoryAdjustment) => {
        setOpenDetail(true);
        setRowData(record);
      }
    : undefined;

  const handleDelete = deleteInventoryAdjustment
    ? (record: IInventoryAdjustment) => {
        modal.confirm({
          title: "Xóa khách hàng",
          content: `Bạn có chắc chắn muốn xóa phiếu chuyển kho?`,
          okText: "Xóa",
          cancelText: "Hủy",
          onOk: () => {
            deleteInventoryAdjustment(record.id);
          },
        });
      }
    : undefined;

  return (
    <div className="flex flex-col h-full w-full gap-2">
      <div className="flex items-center gap-3 flex-shrink-0">
        <CustomPageTitle />
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
          filterLabels={{ employeeIds: "Người thực hiện" }}
          onClearFilter={pageAction.resetFilter}
        />
        <ExcelButton
          entityType={ExcelEntityType.INVENTORY_ADJUSTMENT}
          onSuccess={pageAction.handleReload}
          exportOptions={{
            filename: "Danh_sach_dieu_chinh_ton_kho",
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
        <AddButton onOpenAdd={handleOpenAddModal} />
      </div>
      <div className="flex flex-col h-[calc(100%-40px)] gap-4 bg-white px-6 py-2 rounded-lg shadow-md">
        <InventoryAdjustmentTable
          dataSource={inventoryAdjustments}
          loading={loading}
          pagination={pagination}
          summaryData={summary}
          setPage={setPage}
          setSize={setSize}
          onEdit={handleOpenUpdateModal}
          onDelete={handleDelete}
          onExportExcel={exportInventoryAdjustmentToExcel}
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
      </div>

      <AddModal
        open={open}
        errors={errors}
        loading={loading}
        onAdd={addInventoryAdjustment}
        onEdit={updateInventoryAdjustment}
        onClose={pageAction.handleClose}
      />

      <DetailModal
        data={rowData}
        open={openDetail}
        loading={loading}
        onUpdate={handleOpenUpdateModal ? updateInventoryAdjustment : undefined}
        onReload={pageAction.handleReload}
        onClose={pageAction.handleClose}
      />
    </div>
  );
};

export default Page;
