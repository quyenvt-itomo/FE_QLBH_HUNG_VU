import React from "react";
import { usePageState } from "@/shared/hooks/usePageState";
import { SearchInput } from "@/shared/components/input";
import AddButton from "@/shared/components/button/AddButton";
import { Panel } from "@/shared/components/display/Panel";
import { ExcelButton, ExcelEntityType } from "@/modules/excel";
import { useExcelReload } from "@/shared/hooks/useExcelReload";

import { Warehouse } from "./warehouse.model";
import { useWarehouseStore } from "./warehouse.store";
import { useWarehouseHandlers } from "./warehouse.handlers";
import { WarehouseTable, WarehouseAddUpdateModal, WarehouseDetailModal } from "./components";

export const WarehousePage: React.FC = () => {
  const {
    keyword,
    page,
    size,
    sortBy,
    sortOrder,
    setPage,
    setSize,
    open,
    setOpen,
    openDetail,
    setOpenDetail,
    rowData,
    setRowData,
    reload,
    pageAction,
  } = usePageState<Warehouse>();
  const { data, loading, creating, updating, errors, pagination, getById, create, update, remove } =
    useWarehouseStore({ page, size, keyword, sortBy, sortOrder, reload }, () =>
      pageAction.handleClose(),
    );

  useExcelReload(ExcelEntityType.WAREHOUSE, pageAction.handleReload);
  const { handleOpenAdd, handleOpenEdit, handleOpenDetail, handleDelete } = useWarehouseHandlers({
    getById,
    create,
    update,
    remove,
    setOpen,
    setOpenDetail,
    setRowData,
  });

  return (
    <div className="flex flex-col h-full w-full gap-1">
      <div className="flex justify-between items-start gap-3">
        <div className="flex flex-col">
          <h2 className="text-base font-bold text-blue-800">Kho hàng</h2>
          <p className="text-xs text-secondary">Quản lý kho hàng</p>
        </div>
        <div className="flex items-center gap-3">
          <SearchInput value={keyword} onSearch={pageAction.handleSearch} maxWidth={340} />
          <ExcelButton
            entityType={ExcelEntityType.WAREHOUSE}
            onSuccess={pageAction.handleReload}
            exportOptions={{ filename: "Danh_sach_kho_" }}
          />
          <AddButton onOpenAdd={handleOpenAdd} />
        </div>
      </div>
      <Panel>
        <WarehouseTable
          dataSource={data}
          loading={loading}
          pagination={pagination}
          setPage={setPage}
          setSize={setSize}
          onEdit={handleOpenEdit}
          onViewDetail={handleOpenDetail}
          onDelete={handleDelete}
        />
      </Panel>
      <WarehouseAddUpdateModal
        open={open}
        editData={rowData}
        loading={creating || updating}
        errors={errors}
        onAdd={create}
        onEdit={update}
        onClose={() => pageAction.handleClose(false)}
      />
      <WarehouseDetailModal open={openDetail} data={rowData} onClose={pageAction.handleClose} />
    </div>
  );
};
