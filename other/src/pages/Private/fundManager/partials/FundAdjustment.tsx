import { usePageState } from "../../../../hooks/core/usePageState";
import { useEffect } from "react";
import { checkSelection, getLocationNotification } from "../../../../utils/common";
import { App } from "antd";
import DateRangeFilter from "../../../../components/button/DateRangeFilter";
import CustomFilter from "../../../../components/filters";
import { SearchInput } from "../../../../components/input";
import AddButton from "../../../../components/button/AddButton";
import AddUpdateModal from "../components/fundAdjustment/AddUpdateModal";
import { IFundAdjustment } from "../../../../models/fundAdjustment";
import { useFundAdjustmentData } from "../../../../hooks/fund/useFundAdjustmentData";
import FundAdjustmentTable from "../components/fundAdjustment/FundAdjustmentTable";
import Title from "../../../../components/display/Title";
import { filterUses, rangerItems, sortItems } from "../components/fundAdjustment/filterItem";
import { SortOrder } from "../../../../constants/enum";
import { useClientData } from "../../../../hooks/core/useClientData";
import StoreSelect from "../../../../components/select/StoreSelect";

export const FundAdjustment: React.FC = () => {
  const notification = getLocationNotification();
  const { modal } = App.useApp();
  const {
    isFilterActive,
    keyword,
    page,
    size,
    startAt,
    endAt,
    sortBy,
    sortOrder,
    filter,
    ranger,
    reload,
    storeId,
    setPage,
    setSize,

    open,
    setOpen,
    rowData,
    setRowData,

    pageAction,
  } = usePageState<IFundAdjustment>({
    sortBy: "occurredAt",
    sortOrder: SortOrder.DESC,
    filterUses,
  });

  const {
    fundAdjustments,
    errors,
    loading,
    pagination,
    addFundAdjustment,
    updateFundAdjustment,
    deleteFundAdjustment,
  } = useFundAdjustmentData({
    keyword,
    page,
    size,
    filter,
    ranger,
    reload,
    startAt,
    endAt,
    sortBy,
    sortOrder,
    storeId,
    onCloseModal: () => {
      pageAction.handleClose();
    },
  });
  const { currentStore } = useClientData();

  useEffect(() => {
    if (!rowData) return;

    const newRowData = fundAdjustments.find((item) => item.id === rowData?.id);

    setRowData(newRowData);
  }, [fundAdjustments, rowData]);

  const handleOpenDetailModal = (record: IFundAdjustment) => {
    setRowData(record);
    setOpen(true);
  };

  const handleOpenAddModal = addFundAdjustment
    ? () => {
        setOpen(true);
        setRowData(undefined);
      }
    : undefined;

  const handleOpenUpdateModal = updateFundAdjustment
    ? (record: IFundAdjustment) => {
        setOpen(true);
        setRowData(record);
      }
    : undefined;

  const handleDelete = deleteFundAdjustment
    ? (record: IFundAdjustment) => {
        modal.confirm({
          title: "Xóa khách hàng",
          content: `Bạn có chắc chắn muốn xóa phiếu chuyển kho?`,
          okText: "Xóa",
          cancelText: "Hủy",
          onOk: () => {
            deleteFundAdjustment(record.id);
          },
        });
      }
    : undefined;

  return (
    <div className="flex flex-col h-full w-full gap-2">
      <div className="flex items-center gap-3 flex-shrink-0">
        <Title content="Phiếu kiểm quỹ" className="ml-0 mr-auto" level={3} />
        <SearchInput value={keyword} onSearch={pageAction.handleSearch} maxWidth={230} />
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
          onSearchChange={pageAction.handleSearchChange}
          onClearFilter={pageAction.resetFilter}
        />
        <AddButton onOpenAdd={handleOpenAddModal} />
      </div>
      <div className="flex flex-col h-[calc(100%-40px)] gap-4 bg-white px-6 py-2 rounded-lg border">
        <FundAdjustmentTable
          dataSource={fundAdjustments}
          loading={loading}
          pagination={pagination}
          setPage={setPage}
          setSize={setSize}
          onEdit={handleOpenUpdateModal}
          onDelete={handleDelete}
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

      <AddUpdateModal
        open={open}
        editData={rowData}
        errors={errors}
        loading={loading}
        onAdd={addFundAdjustment}
        onEdit={updateFundAdjustment}
        onClose={pageAction.handleClose}
      />
    </div>
  );
};
