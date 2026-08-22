import { App } from "antd";
import { Product } from "./product.model";
import { HandlersInput } from "@/shared/interfaces/common";

export function useProductHandlers({
  create,
  update,
  remove,
  getById,
  setOpen,
  setOpenDetail,
  setRowData,
}: HandlersInput<Product>) {
  const { modal } = App.useApp();

  const handleOpenDetail = (record: Product) => {
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
    ? (record: Product) => {
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
    ? (record: Product) => {
        modal.confirm({
          centered: true,
          title: "Xóa hàng hóa",
          content: `Bạn có chắc muốn xóa hàng hóa "${record.code}"?`,
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
    handleEditFromDetail,
  };
}
