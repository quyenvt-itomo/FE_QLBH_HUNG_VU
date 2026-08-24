import React, { useState } from "react";
import { AddButton, Panel, SearchInput } from "@/shared";
import { usePageState } from "@/shared/hooks/usePageState";
import { Attribute } from "./attribute.model";
import { useAttributeStore } from "./attribute.store";
import { AttributeType, attributeTypeMap } from "./attribute.enum";
import { useAttributeHandlers } from "./attribute.handlers";
import {
  AttributeAddUpdateModal,
  AttributeDetailModal,
  AttributeSideBar,
  AttributeTable,
} from "./components";

export const AttributePage: React.FC = () => {
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
  } = usePageState<Attribute>();
  const [type, setType] = useState<AttributeType>(AttributeType.PRODUCT_GROUP);

  const { data, loading, creating, updating, errors, pagination, getById, create, update, remove } =
    useAttributeStore(
      { page, size, keyword, sortBy, sortOrder, reload, type, showStatistics: true },
      () => pageAction.handleClose(),
    );
  const { handleOpenAdd, handleOpenEdit, handleOpenDetail, handleDelete } = useAttributeHandlers({
    getById,
    create,
    update,
    remove,
    setOpen,
    setOpenDetail,
    setRowData,
  });

  const handleTypeChange = (nextType: AttributeType) => {
    setType(nextType);
    setPage(1);
  };

  return (
    <div className="flex flex-col w-full h-full gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col">
          <h2 className="text-lg leading-4 font-bold text-blue-800">Danh mục</h2>
          <p className="text-xs text-secondary">
            Quản lý danh mục hàng hóa, đơn vị tính, hạng mục thu chi, nhóm đối tác
          </p>
        </div>
      </div>
      <div className="flex h-[calc(100%-44px)] w-full gap-3">
        <AttributeSideBar activeType={type} onTypeChange={handleTypeChange} />

        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold">{attributeTypeMap[type]}</h2>
            <div className="flex items-center gap-3">
              <SearchInput value={keyword} onSearch={pageAction.handleSearch} maxWidth={340} />
              <AddButton onOpenAdd={handleOpenAdd} />
            </div>
          </div>

          <Panel className="p-1 h-[calc(100%-44px)] rounded-lg">
            <AttributeTable
              dataSource={data}
              type={type}
              loading={loading}
              pagination={pagination}
              setPage={setPage}
              setSize={setSize}
              onEdit={handleOpenEdit}
              onViewDetail={handleOpenDetail}
              onDelete={handleDelete}
            />
          </Panel>
        </div>

        <AttributeAddUpdateModal
          open={open}
          editData={rowData}
          type={type}
          loading={creating || updating}
          errors={errors}
          onAdd={create}
          onEdit={update}
          onClose={() => pageAction.handleClose(false)}
        />
        <AttributeDetailModal open={openDetail} data={rowData} onClose={pageAction.handleClose} />
      </div>
    </div>
  );
};

export default AttributePage;
