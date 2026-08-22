import { usePageState } from "../../../../hooks/core/usePageState";
import { useVatAdjustmentData } from "../../../../hooks/vat/useVatAdjustmentData";
import { useEffect } from "react";
import { checkSelection, getLocationNotification } from "../../../../utils/common";
import { useNavigate } from "react-router-dom";
import { App } from "antd";
import VatAdjustmentTable from "../components/vatAdjustment/VatAdjustmentTable";
import DateRangeFilter from "../../../../components/button/DateRangeFilter";
import { SearchInput } from "../../../../components/input";
import AddButton from "../../../../components/button/AddButton";
import { IVatAdjustment } from "../../../../models/store/vatAdjustment";
import AddUpdateModal from "../components/vatAdjustment/AddUpdateModal";
import { useClientData } from "../../../../hooks/core/useClientData";
import StoreSelect from "../../../../components/select/StoreSelect";

export const VatAdjustment: React.FC = () => {
  const notification = getLocationNotification();
  const navigate = useNavigate();
  const { modal } = App.useApp();
  const {
    storeId,
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
    rowData,
    setRowData,

    pageAction,
  } = usePageState<IVatAdjustment>();
  const { currentStore } = useClientData();

  const {
    vatAdjustments,
    errors,
    loading,
    pagination,
    summary,
    addVatAdjustment,
    updateVatAdjustment,
    deleteVatAdjustment,
  } = useVatAdjustmentData({
    keyword,
    page,
    size,
    filter,
    reload,
    startAt,
    endAt,
    storeId,
    onCloseModal: () => {
      pageAction.handleClose();
    },
  });

  useEffect(() => {
    if (!rowData) return;

    const newRowData = vatAdjustments.find((item) => item.id === rowData?.id);

    setRowData(newRowData);
  }, [vatAdjustments, rowData]);

  const handleOpenDetailModal = (record: IVatAdjustment) => {
    setRowData(record);
    setOpen(true);
  };

  const handleOpenAddModal = addVatAdjustment
    ? () => {
        setOpen(true);
        setRowData(undefined);
      }
    : undefined;

  const handleOpenUpdateModal = updateVatAdjustment
    ? (record: IVatAdjustment) => {
        setOpen(true);
        setRowData(record);
      }
    : undefined;

  const handleDelete = deleteVatAdjustment
    ? (record: IVatAdjustment) => {
        modal.confirm({
          title: "Xóa khách hàng",
          content: `Bạn có chắc chắn muốn xóa phiếu chuyển kho?`,
          okText: "Xóa",
          cancelText: "Hủy",
          onOk: () => {
            deleteVatAdjustment(record.id);
          },
        });
      }
    : undefined;

  return (
    <div className="flex flex-col h-full w-full gap-2">
      <div className="flex items-center gap-3 flex-shrink-0">
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
        <SearchInput value={keyword} onSearch={pageAction.handleSearch} />
        <div className="ml-auto mr-0">
          <AddButton onOpenAdd={handleOpenAddModal} />
        </div>
      </div>
      <div className="flex flex-col h-[calc(100%-40px)] gap-4 bg-white px-6 py-2 rounded-lg shadow-md">
        <VatAdjustmentTable
          dataSource={vatAdjustments}
          loading={loading}
          pagination={pagination}
          summaryData={summary}
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
        onAdd={addVatAdjustment}
        onEdit={updateVatAdjustment}
        onClose={pageAction.handleClose}
      />
    </div>
  );
};
