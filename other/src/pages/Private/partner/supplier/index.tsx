import { usePageState } from "../../../../hooks/core/usePageState";
import AddButton from "../../../../components/button/AddButton";
import { IPartner } from "../../../../models/partner";
import { SearchInput } from "../../../../components/input/SearchInput";
import { useNavigate } from "react-router-dom";
import { App } from "antd";
import CustomPageTitle from "../../../../layout/Private/header/components/PageTitle";
import { privateRoutesName } from "../../../../constants/routerName";
import { buildUrlWithId } from "../../../../utils/paramUtils";
import { useSupplierData } from "../../../../hooks/partner/useSupplierData";
import SupplierTable from "./components/SupplierTable";
import { checkSelection } from "../../../../utils/common";

const Page: React.FC = () => {
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
  } = usePageState<IPartner>();

  const { suppliers, loading, pagination, addSupplier, deleteSupplier } = useSupplierData({
    keyword,
    page,
    size,
    filter,
    reload,
    onCloseModal: () => {
      pageAction.handleClose();
    },
  });

  const handleOpenDetailModal = (record: IPartner) => {};

  const handleOpenAddModal = addSupplier
    ? () => {
        navigate(privateRoutesName.supplier.add);
      }
    : undefined;

  const handleDelete = deleteSupplier
    ? (record: IPartner) => {
        modal.confirm({
          title: "Xóa khách hàng",
          content: `Bạn có chắc chắn muốn xóa khách hàng "${record.name}"?`,
          okText: "Xóa",
          cancelText: "Hủy",
          onOk: () => {
            deleteSupplier(record.id);
          },
        });
      }
    : undefined;

  return (
    <div ref={containerRef} className="flex flex-col h-full w-full gap-2">
      <div className="flex items-center gap-3 flex-shrink-0">
        <CustomPageTitle />
        {/* <CustomFilter /> */}
        <div className="ml-auto mr-0 flex gap-3">
          <SearchInput value={keyword} onSearch={pageAction.handleSearch} />
          <AddButton onOpenAdd={handleOpenAddModal} />
        </div>
      </div>
      <div className="flex flex-col w-full h-[calc(100%-40px)] bg-white px-6 py-2 rounded-lg">
        <SupplierTable
          dataSource={suppliers}
          loading={loading}
          pagination={pagination}
          setPage={setPage}
          setSize={setSize}
          onDelete={handleDelete}
          onRow={(record: any) => {
            return {
              onClick: () => {
                if (record.isSummary || checkSelection()) return;
                navigate(buildUrlWithId(privateRoutesName.supplier.detail, record.id));
              },
            };
          }}
        />
      </div>
    </div>
  );
};

export default Page;
