import { App } from "antd";
import { Employee } from "./employee.model";
import { HandlersInput } from "@/shared/interfaces/common";

export function useEmployeeHandlers({
  create,
  update,
  remove,
  getById,
  setOpen,
  setOpenDetail,
  setRowData,
}: HandlersInput<Employee>) {
  const { modal } = App.useApp();

  const handleOpenDetail = (record: Employee) => {
    if (getById) {
      getById(record.id, {
        onSuccess: (data) => {
          if (!data) return;
          setRowData(data);
          setOpenDetail?.(true);
        },
      });
    } else {
      setRowData(record);
      setOpenDetail?.(true);
    }
  };

  const handleOpenAdd = create
    ? () => {
        setRowData(undefined);
        setOpen?.(true);
      }
    : undefined;

  const handleOpenEdit = update
    ? (record: Employee) => {
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
    ? (record: Employee) => {
        modal.confirm({
          centered: true,
          title: "Xóa nhân viên",
          content: `Bạn có chắc muốn xóa nhân viên "${record.name}"?`,
          okText: "Xóa",
          okButtonProps: { danger: true },
          cancelText: "Hủy",
          onOk: () => remove(record.id),
        });
      }
    : undefined;

  return { handleOpenAdd, handleOpenEdit, handleOpenDetail, handleDelete } as const;
}
