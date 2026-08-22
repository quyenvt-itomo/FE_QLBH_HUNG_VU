import { App, Form, Input } from "antd";
import { HandlersInput } from "@/shared/interfaces/common";
import {
  ConfirmBillingPayload,
  ConfirmExportDto,
  ConfirmImportDto,
  StockDocument,
} from "./stockDocument.model";
import { deletePendingFiles } from "@/shared/utils/file.util";

interface StockDocumentHandlerInput extends HandlersInput<StockDocument> {
  setOpenConfirmExport?: (open: boolean) => void;
  setOpenConfirmImport?: (open: boolean) => void;
  setOpenComplete?: (open: boolean) => void;

  confirmImport?: (id: string, payload: ConfirmImportDto) => Promise<StockDocument | undefined>;
  confirmExport?: (id: string, payload: ConfirmExportDto) => Promise<StockDocument | undefined>;
  complete?: (id: string, payload: ConfirmBillingPayload) => Promise<StockDocument | undefined>;
}

export function useStockDocumentHandlers({
  getById,
  remove,
  update,
  setOpen,
  setOpenDetail,
  setRowData,
  setOpenConfirmExport,
  setOpenConfirmImport,
  setOpenComplete,

  confirmImport,
  confirmExport,
  complete,
}: StockDocumentHandlerInput) {
  const { modal } = App.useApp();
  const [form] = Form.useForm<any>();

  const openWithData = (record: StockDocument, openFn?: (open: boolean) => void) => {
    if (getById) {
      getById(record.id, {
        onSuccess: (data) => {
          if (!data) return;
          setRowData(data);
          openFn?.(true);
        },
      });
      return;
    }
    setRowData(record);
    openFn?.(true);
  };

  const handleOpenAdd = () => {
    setRowData(undefined);
    setOpen?.(true);
  };

  const handleOpenEdit = update
    ? (record: StockDocument) => openWithData(record, setOpen)
    : undefined;

  const handleOpenDetail = (record: StockDocument) => openWithData(record, setOpenDetail);

  const handleDelete = remove
    ? (record: StockDocument) => {
        modal.confirm({
          centered: true,
          title: "Xóa phiếu",
          content: "Bạn có chắc muốn xóa phiếu này?",
          okText: "Xóa",
          okButtonProps: { danger: true },
          cancelText: "Hủy",
          onOk: () => remove(record.id),
        });
      }
    : undefined;

  const handleOpenConfirmExport = confirmExport
    ? (record: StockDocument) => openWithData(record, setOpenConfirmExport)
    : undefined;

  const handleOpenConfirmImport = confirmImport
    ? (record: StockDocument) => openWithData(record, setOpenConfirmImport)
    : undefined;

  const handleOpenComplete = complete
    ? (record: StockDocument) => openWithData(record, setOpenComplete)
    : undefined;

  const handleEditFromDetail = update
    ? (record: StockDocument) => {
        setOpenDetail?.(false);
        setRowData(record);
        setOpen?.(true);
      }
    : undefined;

  return {
    form,
    handleOpenAdd,
    handleOpenEdit,
    handleOpenDetail,
    handleDelete,
    handleOpenConfirmExport,
    handleOpenConfirmImport,
    handleOpenComplete,
    handleEditFromDetail,
    deletePendingFiles,
  } as const;
}
