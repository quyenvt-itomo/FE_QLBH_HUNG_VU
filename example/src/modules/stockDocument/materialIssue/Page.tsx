import React, { useState } from "react";

import { usePageState } from "@/shared/hooks/usePageState";
import { SortOrder } from "@/shared/constants/enum";
import { Panel } from "@/shared/components/display/Panel";

import { useStockDocumentStore } from "../stockDocument.store";
import { StockDocument, StockDocumentType } from "../stockDocument.model";
import { Table, AddUpdateModal, DetailModal, ConfirmExportModal } from "./components";
import { useStockDocumentHandlers } from "../stockDocument.handlers";
import { filterUses } from "./filterItem";

const MaterialIssuePage: React.FC = () => {
  const type = StockDocumentType.MATERIAL_ISSUE;
  const { keyword, page, size, setPage, setSize } = usePageState<StockDocument>({
    sortBy: "effectiveDate",
    sortOrder: SortOrder.DESC,
    filterUses,
  });
  const [open, setOpen] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [openConfirmExport, setOpenConfirmExport] = useState(false);
  const [rowData, setRowData] = useState<StockDocument>();

  const { data, loading, pagination, getById, create, update, remove, confirmExport } =
    useStockDocumentStore({ keyword, page, size, type }, () => {
      setOpen(false);
      setOpenDetail(false);
      setOpenConfirmExport(false);
    });

  const {
    handleOpenAdd,
    handleOpenEdit,
    handleOpenDetail,
    handleDelete,
    handleOpenConfirmExport,
    handleEditFromDetail,
  } = useStockDocumentHandlers({
    getById,
    update,
    remove,
    setOpen,
    setOpenDetail,
    setRowData,
    setOpenConfirmExport,
  });

  return (
    <>
      <Panel>
        <Table
          dataSource={data}
          loading={loading}
          pagination={pagination}
          setPage={setPage}
          setSize={setSize}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          onViewDetail={handleOpenDetail}
          onExport={handleOpenConfirmExport}
        />
      </Panel>
      <AddUpdateModal
        open={open}
        editData={rowData}
        loading={false}
        errors={null}
        onAdd={create}
        onEdit={update}
        onClose={() => setOpen(false)}
      />
      <DetailModal
        open={openDetail}
        data={rowData}
        onClose={() => setOpenDetail(false)}
        onOpenUpdate={handleEditFromDetail}
      />
      <ConfirmExportModal
        open={openConfirmExport}
        data={rowData}
        loading={false}
        onClose={() => setOpenConfirmExport(false)}
        onConfirm={() => {
          // confirmExport?.(rowData?.id || "");
          setOpenConfirmExport(false);
        }}
      />
    </>
  );
};
export default MaterialIssuePage;
