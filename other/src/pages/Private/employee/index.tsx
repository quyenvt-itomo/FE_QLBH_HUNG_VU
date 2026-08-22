import { usePageState } from "../../../hooks/core/usePageState";
import { useEmployeeData } from "../../../hooks/useEmployeeData";
import EmployeeTable from "./components/EmployeeTable";
import AddButton from "../../../components/button/AddButton";
import { IEmployee } from "../../../models/store/employee";
import { useState } from "react";
import { SearchInput } from "../../../components/input/SearchInput";
import { checkSelection, getLocationNotification } from "../../../utils/common";
import { useNavigate } from "react-router-dom";
import { App } from "antd";
import AddUpdateModal from "./components/AddUpdateModal";
import CustomPageTitle from "../../../layout/Private/header/components/PageTitle";
import { useClientData } from "../../../hooks/core/useClientData";
import StoreSelect from "../../../components/select/StoreSelect";

const Page: React.FC = () => {
  const notification = getLocationNotification();
  const navigate = useNavigate();
  const { modal } = App.useApp();
  const {
    keyword,
    page,
    size,
    filter,
    reload,
    storeId,
    setPage,
    setSize,

    open,
    setOpen,
    rowData,
    setRowData,

    containerRef,
    pageAction,
  } = usePageState<IEmployee>();
  const { currentStore } = useClientData();

  const { employees, errors, loading, pagination, addEmployee, updateEmployee, deleteEmployee } =
    useEmployeeData({
      keyword,
      page,
      size,
      filter,
      reload,
      storeId,
      onCloseModal: () => {
        pageAction.handleClose();
      },
    });

  const handleOpenDetailModal = (record: IEmployee) => {};

  const handleOpenAddModal = addEmployee
    ? () => {
        setOpen(true);
        setRowData(undefined);
      }
    : undefined;

  const handleOpenUpdate = updateEmployee
    ? (record: IEmployee) => {
        setOpen(true);
        setRowData(record);
      }
    : undefined;

  const handleDelete = deleteEmployee
    ? (record: IEmployee) => {
        modal.confirm({
          title: "Xóa khách hàng",
          content: `Bạn có chắc chắn muốn xóa khách hàng "${record.name}"?`,
          okText: "Xóa",
          cancelText: "Hủy",
          onOk: () => {
            deleteEmployee(record.id);
          },
        });
      }
    : undefined;

  return (
    <div
      ref={containerRef}
      className="flex flex-col h-full overflow-x-hidden overflow-y-auto w-full gap-2"
    >
      <div className="flex items-center gap-3 flex-shrink-0">
        <CustomPageTitle />
        <div className="ml-auto mr-0 flex gap-3">
          {!currentStore && (
            <div className="w-80 flex">
              <StoreSelect
                value={storeId}
                onChange={pageAction.handleStoreChange}
                placeholder="Lọc theo cửa hàng"
              />
            </div>
          )}
          <SearchInput value={keyword} onSearch={pageAction.handleSearch} />
          <AddButton onOpenAdd={handleOpenAddModal} />
        </div>
      </div>
      <div className="flex flex-col w-full h-[calc(100%-40px)] bg-white px-6 py-2 rounded-lg">
        <EmployeeTable
          dataSource={employees}
          loading={loading}
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
      <AddUpdateModal
        open={open}
        errors={errors}
        loading={loading}
        editData={rowData}
        onAdd={addEmployee}
        onEdit={updateEmployee}
        onClose={pageAction.handleClose}
      />
    </div>
  );
};

export default Page;
