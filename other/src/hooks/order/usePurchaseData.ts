import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { RootState } from "../../stores";
import { BaseState } from "../../stores/baseReducers";
import { IOrder } from "../../models/store/order";
import {
  addItem,
  getAll,
  getItem,
  updateItem,
  deleteItem,
  reset,
  resetItem,
  resetNewData,
} from "../../stores/purchase/slice";
import { useEffect } from "react";
import { useClientData } from "../core/useClientData";
import { UseDataParams } from "../../models/base/interface";
import { checkPermission } from "../../utils/permissionUtils";

export const usePurchaseData = ({
  id,
  keyword,
  page,
  size,
  startAt,
  endAt,
  isLockHook,
  sortBy,
  sortOrder,
  filter,
  ranger,
  search,
  reload,
  storeId,
  onCloseModal,
}: UseDataParams) => {
  const dispatch = useDispatch();
  const {
    data: purchases,
    dataById: purchase,
    newData: newPurchase,
    deletedId,
    summary,
    errors,
    loading,
    pagination,
    isCheckAdd,
    isCheckDelete,
    isCheckUpdate,
  } = useSelector((state: RootState) => state.Purchase as BaseState<IOrder>, shallowEqual);
  const { permissions } = useClientData();

  const fetchPurchaseData = () => {
    if (isLockHook || !checkPermission(permissions, "purchaseOrder", "read")) return;
    dispatch(
      getAll({
        page,
        size,
        keyword,
        startAt,
        endAt,
        sortBy,
        sortOrder,
        storeId,
        ...filter,
        ...ranger,
        ...search,
      }),
    );
  };

  const addPurchase = checkPermission(permissions, "purchaseOrder", "create")
    ? (newPurchase: IOrder) => {
        dispatch(addItem(newPurchase));
      }
    : undefined;

  const getPurchase = checkPermission(permissions, "purchaseOrder", "read")
    ? (id: string) => {
        dispatch(getItem(id));
      }
    : undefined;

  const updatePurchase = checkPermission(permissions, "purchaseOrder", "update")
    ? (updatedPurchase: Partial<IOrder>) => {
        dispatch(updateItem(updatedPurchase));
      }
    : undefined;

  const deletePurchase = checkPermission(permissions, "purchaseOrder", "delete")
    ? (id: string) => {
        dispatch(deleteItem(id));
      }
    : undefined;

  useEffect(() => {
    if (!id) return;
    getPurchase?.(id);
  }, [id, reload, permissions]);

  useEffect(() => {
    fetchPurchaseData();
  }, [
    dispatch,
    page,
    size,
    keyword,
    startAt,
    endAt,
    isLockHook,
    sortBy,
    sortOrder,
    filter,
    reload,
    ranger,
    storeId,
    permissions,
  ]);

  useEffect(() => {
    if (!purchase) return;
    dispatch(resetItem());
  }, [purchase]);

  useEffect(() => {
    if (!newPurchase) return;
    dispatch(resetNewData());
  }, [newPurchase]);

  useEffect(() => {
    if (!isCheckAdd && !isCheckDelete && !isCheckUpdate) return;

    fetchPurchaseData();
    dispatch(reset());
    onCloseModal?.();
  }, [isCheckAdd, isCheckDelete, isCheckUpdate]);

  return {
    purchases,
    purchase,
    newPurchase,
    deletedId,
    summary,
    errors,
    loading,
    pagination,
    isCheckAdd,
    isCheckUpdate,
    isCheckDelete,
    addPurchase,
    getPurchase,
    updatePurchase,
    deletePurchase,
  };
};
