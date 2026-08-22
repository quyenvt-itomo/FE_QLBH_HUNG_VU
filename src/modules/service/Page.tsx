import React from "react";
import { usePageState } from "@/shared/hooks/usePageState";
import { SearchInput } from "@/shared/components/input";
import AddButton from "@/shared/components/button/AddButton";
import { Panel } from "@/shared/components/display/Panel";
import { ExcelButton, ExcelEntityType } from "@/modules/excel";
import { useExcelReload } from "@/shared/hooks/useExcelReload";
import { Tabs } from "antd";

import { useServiceStore } from "./service.store";
import { useServiceHandlers } from "./service.handlers";
import { Service, serviceTypeOptions } from "./service.model";
import { ServiceTable, ServiceAddUpdateModal, ServiceDetailModal } from "./components";

export const statusItems = [{ label: "Tất cả", key: "all", value: "all" }, ...serviceTypeOptions];

export const ServicePage: React.FC = () => {
  const {
    keyword,
    page,
    size,
    sortBy,
    sortOrder,
    type,
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
  } = usePageState<Service>();

  const { data, loading, creating, updating, errors, pagination, getById, create, update, remove } =
    useServiceStore(
      {
        page,
        size,
        keyword,
        sortBy,
        sortOrder,
        reload,
        type: type === "all" ? undefined : (type as any),
      },
      () => pageAction.handleClose(),
    );

  useExcelReload(ExcelEntityType.SERVICE, pageAction.handleReload);

  const {
    handleOpenAdd,
    handleOpenEdit,
    handleOpenDetail,
    handleDelete,
    handleCancel,
    handleEditFromDetail,
  } = useServiceHandlers({ getById, create, update, remove, setOpen, setOpenDetail, setRowData });

  return (
    <div className="flex flex-col h-full w-full gap-1">
      <div className="flex justify-between items-start gap-3">
        <Tabs
          activeKey={type}
          onChange={pageAction.handleTypeChange}
          items={statusItems}
          className="custom-tabs"
        />
        <div className="flex items-center gap-3">
          <SearchInput value={keyword} onSearch={pageAction.handleSearch} maxWidth={340} />
          <ExcelButton
            entityType={ExcelEntityType.SERVICE}
            onSuccess={pageAction.handleReload}
            exportOptions={{ filename: "Danh_sach_dich_vu_" }}
          />
          <AddButton onOpenAdd={handleOpenAdd} />
        </div>
      </div>
      <Panel>
        <ServiceTable
          dataSource={data}
          loading={loading}
          pagination={pagination}
          setPage={setPage}
          setSize={setSize}
          onEdit={handleOpenEdit}
          onViewDetail={handleOpenDetail}
          onDelete={handleDelete}
          onCancel={handleCancel}
        />
      </Panel>
      <ServiceAddUpdateModal
        open={open}
        editData={rowData}
        loading={creating || updating}
        errors={errors}
        onAdd={create}
        onEdit={update}
        onClose={() => pageAction.handleClose(false)}
      />
      <ServiceDetailModal
        open={openDetail}
        data={rowData}
        onClose={pageAction.handleClose}
        onOpenUpdate={handleEditFromDetail}
      />
    </div>
  );
};
