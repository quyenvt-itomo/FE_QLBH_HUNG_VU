import { App } from "antd";
import { JobPosition } from "./jobPosition.model";
import { HandlersInput } from "@/shared/interfaces/common";

export function useJobPositionHandlers({
  create,
  update,
  remove,
  getById,
  setOpen,
  setRowData,
}: HandlersInput<JobPosition>) {
  const { modal } = App.useApp();

  const handleOpenAdd = create
    ? () => {
        setRowData(undefined);
        setOpen?.(true);
      }
    : undefined;

  const handleOpenEdit = update
    ? (record: JobPosition) => {
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
    ? (record: JobPosition) => {
        modal.confirm({
          centered: true,
          title: "Xóa vị trí",
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
