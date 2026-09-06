import { App } from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { HandlersInput } from "@/shared/interfaces/common";
import { privateRoutesName } from "@/shared/constants/routerName";
import { RootState } from "@/shared/stores";
import { removeOrderCache } from "@/shared/stores/orderCache.slice";
import { OrderStatus } from "./model";
import { Sale } from "./model";

type Props = HandlersInput<Sale> & {
  cancel?: (id: string, reason?: string) => Promise<void>;
  setDefaultData?: (data: Partial<Sale> | undefined) => void;
};

export const useSaleHandlers = ({
  create,
  update,
  remove,
  getById,
  cancel,
  setOpenDetail,
  setRowData,
  setOpen,
}: Props) => {
  const { modal } = App.useApp();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cachedOrders = useSelector((state: RootState) => state.OrderCache.cachedOrders);

  const removeCachedOrder = (sourceId: string) => {
    Object.values(cachedOrders)
      .filter((cache) => cache.id === sourceId || cache.sourceId === sourceId)
      .forEach((cache) => dispatch(removeOrderCache(cache.id)));
  };

  const withDetails = (record: Sale, callback: (data: Sale) => void) => {
    if (!getById) return callback(record);
    getById(record.id, { onSuccess: (data) => data && callback(data) });
  };

  const openPos = (data?: Sale) => {
    if (data) {
      navigate(`${privateRoutesName.pos}?type=sale&editId=${data.id}`, { state: { order: data } });
      return;
    }
    navigate(`${privateRoutesName.pos}?type=sale`);
  };

  const handleOpenAdd = create ? () => openPos() : undefined;
  const handleOpenDetail = (record: Sale) =>
    withDetails(record, (data) => {
      setRowData(data);
      setOpenDetail?.(true);
    });
  const handleOpenEdit = update ? (record: Sale) => withDetails(record, openPos) : undefined;
  const handleDelete = remove
    ? (record: Sale) => {
        modal.confirm({
          centered: true,
          title: "Xóa đơn bán hàng",
          content: `Bạn có chắc muốn xóa đơn ${record.code}?`,
          okText: "Xóa",
          okButtonProps: { danger: true },
          cancelText: "Hủy",
          onOk: () => remove(record.id, { onSuccess: () => removeCachedOrder(record.id) }),
        });
      }
    : undefined;
  const handleCancel = cancel
    ? (record: Sale) => {
        if (record.status === OrderStatus.CANCELED) return;
        withDetails(record, (data) =>
          modal.confirm({
            centered: true,
            title: "Hủy đơn bán hàng",
            content: `Bạn có chắc muốn hủy đơn ${data.code}?`,
            okText: "Hủy đơn",
            okButtonProps: { danger: true },
            cancelText: "Đóng",
            onOk: () => cancel(data.id).then(() => removeCachedOrder(data.id)),
          }),
        );
      }
    : undefined;
  const handleEditFromDetail = handleOpenEdit
    ? (record: Sale) => {
        setOpenDetail?.(false);
        handleOpenEdit(record);
      }
    : undefined;

  return {
    handleOpenAdd,
    handleOpenDetail,
    handleOpenEdit,
    handleDelete,
    handleCancel,
    handleEditFromDetail,
  };
};
