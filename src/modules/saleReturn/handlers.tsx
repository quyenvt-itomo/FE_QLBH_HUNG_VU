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
  complete?: (id: string) => Promise<void>;
  completeMany?: (ids: string[]) => Promise<void>;
  cancel?: (id: string, reason?: string) => Promise<void>;
  cancelMany?: (ids: string[], reason?: string) => Promise<void>;
  removeMany?: (ids: string[], opts?: { onSuccess?: () => void }) => void;
  onOpenSourcePicker?: () => void;
};

export const useSaleReturnHandlers = ({
  update,
  create,
  remove,
  getById,
  complete,
  completeMany,
  cancel,
  cancelMany,
  removeMany,
  setOpenDetail,
  setRowData,
  onOpenSourcePicker,
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
    navigate(`${privateRoutesName.pos}?type=sale_return&editId=${data.id}`, {
      state: { order: data },
    });
  };
  const handleOpenAdd = create ? () => onOpenSourcePicker?.() : undefined;
  const handleOpenDetail = (record: SaleReturn) =>
    withDetails(record, (data) => {
      setRowData(data);
      setOpenDetail?.(true);
    });
  const handleOpenEdit = update
    ? (record: SaleReturn) => {
        withDetails(record, openPos);
      }
    : undefined;
  const handleDelete = remove
    ? (record: SaleReturn) => {
        if (record.status !== OrderStatus.DRAFT) return;
        withDetails(record, (data) =>
          modal.confirm({
            centered: true,
            title: "Xóa phiếu trả hàng",
            content: `Bạn có chắc muốn xóa phiếu ${data.code}?`,
            okText: "Xóa",
            okButtonProps: { danger: true },
            cancelText: "Hủy",
            onOk: () => remove(data.id, { onSuccess: () => removeCachedOrder(data.id) }),
          }),
        );
      }
    : undefined;
  const handleCancel = cancel
    ? (record: SaleReturn) => {
        if (record.status === OrderStatus.CANCELED) return;
        withDetails(record, (data) =>
          modal.confirm({
            centered: true,
            title: "Hủy phiếu trả hàng",
            content: `Bạn có chắc muốn hủy phiếu ${data.code}?`,
            okText: "Hủy phiếu",
            okButtonProps: { danger: true },
            cancelText: "Đóng",
            onOk: () => cancel(data.id).then(() => removeCachedOrder(data.id)),
          }),
        );
      }
    : undefined;
  const handleComplete = complete
    ? (record: SaleReturn) => {
        if (!record._actions?.complete?.can) return;
        withDetails(record, (data) =>
          modal.confirm({
            centered: true,
            title: "Hoàn thành phiếu trả hàng",
            content: `Bạn có chắc muốn hoàn thành phiếu ${data.code}?`,
            okText: "Hoàn thành",
            cancelText: "Đóng",
            onOk: () => complete(data.id),
          }),
        );
      }
    : undefined;
  const handleEditFromDetail = handleOpenEdit
    ? (record: SaleReturn) => {
        setOpenDetail?.(false);
        handleOpenEdit(record);
      }
    : undefined;

  const handleDeleteMany = (records: SaleReturn[]) => {
    const eligible = records.filter((record) => record._actions?.delete?.can);
    if (!eligible.length || !removeMany) return;
    modal.confirm({
      centered: true,
      title: "Xóa nhiều phiếu trả hàng",
      content: `Bạn có chắc muốn xóa ${eligible.length} phiếu đã chọn?`,
      okText: "Xóa",
      okButtonProps: { danger: true },
      cancelText: "Hủy",
      onOk: () => removeMany(eligible.map((record) => record.id)),
    });
  };

  const handleCancelMany = (records: SaleReturn[]) => {
    const eligible = records.filter((record) => record._actions?.cancel?.can);
    if (!eligible.length || !cancelMany) return;
    modal.confirm({
      centered: true,
      title: "Hủy nhiều phiếu trả hàng",
      content: `Bạn có chắc muốn hủy ${eligible.length} phiếu đã chọn?`,
      okText: "Hủy phiếu",
      okButtonProps: { danger: true },
      cancelText: "Đóng",
      onOk: () => cancelMany(eligible.map((record) => record.id)),
    });
  };

  const handleCompleteMany = (records: SaleReturn[]) => {
    const eligible = records.filter((record) => record._actions?.complete?.can);
    if (!eligible.length || !completeMany) return;
    modal.confirm({
      centered: true,
      title: "Hoàn thành nhiều phiếu trả hàng",
      content: `Bạn có chắc muốn hoàn thành ${eligible.length} phiếu đã chọn?`,
      okText: "Hoàn thành",
      cancelText: "Đóng",
      onOk: () => completeMany(eligible.map((record) => record.id)),
    });
  };

  return {
    handleOpenAdd,
    handleOpenDetail,
    handleOpenEdit,
    handleDelete,
    handleComplete,
    handleCancel,
    handleEditFromDetail,
    handleDeleteMany,
    handleCompleteMany,
    handleCancelMany,
  };
};
