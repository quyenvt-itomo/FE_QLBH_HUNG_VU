import { App } from "antd";
import { Warehouse } from "./warehouse.model";
import { HandlersInput } from "@/shared/interfaces/common";

export function useWarehouseHandlers({
  create,
  update,
  remove,
  getById,
  setOpen,
  setOpenDetail,
  setRowData,
}: HandlersInput<Warehouse>) {
  const { modal } = App.useApp();
  return {
    handleOpenDetail: (r: Warehouse) => {
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
      ? (r: Warehouse) => {
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
      ? (r: Warehouse) => {
          modal.confirm({
            centered: true,
            title: "Xóa",
            content: `Xóa "${r.name}"?`,
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
