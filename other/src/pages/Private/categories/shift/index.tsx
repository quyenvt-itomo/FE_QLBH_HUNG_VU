import { App, Tabs } from "antd";
import AddButton from "../../../../components/button/AddButton";
import { SearchInput } from "../../../../components/input";
import { checkSelection } from "../../../../utils/common";
import { usePageState } from "../../../../hooks/core/usePageState";
import { IShift } from "../../../../models/store/shift";
import { useShiftData } from "../../../../hooks/useShiftData";
import { ShiftStatusEnum, SortOrder } from "../../../../constants/enum";
import { ShiftTable } from "./components/ShiftTable";
import { AddUpdateShiftModal } from "./components/AddUpdateModal";
import { DetailShiftModal } from "./components/DetailModal";
import { useClientData } from "../../../../hooks/core/useClientData";
import StoreSelect from "../../../../components/select/StoreSelect";
import DateRangeFilter from "../../../../components/button/DateRangeFilter";
import CustomFilter from "../../../../components/filters";
import { filterUses, rangerItems, sortItems } from "./filterItem";

const Page: React.FC = () => {
  const { modal } = App.useApp();
  const {
    startAt,
    endAt,
    isFilterActive,
    status,
    sortBy,
    sortOrder,
    keyword,
    page,
    size,
    filter,
    ranger,
    reload,
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
  } = usePageState<IShift>({
    sortBy: "startAt",
    sortOrder: SortOrder.DESC,
    filterUses,
  });
  const { currentStore } = useClientData();

  const { shifts, errors, loading, pagination, summary, addShift, updateShift, deleteShift } =
    useShiftData({
      keyword,
      page,
      size,
      reload,
      status: status === "all" ? undefined : status,
      filter,
      ranger,
      storeId,
      onCloseModal: () => {
        pageAction.handleClose();
      },
    });

  const handleOpenDetailModal = (record: IShift) => {
    setRowData(record);
    setOpenDetail(true);
  };

  const handleOpenAddModal = addShift
    ? () => {
        setOpen(true);
        setRowData(undefined);
      }
    : undefined;

  const handleOpenUpdate = updateShift
    ? (record: IShift) => {
        setOpen(true);
        setRowData(record);
      }
    : undefined;

  const handleDelete = deleteShift
    ? (record: IShift) => {
        modal.confirm({
          title: "Xóa ca làm việc",
          content: `Bạn có chắc chắn muốn xóa ca làm việc "${record.code}"?`,
          okText: "Xóa",
          cancelText: "Hủy",
          onOk: () => {
            deleteShift(record.id);
          },
        });
      }
    : undefined;

  return (
    <div className="flex flex-col h-full w-full gap-3">
      <div className="flex items-center justify-between gap-3 flex-shrink-0">
        <Tabs
          activeKey={status}
          onChange={pageAction.handleStatusChange}
          items={[
            { key: "all", label: "Tất cả" },
            { key: ShiftStatusEnum.ACTIVE, label: "Đang mở" },
            { key: ShiftStatusEnum.CLOSED, label: "Đã đóng" },
          ]}
          className="flex-1 h-8"
        />
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
        <AddButton onOpenAdd={handleOpenAddModal} />
      </div>

      <div className="flex flex-col w-full h-[calc(100%-36px)] bg-white py-2 px-6 rounded-lg border">
        <ShiftTable
          dataSource={shifts}
          loading={loading}
          summaryData={summary}
          pagination={pagination}
          setPage={setPage}
          setSize={setSize}
          onEdit={handleOpenUpdate}
          onDelete={handleDelete}
          onRow={(record: any) => {
            return {
              onClick: () => {
                if (record.isSummary || checkSelection()) return;
                handleOpenDetailModal(record);
              },
            };
          }}
        />
      </div>

      <AddUpdateShiftModal
        open={open}
        errors={errors}
        loading={loading}
        editData={rowData}
        onAdd={addShift}
        onEdit={updateShift}
        onClose={pageAction.handleClose}
      />

      <DetailShiftModal
        loading={loading}
        data={rowData}
        open={openDetail}
        onReload={pageAction.handleReload}
        onClose={pageAction.handleClose}
        onUpdate={updateShift}
      />
    </div>
  );
};

export default Page;
