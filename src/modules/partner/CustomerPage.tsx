import React, { useState } from "react";
import { App, Button, Dropdown } from "antd";
import { AddButton, Panel, SearchInput } from "@/shared/components";
import { PanelFilter } from "@/shared/components/filters";
import { ExcelButton, ExcelEntityType } from "@/modules/excel";
import { Gender } from "@/shared/constants/enum";
import { formatQuantity } from "@/shared/utils/number.util";
import {
  EllipsisHorizontalIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  getFilterUses,
  getRangerItems,
  getSortItems,
  partnerClassificationOptions,
  partnerGenderOptions,
  Partner,
  PartnerType,
} from "./partner.model";
import { useCustomerStore } from "./partner.store";
import { usePartnerBusinessPage } from "./partnerBusinessPage.hook";
import { CustomerAddUpdateModal, CustomerTable, PartnerDetailModal } from "./components";

const CustomerPage: React.FC = () => {
  const { modal } = App.useApp();
  const { pageState, store, handlers, partnerFilter } = usePartnerBusinessPage(
    useCustomerStore,
    PartnerType.CUSTOMER,
  );
  const sortItems = getSortItems(PartnerType.CUSTOMER);
  const filterUses = getFilterUses(PartnerType.CUSTOMER);
  const {
    isFilterActive,
    keyword,
    sortBy,
    sortOrder,
    setPage,
    setSize,
    open,
    setOpen,
    openDetail,
    setOpenDetail,
    rowData,
    pageAction,
  } = pageState;
  const {
    data,
    loading,
    creating,
    updating,
    pagination,
    getById,
    create,
    update,
    removeMany,
  } = store;
  const [selectedCustomers, setSelectedCustomers] = useState<Partner[]>([]);
  const rangerItems = getRangerItems(PartnerType.CUSTOMER);
  const filterActive = isFilterActive || partnerFilter.isActive;
  const selectedCustomerIds = selectedCustomers.map((customer) => customer.id);
  const hasSelectedCustomers = selectedCustomerIds.length > 0;

  const clearSelectedCustomers = () => setSelectedCustomers([]);

  const handleDeleteSelected = () => {
    if (!removeMany || !hasSelectedCustomers) return;

    modal.confirm({
      centered: true,
      title: "Xóa khách hàng",
      content: `Bạn có chắc muốn xóa ${selectedCustomers.length} khách hàng đã chọn?`,
      okText: "Xóa",
      okButtonProps: { danger: true },
      cancelText: "Hủy",
      onOk: () =>
        removeMany(selectedCustomerIds, {
          onSuccess: clearSelectedCustomers,
        }),
    });
  };

  const organizationKey =
    partnerFilter.organization === undefined
      ? []
      : [partnerFilter.organization ? "organization" : "individual"];

  return (
    <div className="flex h-full w-full gap-3" aria-label="Khách hàng">
      <PanelFilter
        filterActive={filterActive}
        sortItems={sortItems}
        sortValue={{ sortBy, sortOrder }}
        onSortChange={pageAction.handleSortChange}
        filterUses={filterUses}
        onClearFilter={partnerFilter.reset}
        rangerValue={pageState.ranger}
        rangerItems={rangerItems}
        onRangerChange={pageAction.handleRangerChange}
        enumFilters={[
          {
            label: "Phân loại",
            items: partnerClassificationOptions,
            value: organizationKey,
            multiple: false,
            onChange: (values) => {
              const value = values[0];
              partnerFilter.setOrganization(
                value === "organization" ? true : value === "individual" ? false : undefined,
              );
            },
          },
          {
            label: "Giới tính",
            items: partnerGenderOptions,
            value: partnerFilter.gender,
            onChange: (values) => partnerFilter.setGender(values as Gender[]),
          },
        ]}
        addressFilter={{
          states: partnerFilter.states,
          wards: partnerFilter.wards,
          onStatesChange: partnerFilter.setStates,
          onWardsChange: partnerFilter.setWards,
        }}
      />
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <SearchInput value={keyword} onSearch={pageAction.handleSearch} />
            {hasSelectedCustomers && (
              <div className="flex shrink-0 items-center gap-1">
                <span className="text-sm text-gray-500">
                  {formatQuantity(selectedCustomers.length)} đã chọn
                </span>
                <button type="button" onClick={clearSelectedCustomers} aria-label="Bỏ chọn">
                  <XMarkIcon className="h-4 w-4 font-bold text-gray-400 transition-colors hover:text-red-500" />
                </button>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <ExcelButton
              entityType={ExcelEntityType.CUSTOMER}
              onSuccess={pageAction.handleReload}
              exportOptions={{
                filters: {
                  ...pageState.filter,
                  ...pageState.ranger,
                  type: PartnerType.CUSTOMER,
                  ids: selectedCustomerIds,
                  keyword,
                  sortBy,
                  sortOrder,
                  isOrganization: partnerFilter.organization,
                  gender: partnerFilter.gender.length ? partnerFilter.gender : undefined,
                  states: partnerFilter.states.length ? partnerFilter.states : undefined,
                  wards: partnerFilter.wards.length ? partnerFilter.wards : undefined,
                },
                filename: "danh_sach_khach_hang_",
              }}
            />
            {hasSelectedCustomers && removeMany && (
              <Dropdown
                trigger={["click"]}
                placement="bottomRight"
                menu={{
                  items: [
                    {
                      key: "delete",
                      label: "Xóa",
                      danger: true,
                      icon: <TrashIcon className="h-4 w-4" />,
                      onClick: handleDeleteSelected,
                    },
                  ],
                }}
              >
                <Button
                  htmlType="button"
                  className="p-0 px-2"
                  aria-label="Thao tác khách hàng đã chọn"
                >
                  <EllipsisHorizontalIcon className="h-5 w-5" />
                </Button>
              </Dropdown>
            )}
            <AddButton onOpenAdd={handlers.handleOpenAdd} />
          </div>
        </div>
        <Panel className="min-h-0 flex-1 !p-1">
          <CustomerTable
            dataSource={data}
            loading={loading}
            pagination={pagination}
            setPage={setPage}
            setSize={setSize}
            onEdit={handlers.handleOpenEdit}
            onViewDetail={handlers.handleOpenDetail}
            onDelete={handlers.handleDelete}
            rowSelection={{
              type: "checkbox",
              selectedRowKeys: selectedCustomerIds,
              onChange: (_selectedRowKeys, selectedRows) => {
                setSelectedCustomers(selectedRows as Partner[]);
              },
            }}
          />
        </Panel>
      </div>
      <CustomerAddUpdateModal
        open={open}
        editData={rowData}
        loading={creating || updating}
        errors={store.errors}
        onAdd={create}
        onEdit={update}
        onClose={() => pageAction.handleClose(false)}
      />
      <PartnerDetailModal
        open={openDetail}
        data={rowData}
        onClose={pageAction.handleClose}
        onOpenUpdate={
          update && getById
            ? () => {
                setOpen(true);
                setOpenDetail(false);
              }
            : undefined
        }
      />
    </div>
  );
};

export default CustomerPage;
