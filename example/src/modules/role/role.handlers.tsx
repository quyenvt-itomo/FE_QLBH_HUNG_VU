import { App } from "antd";
import { Role } from "./role.model";
import { HandlersInput } from "@/shared/interfaces/common";

export function useRoleHandlers({
  create,
  update,
  remove,
  getById,
  setOpen,
  setOpenDetail,
  setRowData,
}: HandlersInput<Role>) {
  const { modal } = App.useApp();
  return {
    handleOpenDetail: (r: Role) => {
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
      ? (r: Role) => {
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
      ? (r: Role) => {
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
  };
}
