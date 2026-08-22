import { App } from "antd";
import { User } from "./user.model";
import { HandlersInput } from "@/shared/interfaces/common";

export function useUserHandlers({
  create,
  update,
  remove,
  getById,
  setOpen,
  setRowData,
}: HandlersInput<User>) {
  const { modal } = App.useApp();

  const handleOpenAdd = create
    ? () => {
        setRowData(undefined);
        setOpen?.(true);
      }
    : undefined;

  const handleOpenEdit = update
    ? (record: User) => {
        getById?.(record.id, {
          onSuccess: (data) => {
            if (!data) return;
            setRowData(data);
            setOpen?.(true);
          },
        });
      }
    : undefined;

  const handleDelete = remove
    ? (record: User) => {
        modal.confirm({
          centered: true,
          title: "Xóa người dùng",
          content: `Bạn có chắc muốn xóa "${record.name}"?`,
          okText: "Xóa",
          okButtonProps: { danger: true },
          cancelText: "Hủy",
          onOk: () => remove(record.id),
        });
      }
    : undefined;

  return { handleOpenAdd, handleOpenEdit, handleDelete } as const;
}
