import { usePageState } from "../../../../hooks/core/usePageState";
import { useEffect } from "react";
import { checkSelection, getLocationNotification } from "../../../../utils/common";
import { useNavigate } from "react-router-dom";
import { App } from "antd";
import DebtOffsetTable from "../components/debtOffset/DebtOffsetTable";
import DateRangeFilter from "../../../../components/button/DateRangeFilter";
import CustomFilter from "../../../../components/filters";
import { SearchInput } from "../../../../components/input";
import AddButton from "../../../../components/button/AddButton";
import { IDebtOffset } from "../../../../models/store/debtOffset";
import { useDebtOffsetData } from "../../../../hooks/debt/useDebtOffsetData";
import AddUpdateModal from "../components/debtOffset/AddUpdateModal";
import { useClientData } from "../../../../hooks/core/useClientData";
import StoreSelect from "../../../../components/select/StoreSelect";

export const DebtOffset: React.FC = () => {
  const notification = getLocationNotification();
  const navigate = useNavigate();
  const { modal } = App.useApp();
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
  } = usePageState<IDebtOffset>();
  const { currentStore } = useClientData();

  const {
    debtOffsets,
    errors,
    loading,
    pagination,
    addDebtOffset,
    updateDebtOffset,
    deleteDebtOffset,
  } = useDebtOffsetData({
    keyword,
    page,
    size,
    filter,
    reload,
    startAt,
    endAt,
    onCloseModal: () => {
      pageAction.handleClose();
    },
  });

  useEffect(() => {
    if (!rowData) return;

    const newRowData = debtOffsets.find((item) => item.id === rowData?.id);

    setRowData(newRowData);
  }, [debtOffsets, rowData]);

  const handleOpenDetailModal = (record: IDebtOffset) => {
    setRowData(record);
    setOpen(true);
  };

  const handleOpenAddModal = addDebtOffset
    ? () => {
        setOpen(true);
        setRowData(undefined);
      }
    : undefined;

  const handleOpenUpdateModal = updateDebtOffset
    ? (record: IDebtOffset) => {
        setOpen(true);
        setRowData(record);
      }
    : undefined;

  const handleDelete = deleteDebtOffset
    ? (record: IDebtOffset) => {
        modal.confirm({
          title: "Xóa khách hàng",
          content: `Bạn có chắc chắn muốn xóa phiếu chuyển kho?`,
          okText: "Xóa",
          cancelText: "Hủy",
          onOk: () => {
            deleteDebtOffset(record.id);
          },
        });
      }
    : undefined;

  return (
    <div className="flex flex-col h-full w-full gap-2">
      <div className="flex items-center gap-3 flex-shrink-0">
        <SearchInput value={keyword} onSearch={pageAction.handleSearch} />
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
        {/* <CustomFilter
          // filterActive={isFilterActive}
          // sortItems={sortItems}
          // sortValue={{ sortBy, sortOrder }}
          onSortChange={pageAction.handleSortChange}
          // rangerItems={rangerItems}
          // rangerValue={ranger}
          onRangerChange={pageAction.handleRangerChange}
          // filterUses={filterUses}
          // searchItems={searchItems}
          // searchValue={search}
          onSearchChange={pageAction.handleSearchChange}
          onClearFilter={pageAction.resetFilter}
        /> */}
        <AddButton onOpenAdd={handleOpenAddModal} />
      </div>
      <div className="flex flex-col h-[calc(100%-40px)] gap-4 bg-white px-6 py-2 rounded-lg border">
        <DebtOffsetTable
          dataSource={debtOffsets}
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
        onAdd={addDebtOffset}
        onEdit={updateDebtOffset}
        onClose={pageAction.handleClose}
      />
    </div>
  );
};
