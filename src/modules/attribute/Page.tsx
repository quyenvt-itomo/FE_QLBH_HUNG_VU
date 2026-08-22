import React from "react";
import { usePageState } from "@/shared/hooks/usePageState";
import { SearchInput } from "@/shared/components/input";
import { useAttributeStore } from "./attribute.store";
import { Attribute } from "./attribute.model";
import AddButton from "@/shared/components/button/AddButton";
import { Panel } from "@/shared/components/display/Panel";
import { useAttributeHandlers } from "./attribute.handlers";
import { AttributeTable, AttributeAddUpdateModal, AttributeDetailModal } from "./components";

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
  const { data, loading, creating, updating, errors, pagination, getById, create, update, remove } =
    useAttributeStore({ page, size, keyword, sortBy, sortOrder, reload }, () =>
      pageAction.handleClose(),
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

  return (
    <div className="flex flex-col h-full w-full gap-1">
      <div className="flex justify-between items-start gap-3">
        <div className="flex flex-col">
          <h2 className="text-xl font-bold text-blue-800">Thuộc tính</h2>
          <p className="text-xs text-secondary">Quản lý thuộc tính</p>
        </div>
        <div className="flex items-center gap-3">
          <SearchInput value={keyword} onSearch={pageAction.handleSearch} maxWidth={340} />
          <AddButton onOpenAdd={handleOpenAdd} />
        </div>
      </div>
      <Panel>
        <AttributeTable
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
      <AttributeAddUpdateModal
        open={open}
        editData={rowData}
        loading={creating || updating}
        errors={errors}
        onAdd={create}
        onEdit={update}
        onClose={() => pageAction.handleClose(false)}
      />
      <AttributeDetailModal open={openDetail} data={rowData} onClose={pageAction.handleClose} />
    </div>
  );
};

export default AttributePage;
