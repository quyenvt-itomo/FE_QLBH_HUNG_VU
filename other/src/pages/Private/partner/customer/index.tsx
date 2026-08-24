import { usePageState } from "../../../../hooks/core/usePageState";
import AddButton from "../../../../components/button/AddButton";
import { IPartner } from "../../../../models/partner";
import { SearchInput } from "../../../../components/input/SearchInput";
import { useNavigate } from "react-router-dom";
import { App } from "antd";
import CustomPageTitle from "../../../../layout/Private/header/components/PageTitle";
import CustomerTable from "./components/CustomerTable";
import { privateRoutesName } from "../../../../constants/routerName";
import { buildUrlWithId } from "../../../../utils/paramUtils";
import { useCustomerData } from "../../../../hooks/partner/useCustomerData";
import { checkSelection } from "../../../../utils/common";
import { ExcelButton } from "../../../../components/button/ExcelButton";
import { ExcelEntityType, SortOrder } from "../../../../constants/enum";
import CustomFilter from "../../../../components/filters";
import { filterUses, rangerItems, sortItems } from "./filterItem";

const Page: React.FC = () => {
  const navigate = useNavigate();
  const { modal } = App.useApp();
  const {
    isFilterActive,
    keyword,
    page,
    size,
    sortBy,
    sortOrder,
    filter,
    ranger,
    reload,
    setPage,
    setSize,

    containerRef,
    pageAction,
  } = usePageState<IPartner>({
    sortBy: "createdAt",
    sortOrder: SortOrder.DESC,
    filterUses,
  });

  const { customers, loading, pagination, addCustomer, updateCustomer, deleteCustomer } =
    useCustomerData({
      keyword,
      page,
      size,
      sortBy,
      sortOrder,
      filter,
      ranger,
      reload,
      onCloseModal: () => {
        pageAction.handleClose();
      },
    });

  const handleOpenDetailModal = (record: IPartner) => {
    navigate(buildUrlWithId(privateRoutesName.customer.detail, record.id));
  };

  const handleOpenAddModal = addCustomer
    ? () => {
        navigate(privateRoutesName.customer.add);
      }
    : undefined;

  const handleDelete = deleteCustomer
    ? (record: IPartner) => {
        modal.confirm({
          title: "Xóa khách hàng",
          content: `Bạn có chắc chắn muốn xóa khách hàng "${record.name}"?`,
          okText: "Xóa",
          cancelText: "Hủy",
          onOk: () => {
            deleteCustomer(record.id);
          },
        });
      }
    : undefined;

  return (
    <div ref={containerRef} className="flex flex-col h-full w-full gap-2">
      <div className="flex items-center gap-3 flex-shrink-0">
        <CustomPageTitle />
        <div className="ml-auto mr-0 flex gap-3">
          <SearchInput value={keyword} onSearch={pageAction.handleSearch} />
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
          <ExcelButton
            entityType={ExcelEntityType.CUSTOMER}
            onSuccess={pageAction.handleReload}
            showImport={!!handleOpenAddModal}
            exportOptions={{
              filename: "Danh_sach_khach_hang",
              filters: {
                ...filter,
              },
            }}
          />
          <AddButton onOpenAdd={handleOpenAddModal} />
        </div>
      </div>
      <div className="flex flex-col w-full h-[calc(100%-40px)] bg-white px-6 py-2 rounded-lg border">
        <CustomerTable
          dataSource={customers}
          loading={loading}
          pagination={pagination}
          setPage={setPage}
          setSize={setSize}
          onDelete={handleDelete}
          onEdit={updateCustomer ? handleOpenDetailModal : undefined}
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
    </div>
  );
};

export default Page;
