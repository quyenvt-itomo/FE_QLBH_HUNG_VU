import { usePageState } from "../../../../hooks/core/usePageState";
import { useStoreData } from "../../../../hooks/useStoreData";
import StoreTable from "./components/StoreTable";
import AddButton from "../../../../components/button/AddButton";
import { IStore } from "../../../../models/store";
import { useClientData } from "../../../../hooks/core/useClientData";
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
  } = usePageState<IStore>();
  const { handleGetInfo } = useClientData();

  const { stores, errors, loading, pagination, addStore, updateStore, deleteStore } = useStoreData({
    keyword,
    page,
    size,
    filter,
    reload,
    onCloseModal: () => {
      pageAction.handleClose();
      handleGetInfo();
    },
  });

  const handleOpenDetailModal = (record: IStore) => {};

  const handleOpenAddModal = addStore
    ? () => {
        setOpen(true);
        setRowData(undefined);
      }
    : undefined;

  const handleOpenUpdate = updateStore
    ? (record: IStore) => {
        setOpen(true);
        setRowData(record);
      }
    : undefined;

  const handleDelete = deleteStore
    ? (record: IStore) => {
        modal.confirm({
          title: "Xóa khách hàng",
          content: `Bạn có chắc chắn muốn xóa khách hàng "${record.name}"?`,
          okText: "Xóa",
          cancelText: "Hủy",
          onOk: () => {
            deleteStore(record.id);
          },
        });
      }
    : undefined;

  return (
    <div ref={containerRef} className="flex flex-col h-full w-full gap-4">
      <div className="flex items-center gap-3 flex-shrink-0">
        <CustomPageTitle />
        {/* <CustomFilter /> */}
        <SearchInput value={keyword} onSearch={pageAction.handleSearch} />
        <div className="ml-auto mr-0">
          <AddButton onOpenAdd={handleOpenAddModal} />
        </div>
      </div>
      <div className="flex flex-col w-full h-[calc(100%-40px)] bg-white px-6 py-2 rounded-lg">
        <StoreTable
          dataSource={stores}
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
        onAdd={addStore}
        onEdit={updateStore}
        onClose={pageAction.handleClose}
      />
    </div>
  );
};

export default Page;
