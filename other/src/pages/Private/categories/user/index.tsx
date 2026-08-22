import { usePageState } from "../../../../hooks/core/usePageState";
import { useUserData } from "../../../../hooks/useUserData";
import UserTable from "./components/UserTable";
import AddButton from "../../../../components/button/AddButton";
import { IUser } from "../../../../models/user";
import { SearchInput } from "../../../../components/input/SearchInput";
import { checkSelection, getLocationNotification } from "../../../../utils/common";
import { useNavigate } from "react-router-dom";
import { App } from "antd";
import AddUpdateModal from "./components/AddUpdateModal";
import CustomPageTitle from "../../../../layout/Private/header/components/PageTitle";

const Page: React.FC = () => {
  const notification = getLocationNotification();
  const navigate = useNavigate();
  const { modal } = App.useApp();
  const {
    keyword,
    page,
    size,
    status,
    filter,
    reload,
    setPage,
    setSize,

    open,
    setOpen,
    rowData,
    setRowData,

    containerRef,
    pageAction,
  } = usePageState<IUser>();

  const { users, errors, loading, pagination, addUser, updateUser, deleteUser } = useUserData({
    keyword,
    page,
    size,
    status: status === "all" ? undefined : status,
    filter,
    reload,
    onCloseModal: () => {
      pageAction.handleClose();
    },
  });

  const handleOpenDetailModal = (record: IUser) => {};

  const handleOpenAddModal = addUser
    ? () => {
        setOpen(true);
        setRowData(undefined);
      }
    : undefined;

  const handleOpenUpdate = updateUser
    ? (record: IUser) => {
        setOpen(true);
        setRowData(record);
      }
    : undefined;

  const handleDelete = deleteUser
    ? (record: IUser) => {
        modal.confirm({
          title: "Xóa người dùng",
          content: `Bạn có chắc chắn muốn xóa người dùng "${record.name}"?`,
          okText: "Xóa",
          cancelText: "Hủy",
          onOk: () => {
            deleteUser(record.id);
          },
        });
      }
    : undefined;

  return (
    <div className="flex flex-col h-full w-full gap-2">
      <div className="flex items-center gap-3 flex-shrink-0">
        <CustomPageTitle />
        <SearchInput value={keyword} onSearch={pageAction.handleSearch} />
        <AddButton onOpenAdd={handleOpenAddModal} />
      </div>
      <div className="flex flex-col w-full h-[calc(100%-40px)] bg-white px-6 py-2 rounded-lg">
        <UserTable
          dataSource={users}
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
        onAdd={addUser}
        onEdit={updateUser}
        onClose={pageAction.handleClose}
      />
    </div>
  );
};

export default Page;
