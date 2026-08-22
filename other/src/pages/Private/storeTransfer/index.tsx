import { usePageState } from "../../../hooks/core/usePageState";
import { useStoreTransferData } from "../../../hooks/inventory/useStoreTransferData";
import { useEffect } from "react";
import { checkSelection, getLocationNotification } from "../../../utils/common";
import { useNavigate } from "react-router-dom";
import { App } from "antd";
import AddModal from "./components/AddModal";
import StoreTransferTable from "./components/StoreTransferTable";
import DateRangeFilter from "../../../components/button/DateRangeFilter";
import CustomFilter from "../../../components/filters";
import { SearchInput } from "../../../components/input";
import AddButton from "../../../components/button/AddButton";
import DetailModal from "./components/DetailModal";
import { IStoreTransfer } from "../../../models/storeTransfer";
import CustomPageTitle from "../../../layout/Private/header/components/PageTitle";
import { exportStoreTransferToExcel } from "../../../utils/excelExport";
// store transfer HTML generator replaced by StoreTransferPrint component
import { usePrintHtml, StoreTransferPrint } from "../../../components/print";

const Page: React.FC = () => {
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
    setPage,
    setSize,

    open,
    setOpen,
    openDetail,
    setOpenDetail,
    rowData,
    setRowData,

    pageAction,
  } = usePageState<IStoreTransfer>();

  const {
    storeTransfers,
    errors,
    loading,
    pagination,
    addStoreTransfer,
    updateStoreTransfer,
    deleteStoreTransfer,
  } = useStoreTransferData({
    keyword,
    page,
    size,
    filter,
    reload,
    startAt,
    endAt,
    onCloseModal: () => {
      pageAction.handleClose(false);
    },
  });

  useEffect(() => {
    if (!rowData) return;

    const newRowData = storeTransfers.find((item) => item.id === rowData?.id);

    setRowData(newRowData);
  }, [storeTransfers, rowData]);

  const handleOpenDetailModal = (record: IStoreTransfer) => {
    setRowData(record);
    setOpenDetail(true);
  };

  const handleOpenAddModal = addStoreTransfer
    ? () => {
        setOpen(true);
        setRowData(undefined);
      }
    : undefined;

  const handleOpenUpdateModal = updateStoreTransfer
    ? (record: IStoreTransfer) => {
        setOpenDetail(true);
        setRowData(record);
      }
    : undefined;

  const handleDelete = deleteStoreTransfer
    ? (record: IStoreTransfer) => {
        modal.confirm({
          title: "Xóa khách hàng",
          content: `Bạn có chắc chắn muốn xóa phiếu chuyển kho?`,
          okText: "Xóa",
          cancelText: "Hủy",
          onOk: () => {
            deleteStoreTransfer(record.id);
          },
        });
      }
    : undefined;

  const { contentRef, printData, handlePrint } = usePrintHtml<IStoreTransfer>();

  const handlePrintClick = (data: IStoreTransfer) => {
    if (!data) return;
    handlePrint(data);
  };

  return (
    <>
      <div className="flex flex-col h-full w-full gap-2">
        <div className="flex items-center gap-3 flex-shrink-0">
          <CustomPageTitle />
          <SearchInput value={keyword} onSearch={pageAction.handleSearch} />
          <DateRangeFilter
            startDate={startAt}
            endDate={endAt}
            onRangeChange={pageAction.handleDateRangerChange}
          />
          <CustomFilter
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
          />
          <AddButton onOpenAdd={handleOpenAddModal} />
        </div>
        <div className="flex flex-col h-[calc(100%-40px)] gap-4 bg-white px-6 py-2 rounded-lg shadow-md">
          <StoreTransferTable
            dataSource={storeTransfers}
            loading={loading}
            pagination={pagination}
            setPage={setPage}
            setSize={setSize}
            onEdit={handleOpenUpdateModal}
            onDelete={handleDelete}
            onExportExcel={exportStoreTransferToExcel}
            onPrint={handlePrintClick}
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
          onAdd={addStoreTransfer}
          onEdit={updateStoreTransfer}
          onClose={pageAction.handleClose}
        />

        <DetailModal
          data={rowData}
          open={openDetail}
          loading={loading}
          onUpdate={handleOpenUpdateModal ? updateStoreTransfer : undefined}
          onReload={pageAction.handleReload}
          onClose={pageAction.handleClose}
        />
      </div>

      <div style={{ display: "none" }}>
        <div ref={contentRef}>{printData && <StoreTransferPrint data={printData} />}</div>
      </div>
    </>
  );
};

export default Page;
