import { usePageState } from "../../../../hooks/core/usePageState";
import { useEffect } from "react";
import { checkSelection, getLocationNotification } from "../../../../utils/common";
import { App } from "antd";
import FundTransferTable from "../components/fundTransfer/FundTransferTable";
import DateRangeFilter from "../../../../components/button/DateRangeFilter";
import CustomFilter from "../../../../components/filters";
import { SearchInput } from "../../../../components/input";
import AddButton from "../../../../components/button/AddButton";
import { IFundTransfer } from "../../../../models/fundTransfer";
import { useFundTransferData } from "../../../../hooks/fund/useFundTransferData";
import AddUpdateModal from "../components/fundTransfer/AddUpdateModal";
import Title from "../../../../components/display/Title";
import { filterUses, rangerItems, sortItems } from "../components/fundTransfer/filterItem";
import { SortOrderEnum } from "../../../../constants/enum";

export const FundTransfer: React.FC = () => {
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
    setPage,
    setSize,

    open,
    setOpen,
    rowData,
    setRowData,

    pageAction,
  } = usePageState<IFundTransfer>({
    sortBy: "occurredAt",
    sortOrder: SortOrderEnum.DESC,
    filterUses,
  });

  const {
    fundTransfers,
    errors,
    loading,
    pagination,
    addFundTransfer,
    updateFundTransfer,
    deleteFundTransfer,
  } = useFundTransferData({
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
    onCloseModal: () => {
      pageAction.handleClose();
    },
  });

  useEffect(() => {
    if (!rowData) return;

    const newRowData = fundTransfers.find((item) => item.id === rowData?.id);

    setRowData(newRowData);
  }, [fundTransfers, rowData]);

  const handleOpenDetailModal = (record: IFundTransfer) => {
    setRowData(record);
    setOpen(true);
  };

  const handleOpenAddModal = addFundTransfer
    ? () => {
        setOpen(true);
        setRowData(undefined);
      }
    : undefined;

  const handleOpenUpdateModal = updateFundTransfer
    ? (record: IFundTransfer) => {
        setOpen(true);
        setRowData(record);
      }
    : undefined;

  const handleDelete = deleteFundTransfer
    ? (record: IFundTransfer) => {
        modal.confirm({
          title: "Xóa khách hàng",
          content: `Bạn có chắc chắn muốn xóa phiếu chuyển kho?`,
          okText: "Xóa",
          cancelText: "Hủy",
          onOk: () => {
            deleteFundTransfer(record.id);
          },
        });
      }
    : undefined;

  return (
    <div className="flex flex-col h-full w-full gap-2">
      <div className="flex items-center gap-3 flex-shrink-0">
        <Title content="Danh sách phiếu chuyển quỹ" className="ml-0 mr-auto" level={3} />
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
        <SearchInput value={keyword} onSearch={pageAction.handleSearch} maxWidth={230} />
        <AddButton onOpenAdd={handleOpenAddModal} />
      </div>
      <div className="flex flex-col h-[calc(100%-40px)] gap-4 bg-white px-6 py-2 rounded-lg border">
        <FundTransferTable
          dataSource={fundTransfers}
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
        errors={errors}
        loading={loading}
        editData={rowData}
        onAdd={addFundTransfer}
        onEdit={updateFundTransfer}
        onClose={pageAction.handleClose}
      />
    </div>
  );
};
