import React from "react";
import { App, Checkbox } from "antd";
import { OrderStatus, OrderType, Purchase } from "./purchase.model";
import { HandlersInput } from "@/shared/interfaces/common";
import { PurchaseFile } from "./purchase.file";
import { randomId } from "@/shared/utils/common.util";

type PurchaseHandlerProps = HandlersInput<Purchase> & {
  cancel?: (id: string) => Promise<void>;
  complete?: (id: string) => Promise<void>;
  setDefaultData?: (data: Partial<Purchase> | undefined) => void;
  setBarcodeData?: (data: Purchase | undefined) => void;
  documentType?: OrderType;
};

export function usePurchaseHandlers({
  create,
  update,
  remove,
  getById,
  cancel,
  complete,
  setOpen,
  setOpenDetail,
  setRowData,
  setDefaultData,
  setBarcodeData,
  documentType = OrderType.PURCHASE,
}: PurchaseHandlerProps) {
  const { modal } = App.useApp();
  const isPurchaseReturn = documentType === OrderType.PURCHASE_RETURN;
  const documentName = isPurchaseReturn ? "phiếu trả hàng nhập" : "phiếu nhập hàng";

  const withDetails = (record: Purchase, callback: (data: Purchase) => void) => {
    if (!getById) return callback(record);
    getById(record.id, { onSuccess: (data) => data && callback(data) });
  };

  const handleOpenAdd = create ? () => { setRowData(undefined); setDefaultData?.(undefined); setOpen?.(true); } : undefined;

  const handleOpenEdit = update ? (record: Purchase) => {
    if (record.status === OrderStatus.CANCELED) return;
    withDetails(record, (data) => { setRowData(data); setOpen?.(true); });
  } : undefined;

  const handleOpenDetail = (record: Purchase) => {
    withDetails(record, (data) => { setRowData(data); setOpenDetail?.(true); });
  };

  const handleDelete = remove ? (record: Purchase) => {
    if (record.status !== OrderStatus.DRAFT) return;
      withDetails(record, (data) => modal.confirm({
      centered: true,
      title: `Xóa ${documentName}`,
      content: `Bạn có chắc muốn xóa ${documentName} ${data.code}?`,
      okText: "Xóa",
      okButtonProps: { danger: true },
      cancelText: "Hủy",
      onOk: () => remove(data.id),
    }));
  } : undefined;

  const handleCancel = cancel ? (record: Purchase) => {
    if (record.status === OrderStatus.CANCELED) return;
    withDetails(record, (data) => modal.confirm({
      centered: true,
      title: `Hủy ${documentName}`,
      content: `Bạn có chắc muốn hủy ${documentName} ${data.code}?`,
      okText: "Hủy phiếu",
      okButtonProps: { danger: true },
      cancelText: "Đóng",
      onOk: () => cancel(data.id),
    }));
  } : undefined;

  const handleComplete = complete ? (record: Purchase) => {
    if (record.status !== OrderStatus.DRAFT) return;
    withDetails(record, (data) => modal.confirm({
      centered: true,
      title: isPurchaseReturn ? "Hoàn thành trả hàng" : "Nhập kho ngay",
      content: `Xác nhận ${isPurchaseReturn ? "trả hàng" : "nhập kho"} phiếu ${data.code}? Sau khi hoàn thành phiếu sẽ không thể sửa dòng hàng.`,
      okText: isPurchaseReturn ? "Hoàn thành" : "Nhập kho",
      cancelText: "Đóng",
      onOk: () => complete(data.id),
    }));
  } : undefined;

  const handleCopy = create ? (record: Purchase) => {
    withDetails(record, (data) => {
      setOpenDetail?.(false);
      setRowData(undefined);
      const sourceLines = isPurchaseReturn ? data.returnLines || [] : data.lines || [];
      setDefaultData?.({
        ...data,
        id: undefined,
        tempId: randomId(),
        code: "",
        type: documentType,
        refOrderId: null,
        refOrder: null,
        status: undefined,
        occurredAt: null,
        completerId: null,
        lines: isPurchaseReturn ? [] : sourceLines.map((line) => ({ ...line, id: undefined, tempId: randomId() })),
        returnLines: isPurchaseReturn
          ? sourceLines.map((line) => ({ ...line, id: undefined, tempId: randomId() }))
          : [],
      } as any);
      setOpen?.(true);
    });
  } : undefined;

  const confirmPriceOption = (title: string, run: (hidePrice: boolean) => void) => {
    let hidePrice = false;
    modal.confirm({
      centered: true,
      title,
      content: <Checkbox onChange={(event) => { hidePrice = event.target.checked; }}>Ẩn thông tin giá</Checkbox>,
      okText: "Thực hiện",
      cancelText: "Hủy",
      onOk: () => run(hidePrice),
    });
  };

  const handleExportExcel = (record: Purchase) => withDetails(record, (data) => confirmPriceOption(isPurchaseReturn ? "Xuất danh sách hàng hóa trả lại" : "Xuất danh sách hàng hóa", (hidePrice) => PurchaseFile.exportExcel(data, { hidePrice })));
  const handlePrint = (record: Purchase) => withDetails(record, (data) => confirmPriceOption(isPurchaseReturn ? "In phiếu trả hàng nhập" : "In phiếu nhập hàng", (hidePrice) => PurchaseFile.print(data, { hidePrice })));
  const handlePrintBarcode = (record: Purchase) => withDetails(record, (data) => {
    setBarcodeData?.(data);
    if (!setBarcodeData) {
      setRowData(data);
      setOpenDetail?.(true);
    }
  });

  const handleEditFromDetail = update ? (record: Purchase) => {
    if (record.status === OrderStatus.CANCELED) return;
    withDetails(record, (data) => {
      setOpenDetail?.(false);
      setRowData(data);
      setOpen?.(true);
    });
  } : undefined;

  return {
    handleOpenAdd,
    handleOpenEdit,
    handleOpenDetail,
    handleDelete,
    handleCancel,
    handleComplete,
    handleCopy,
    handleExportExcel,
    handlePrint,
    handlePrintBarcode,
    handleEditFromDetail,
  } as const;
}
