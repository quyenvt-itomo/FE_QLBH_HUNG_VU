import { usePageState } from "../../../../hooks/core/usePageState";
import { useDebtAdjustmentData } from "../../../../hooks/debt/useDebtAdjustmentData";
import { useEffect, useState } from "react";
import { checkSelection, getLocationNotification } from "../../../../utils/common";
import { useNavigate } from "react-router-dom";
import { App, Radio } from "antd";
import DebtAdjustmentTable from "../components/debtAdjustment/DebtAdjustmentTable";
import DateRangeFilter from "../../../../components/button/DateRangeFilter";
import { SearchInput } from "../../../../components/input";
import AddButton from "../../../../components/button/AddButton";
import { IDebtAdjustment } from "../../../../models/store/debtAdjustment";
import AddUpdateModal from "../components/debtAdjustment/AddUpdateModal";
import { PartnerDebtSideEnum, partnerDebtSideMap } from "../../../../constants/enum";
import { useClientData } from "../../../../hooks/core/useClientData";
import StoreSelect from "../../../../components/select/StoreSelect";

export const DebtAdjustment: React.FC = () => {
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
  } = usePageState<IDebtAdjustment>();
  const [side, setSide] = useState<PartnerDebtSideEnum>(PartnerDebtSideEnum.RECEIVABLE);
  const { currentStore } = useClientData();

  const {
    debtAdjustments,
    errors,
    loading,
    pagination,
    summary,
    addDebtAdjustment,
    updateDebtAdjustment,
    deleteDebtAdjustment,
  } = useDebtAdjustmentData({
    keyword,
    page,
    size,
    filter,
    reload,
    startAt,
    endAt,
    storeId,
    side,
    onCloseModal: () => {
      pageAction.handleClose();
    },
  });

  useEffect(() => {
    if (!rowData) return;

    const newRowData = debtAdjustments.find((item) => item.id === rowData?.id);

    setRowData(newRowData);
  }, [debtAdjustments, rowData]);

  const handleOpenDetailModal = (record: IDebtAdjustment) => {
    setRowData(record);
    setOpen(true);
  };

  const handleOpenAddModal = addDebtAdjustment
    ? () => {
        setOpen(true);
        setRowData(undefined);
      }
    : undefined;

  const handleOpenUpdateModal = updateDebtAdjustment
    ? (record: IDebtAdjustment) => {
        setOpen(true);
        setRowData(record);
      }
    : undefined;

  const handleDelete = deleteDebtAdjustment
    ? (record: IDebtAdjustment) => {
        modal.confirm({
          title: "Xóa khách hàng",
          content: `Bạn có chắc chắn muốn xóa phiếu chuyển kho?`,
          okText: "Xóa",
          cancelText: "Hủy",
          onOk: () => {
            deleteDebtAdjustment(record.id);
          },
        });
      }
    : undefined;

  return (
    <div className="flex flex-col h-full w-full gap-2">
      <div className="flex items-center gap-3 flex-shrink-0">
        <Radio.Group
          value={side}
          onChange={(e) => setSide(e.target.value)}
          optionType="button"
          buttonStyle="solid"
          className="flex w-52 ml-0 mr-auto"
        >
          <Radio.Button
            value={PartnerDebtSideEnum.RECEIVABLE}
            className="flex items-center justify-center h-8 !rounded w-1/2 !rounded-e-none"
          >
            {partnerDebtSideMap[PartnerDebtSideEnum.RECEIVABLE]}
          </Radio.Button>
          <Radio.Button
            value={PartnerDebtSideEnum.PAYABLE}
            className="flex items-center justify-center h-8 !rounded w-1/2 !rounded-s-none"
          >
            {partnerDebtSideMap[PartnerDebtSideEnum.PAYABLE]}
          </Radio.Button>
        </Radio.Group>
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
        <SearchInput value={keyword} onSearch={pageAction.handleSearch} maxWidth={230} />
        <AddButton onOpenAdd={handleOpenAddModal} />
      </div>
      <div className="flex flex-col h-[calc(100%-40px)] gap-4 bg-white px-6 py-2 rounded-lg border">
        <DebtAdjustmentTable
          dataSource={debtAdjustments}
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
        side={side}
        open={open}
        editData={rowData}
        errors={errors}
        loading={loading}
        onAdd={addDebtAdjustment}
        onEdit={updateDebtAdjustment}
        onClose={pageAction.handleClose}
      />
    </div>
  );
};
