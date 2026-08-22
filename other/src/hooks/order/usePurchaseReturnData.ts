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
} from "../../stores/purchaseReturn/slice";
import { useEffect } from "react";
import { useClientData } from "../core/useClientData";
import { UseDataParams } from "../../models/base/interface";
import { checkPermission } from "../../utils/permissionUtils";

export const usePurchaseReturnData = ({
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
    data: purchaseReturns,
    dataById: purchaseReturn,
    newData: newPurchaseReturn,
    deletedId,
    summary,
    errors,
    loading,
    pagination,
    isCheckAdd,
    isCheckDelete,
    isCheckUpdate,
  } = useSelector((state: RootState) => state.PurchaseReturn as BaseState<IOrder>, shallowEqual);
  const { info, permissions } = useClientData();

  const fetchPurchaseReturnData = () => {
    if (isLockHook || !checkPermission(permissions, "purchaseReturn", "read")) return;
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

  const addPurchaseReturn = checkPermission(permissions, "purchaseReturn", "create")
    ? (newPurchaseReturn: IOrder) => {
        dispatch(addItem(newPurchaseReturn));
      }
    : undefined;

  const getPurchaseReturn = checkPermission(permissions, "purchaseReturn", "read")
    ? (id: string) => {
        dispatch(getItem(id));
      }
    : undefined;

  const updatePurchaseReturn = checkPermission(permissions, "purchaseReturn", "update")
    ? (updatedPurchaseReturn: Partial<IOrder>) => {
        dispatch(updateItem(updatedPurchaseReturn));
      }
    : undefined;

  const deletePurchaseReturn = checkPermission(permissions, "purchaseReturn", "delete")
    ? (id: string) => {
        dispatch(deleteItem(id));
      }
    : undefined;

  useEffect(() => {
    if (!id) return;
    getPurchaseReturn?.(id);
  }, [id, reload, permissions]);

  useEffect(() => {
    fetchPurchaseReturnData();
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
    search,
    storeId,
    permissions,
  ]);

  useEffect(() => {
    if (!purchaseReturn) return;
    dispatch(resetItem());
  }, [purchaseReturn]);

  useEffect(() => {
    if (!newPurchaseReturn) return;
    dispatch(resetNewData());
  }, [newPurchaseReturn]);

  useEffect(() => {
    if (!isCheckAdd && !isCheckDelete && !isCheckUpdate) return;

    fetchPurchaseReturnData();
    dispatch(reset());
    onCloseModal?.();
  }, [isCheckAdd, isCheckDelete, isCheckUpdate]);

  return {
    purchaseReturns,
    purchaseReturn,
    newPurchaseReturn,
    deletedId,
    summary,
    errors,
    loading,
    pagination,
    isCheckAdd,
    isCheckUpdate,
    isCheckDelete,
    addPurchaseReturn,
    getPurchaseReturn,
    updatePurchaseReturn,
    deletePurchaseReturn,
  };
};
