import React, { useState } from "react";
import { App, Button, Dropdown } from "antd";
import { AddButton, Panel, SearchInput } from "@/shared/components";
import { PanelFilter } from "@/shared/components/filters";
import { ExcelButton, ExcelEntityType } from "@/modules/excel";
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
  Partner,
  PartnerType,
} from "./partner.model";
import { useSupplierStore } from "./partner.store";
import { usePartnerBusinessPage } from "./partnerBusinessPage.hook";
import { PartnerDetailModal, SupplierAddUpdateModal, SupplierTable } from "./components";

const SupplierPage: React.FC = () => {
  const { modal } = App.useApp();
  const { pageState, store, handlers, partnerFilter } = usePartnerBusinessPage(
    useSupplierStore,
    PartnerType.SUPPLIER,
  );
  const sortItems = getSortItems(PartnerType.SUPPLIER);
  const filterUses = getFilterUses(PartnerType.SUPPLIER);
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
  const [selectedSuppliers, setSelectedSuppliers] = useState<Partner[]>([]);
  const rangerItems = getRangerItems(PartnerType.SUPPLIER);
  const filterActive = isFilterActive || partnerFilter.isActive;
  const selectedSupplierIds = selectedSuppliers.map((supplier) => supplier.id);
  const hasSelectedSuppliers = selectedSupplierIds.length > 0;

  const clearSelectedSuppliers = () => setSelectedSuppliers([]);

  const handleDeleteSelected = () => {
    if (!removeMany || !hasSelectedSuppliers) return;

    modal.confirm({
      centered: true,
      title: "Xóa nhà cung cấp",
      content: `Bạn có chắc muốn xóa ${selectedSuppliers.length} nhà cung cấp đã chọn?`,
      okText: "Xóa",
      okButtonProps: { danger: true },
      cancelText: "Hủy",
      onOk: () =>
        removeMany(selectedSupplierIds, {
          onSuccess: clearSelectedSuppliers,
        }),
    });
  };
  const organizationKey =
    partnerFilter.organization === undefined
      ? []
      : [partnerFilter.organization ? "organization" : "individual"];

  return (
    <div className="flex h-full w-full gap-3" aria-label="Nhà cung cấp">
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
        ]}
      />
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <SearchInput value={keyword} onSearch={pageAction.handleSearch} />
            {hasSelectedSuppliers && (
              <div className="flex shrink-0 items-center gap-1">
                <span className="text-sm text-gray-500">
                  {formatQuantity(selectedSuppliers.length)} đã chọn
                </span>
                <button type="button" onClick={clearSelectedSuppliers} aria-label="Bỏ chọn">
                  <XMarkIcon className="h-4 w-4 font-bold text-gray-400 transition-colors hover:text-red-500" />
                </button>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <ExcelButton
              entityType={ExcelEntityType.SUPPLIER}
              onSuccess={pageAction.handleReload}
              exportOptions={{
                filters: {
                  ...pageState.filter,
                  ...pageState.ranger,
                  type: PartnerType.SUPPLIER,
                  ids: selectedSupplierIds,
                  keyword,
                  sortBy,
                  sortOrder,
                  isOrganization: partnerFilter.organization,
                  states: partnerFilter.states.length ? partnerFilter.states : undefined,
                  wards: partnerFilter.wards.length ? partnerFilter.wards : undefined,
                },
                filename: "danh_sach_nha_cung_cap_",
              }}
            />
            {hasSelectedSuppliers && removeMany && (
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
                  aria-label="Thao tác nhà cung cấp đã chọn"
                >
                  <EllipsisHorizontalIcon className="h-5 w-5" />
                </Button>
              </Dropdown>
            )}
            <AddButton onOpenAdd={handlers.handleOpenAdd} />
          </div>
        </div>
        <Panel className="min-h-0 flex-1 !p-1">
          <SupplierTable
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
              selectedRowKeys: selectedSupplierIds,
              onChange: (_selectedRowKeys, selectedRows) => {
                setSelectedSuppliers(selectedRows as Partner[]);
              },
            }}
          />
        </Panel>
      </div>
      <SupplierAddUpdateModal
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

export default SupplierPage;
