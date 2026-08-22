import { App } from "antd";
import { Service } from "./service.model";
import { HandlersInput } from "@/shared/interfaces/common";

export function useServiceHandlers({
  create,
  update,
  remove,
  getById,
  setOpen,
  setOpenDetail,
  setRowData,
}: HandlersInput<Service>) {
  const { modal } = App.useApp();

  const handleOpenDetail = (record: Service) => {
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
    ? (record: Service) => {
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
    ? (record: Service) => {
        modal.confirm({
          centered: true,
          title: "Xóa dịch vụ",
          content: `Bạn có chắc muốn xóa dịch vụ "${record.code}"?`,
          okText: "Xóa",
          okButtonProps: { danger: true },
          cancelText: "Hủy",
          onOk: () => remove(record.id),
        });
      }
    : undefined;

  const handleEditFromDetail = update
    ? () => {
        setOpenDetail?.(false);
        setOpen?.(true);
      }
    : undefined;

  return {
    handleOpenAdd,
    handleOpenEdit,
    handleOpenDetail,
    handleDelete,
    handleCancel: undefined,
    handleEditFromDetail,
  };
}
