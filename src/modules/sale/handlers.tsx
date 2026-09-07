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
  complete?: (id: string) => Promise<void>;
  completeMany?: (ids: string[]) => Promise<void>;
  cancel?: (id: string, reason?: string) => Promise<void>;
  cancelMany?: (ids: string[], reason?: string) => Promise<void>;
  removeMany?: (ids: string[], opts?: { onSuccess?: () => void }) => void;
  getAll?: (params?: Record<string, unknown>) => Promise<Sale[]>;
  print?: (records: Sale[]) => void;
  setDefaultData?: (data: Partial<Sale> | undefined) => void;
};

export const useSaleHandlers = ({
  create,
  update,
  remove,
  removeMany,
  getById,
  complete,
  completeMany,
  cancel,
  cancelMany,
  getAll,
  print,
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
  const handleComplete = complete
    ? (record: Sale) => {
        if (!record._actions?.complete?.can) return;
        withDetails(record, (data) =>
          modal.confirm({
            centered: true,
            title: "Hoàn thành đơn bán hàng",
            content: `Bạn có chắc muốn hoàn thành đơn ${data.code}?`,
            okText: "Hoàn thành",
            cancelText: "Đóng",
            onOk: () => complete(data.id),
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

  const handlePrint = (record: Sale) => {
    withDetails(record, (data) => {
      print?.([data]);
    });
  };

  const handlePrintMany = async (records: Sale[]) => {
    const ids = records.map((record) => record.id).filter(Boolean);
    if (!ids.length) return;
    const details = getAll
      ? await getAll({ ids, page: 1, size: 10000, useFullDetail: true })
      : records;
    print?.(details);
  };

  const handleDeleteMany = (records: Sale[]) => {
    const eligible = records.filter((record) => record._actions?.delete?.can);
    if (!eligible.length || !removeMany) return;
    modal.confirm({
      centered: true,
      title: "Xóa nhiều đơn bán hàng",
      content: `Bạn có chắc muốn xóa ${eligible.length} đơn bán hàng đã chọn?`,
      okText: "Xóa",
      okButtonProps: { danger: true },
      cancelText: "Hủy",
      onOk: () =>
        removeMany(eligible.map((record) => record.id), {
          onSuccess: () => eligible.forEach((record) => removeCachedOrder(record.id)),
        }),
    });
  };

  const handleCancelMany = (records: Sale[]) => {
    const eligible = records.filter((record) => record._actions?.cancel?.can);
    if (!eligible.length || !cancelMany) return;
    modal.confirm({
      centered: true,
      title: "Hủy nhiều đơn bán hàng",
      content: `Bạn có chắc muốn hủy ${eligible.length} đơn bán hàng đã chọn?`,
      okText: "Hủy đơn",
      okButtonProps: { danger: true },
      cancelText: "Đóng",
      onOk: () => cancelMany(eligible.map((record) => record.id)),
    });
  };

  const handleCompleteMany = (records: Sale[]) => {
    const eligible = records.filter((record) => record._actions?.complete?.can);
    if (!eligible.length || !completeMany) return;
    modal.confirm({
      centered: true,
      title: "Hoàn thành nhiều đơn bán hàng",
      content: `Bạn có chắc muốn hoàn thành ${eligible.length} đơn bán hàng đã chọn?`,
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
    handlePrint,
    handlePrintMany,
    handleDeleteMany,
    handleCancelMany,
    handleCompleteMany,
  };
};
