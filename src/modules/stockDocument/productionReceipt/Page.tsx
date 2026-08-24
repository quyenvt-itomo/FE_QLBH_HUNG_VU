import React, { useState } from "react";

import { usePageState } from "@/shared/hooks/usePageState";
import { SortOrder } from "@/shared/constants/enum";
import { Panel } from "@/shared/components";

import { useStockDocumentStore } from "../stockDocument.store";
import { StockDocument, StockDocumentType } from "../stockDocument.model";
import { Table, AddUpdateModal, DetailModal, ConfirmImportModal } from "./components";
import { useStockDocumentHandlers } from "../stockDocument.handlers";
import { filterUses } from "./filterItem";

const ProductionReceiptPage: React.FC = () => {
  const type = StockDocumentType.PRODUCTION_RECEIPT;
  const { keyword, page, size, setPage, setSize } = usePageState<StockDocument>({
    sortBy: "effectiveDate",
    sortOrder: SortOrder.DESC,
    filterUses,
  });
  const [open, setOpen] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [openConfirmImport, setOpenConfirmImport] = useState(false);
  const [rowData, setRowData] = useState<StockDocument>();

  const { data, loading, pagination, getById, create, update, remove, confirmImport } =
    useStockDocumentStore({ keyword, page, size, type }, () => {
      setOpen(false);
      setOpenDetail(false);
      setOpenConfirmImport(false);
    });

  const {
    handleOpenAdd,
    handleOpenEdit,
    handleOpenDetail,
    handleDelete,
    handleOpenConfirmImport,
    handleEditFromDetail,
  } = useStockDocumentHandlers({
    getById,
    update,
    remove,
    setOpen,
    setOpenDetail,
    setRowData,
    setOpenConfirmImport,
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
          onImport={handleOpenConfirmImport}
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
      <ConfirmImportModal
        open={openConfirmImport}
        data={rowData}
        loading={false}
        onClose={() => setOpenConfirmImport(false)}
        onConfirm={() => {
          // confirmImport?.(rowData?.id || "");
          setOpenConfirmImport(false);
        }}
      />
    </>
  );
};
export default ProductionReceiptPage;
