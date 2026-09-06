import { App } from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { HandlersInput } from "@/shared/interfaces/common";
import { privateRoutesName } from "@/shared/constants/routerName";
import { RootState } from "@/shared/stores";
import { removeOrderCache } from "@/shared/stores/orderCache.slice";
import { OrderStatus } from "./model";
import { SaleReturn } from "./model";

type Props = HandlersInput<SaleReturn> & {
  cancel?: (id: string, reason?: string) => Promise<void>;
};

export const useSaleReturnHandlers = ({
  update,
  create,
  remove,
  getById,
  cancel,
  setOpenDetail,
  setRowData,
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

  const withDetails = (record: SaleReturn, callback: (data: SaleReturn) => void) => {
    if (!getById) return callback(record);
    getById(record.id, { onSuccess: (data) => data && callback(data) });
  };

  const openPos = (data: SaleReturn) => {
    navigate(`${privateRoutesName.pos}?type=sale_return&editId=${data.id}`, { state: { order: data } });
  };
  const handleOpenAdd = create ? () => navigate(`${privateRoutesName.pos}?type=sale_return`) : undefined;
  const handleOpenDetail = (record: SaleReturn) => withDetails(record, (data) => {
    setRowData(data);
    setOpenDetail?.(true);
  });
  const handleOpenEdit = update ? (record: SaleReturn) => withDetails(record, openPos) : undefined;
  const handleDelete = remove ? (record: SaleReturn) => {
    if (record.status !== OrderStatus.DRAFT) return;
    withDetails(record, (data) => modal.confirm({
      centered: true,
      title: "Xóa phiếu trả hàng",
      content: `Bạn có chắc muốn xóa phiếu ${data.code}?`,
      okText: "Xóa",
      okButtonProps: { danger: true },
      cancelText: "Hủy",
      onOk: () => remove(data.id, { onSuccess: () => removeCachedOrder(data.id) }),
    }));
  } : undefined;
  const handleCancel = cancel ? (record: SaleReturn) => {
    if (record.status === OrderStatus.CANCELED) return;
    withDetails(record, (data) => modal.confirm({
      centered: true,
      title: "Hủy phiếu trả hàng",
      content: `Bạn có chắc muốn hủy phiếu ${data.code}?`,
      okText: "Hủy phiếu",
      okButtonProps: { danger: true },
      cancelText: "Đóng",
      onOk: () => cancel(data.id).then(() => removeCachedOrder(data.id)),
    }));
  } : undefined;
  const handleEditFromDetail = handleOpenEdit
    ? (record: SaleReturn) => {
        setOpenDetail?.(false);
        handleOpenEdit(record);
      }
    : undefined;

  return { handleOpenAdd, handleOpenDetail, handleOpenEdit, handleDelete, handleCancel, handleEditFromDetail };
};
