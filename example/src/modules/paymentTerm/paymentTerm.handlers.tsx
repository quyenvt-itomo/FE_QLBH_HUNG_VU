import { App } from "antd";
import { PaymentTerm } from "./paymentTerm.model";
import { HandlersInput } from "@/shared/interfaces/common";

export function usePaymentTermHandlers({
  create,
  update,
  remove,
  getById,
  setOpen,
  setOpenDetail,
  setRowData,
}: HandlersInput<PaymentTerm>) {
  const { modal } = App.useApp();
  return {
    handleOpenDetail: (r: PaymentTerm) => {
      if (getById)
        getById(r.id, {
          onSuccess: (d) => {
            if (d) {
              setRowData(d);
              setOpenDetail?.(true);
            }
          },
        });
      else {
        setRowData(r);
        setOpenDetail?.(true);
      }
    },
    handleOpenAdd: create
      ? () => {
          setRowData(undefined);
          setOpen?.(true);
        }
      : undefined,
    handleOpenEdit: update
      ? (r: PaymentTerm) => {
          getById?.(r.id, {
            onSuccess: (d) => {
              if (d) {
                setRowData(d);
                setOpen?.(true);
              }
            },
          });
        }
      : undefined,
    handleDelete: remove
      ? (r: PaymentTerm) => {
          modal.confirm({
            centered: true,
            title: "Xóa",
            content: `Xóa "${r.code}"?`,
            okText: "Xóa",
            okButtonProps: { danger: true },
            cancelText: "Hủy",
            onOk: () => remove(r.id),
          });
        }
      : undefined,
    handleCancel: undefined,
    handleEditFromDetail: update
      ? () => {
          setOpenDetail?.(false);
          setOpen?.(true);
        }
      : undefined,
  };
}
