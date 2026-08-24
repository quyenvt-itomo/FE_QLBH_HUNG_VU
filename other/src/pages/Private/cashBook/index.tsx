import { useState } from "react";
import { usePageState } from "../../../hooks/core/usePageState";
import { ExcelEntityType, IncomeExpenseTypeEnum, SortOrder } from "../../../constants/enum";
import { useIncomeExpenseData } from "../../../hooks/useIncomeExpenseData";
import CustomTitle from "../../../layout/Private/header/components/Title";
import DateRangeFilter from "../../../components/button/DateRangeFilter";
import { SearchInput } from "../../../components/input";
import { App, Button } from "antd";
import IncomeExpenseTable from "./components/IncomeExpenseTable";
import AddUpdateModal from "./components/AddUpdateModal";
import { Filter } from "./components/Filter";
import CustomFilter from "../../../components/filters";
import { filterUses, rangerItems, searchItems, sortItems } from "./components/filterItem";
import { IIncomeExpense } from "../../../models/store/incomeExpense";
import { ExcelButton } from "../../../components/button/ExcelButton";
import dayjs from "dayjs";
import { useClientData } from "../../../hooks/core/useClientData";

export const Page: React.FC = () => {
  const {
    keyword,
    page,
    size,
    status,
    filter,
    search,
    reload,
    startAt,
    endAt,
    isFilterActive,
    sortBy,
    sortOrder,
    ranger,
    setPage,
    setSize,

    open,
    setOpen,
    rowData,
    setRowData,

    pageAction,
  } = usePageState<IIncomeExpense>({
    sortBy: "occurredAt",
    sortOrder: SortOrder.DESC,
    filterUses,
  });
  const [type, setType] = useState<IncomeExpenseTypeEnum>(IncomeExpenseTypeEnum.INCOME);
  const [filterType, setFilterType] = useState<IncomeExpenseTypeEnum | undefined>();
  const [categoryId, setCategoryId] = useState<string | undefined>();
  const [fundCategoryGroupId, setFundCategoryGroupId] = useState<string | undefined>();
  const { modal } = App.useApp();
  const { currentStore } = useClientData();

  const {
    incomeExpenses,
    loading,
    pagination,
    errors,
    addIncomeExpense,
    updateIncomeExpense,
    deleteIncomeExpense,
  } = useIncomeExpenseData({
    keyword,
    status: status === "all" ? undefined : status,
    filter,
    page,
    size,
    sortBy,
    sortOrder,
    ranger,
    search,
    reload,
    startAt,
    endAt,
    type: filterType,
    categoryId,
    fundCategoryGroupId,
    onCloseModal: () => {
      pageAction.handleClose();
    },
  });

  const handleOpenAddModal = addIncomeExpense
    ? (type: IncomeExpenseTypeEnum) => {
        setType(type);
        setOpen(true);
        setRowData(undefined);
      }
    : undefined;

  const handleOpenUpdateModal = updateIncomeExpense
    ? (record: any) => {
        setType(record.type);
        setOpen(true);
        setRowData(record);
      }
    : undefined;

  const handleDelete = deleteIncomeExpense
    ? (record: IIncomeExpense) => {
        modal.confirm({
          title: "Xác nhận xóa",
          content: `Bạn có chắc chắn muốn xóa phiếu thu/chi này?`,
          okText: "Xóa",
          cancelText: "Hủy",
          onOk: () => {
            deleteIncomeExpense(record.id);
          },
        });
      }
    : undefined;

  return (
    <div className="flex flex-col relative h-full gap-2">
      <div className="flex items-center gap-3 justify-between">
        <CustomTitle />

        <div className="flex gap-3 items-center">
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
            filterLabels={{ employeeIds: "Nhân viên xử lý" }}
            onClearFilter={pageAction.resetFilter}
          />
          <SearchInput onSearch={pageAction.handleSearch} maxWidth={524} />

          <ExcelButton
            entityType={ExcelEntityType.INCOME_EXPENSE}
            onSuccess={pageAction.handleReload}
            exportOptions={{
              filename: "So_thu_chi_",
              filters: {
                ...filter,
                startAt: dayjs(startAt).startOf("day").toISOString(),
                endAt: dayjs(endAt).endOf("day").toISOString(),
                sortBy,
                sortOrder,
                ranger,
                storeId: currentStore?.id,
                type: filterType,
                categoryId,
                fundCategoryGroupId,
              },
            }}
          />

          {handleOpenAddModal && (
            <div className="flex items-center gap-3">
              <Button
                type="primary"
                className="rounded !bg-[#0773C6] hover:!bg-[#0563AD] md:w-28 h-8"
                onClick={() => handleOpenAddModal(IncomeExpenseTypeEnum.INCOME)}
              >
                Thu tiền
              </Button>
              <Button
                type="primary"
                className="rounded !bg-red-600 hover:!bg-red-700 md:w-28 h-8"
                onClick={() => handleOpenAddModal(IncomeExpenseTypeEnum.EXPENSE)}
              >
                Chi tiền
              </Button>
            </div>
          )}
        </div>
      </div>
      <div className="flex gap-4 w-full h-[calc(100%-44px)]">
        <div className="flex h-full w-[336px]">
          <Filter
            filterType={filterType}
            categoryId={categoryId}
            fundCategoryGroupId={fundCategoryGroupId}
            setCategoryId={setCategoryId}
            setFundCategoryGroupId={setFundCategoryGroupId}
            setFilterType={setFilterType}
          />
        </div>

        <div className="flex flex-col w-[calc(100%-352px)] bg-white border rounded-lg px-6 py-2">
          <IncomeExpenseTable
            dataSource={incomeExpenses}
            loading={loading}
            pagination={pagination}
            onEdit={handleOpenUpdateModal}
            onDelete={handleDelete}
            setPage={setPage}
            setSize={setSize}
          />
        </div>
      </div>

      <AddUpdateModal
        open={open}
        errors={errors}
        loading={loading}
        type={type}
        editData={rowData}
        onAdd={addIncomeExpense}
        onEdit={updateIncomeExpense}
        onClose={pageAction.handleClose}
      />
    </div>
  );
};
export default Page;
