import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { RootState } from "../../stores";
import { BaseState } from "../../stores/baseReducers";
import { IStoreTransfer } from "../../models/storeTransfer";
import {
  addItem,
  getAll,
  getItem,
  updateItem,
  deleteItem,
  reset,
  resetItem,
  resetNewData,
} from "../../stores/storeTransfer/slice";
import { useEffect } from "react";
import { useClientData } from "../core/useClientData";
import { UseDataParams } from "../../models/base/interface";
import { checkPermission } from "../../utils/permissionUtils";

export const useStoreTransferData = ({
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
  onCloseModal,
}: UseDataParams) => {
  const dispatch = useDispatch();
  const {
    data: storeTransfers,
    dataById: storeTransfer,
    newData: newStoreTransfer,
    deletedId,
    summary,
    errors,
    loading,
    pagination,
    isCheckAdd,
    isCheckDelete,
    isCheckUpdate,
  } = useSelector(
    (state: RootState) => state.StoreTransfer as BaseState<IStoreTransfer>,
    shallowEqual,
  );
  const { info, permissions } = useClientData();

  const fetchStoreTransferData = () => {
    if (isLockHook || !checkPermission(permissions, "storeTransfer", "read")) return;
    dispatch(
      getAll({
        page,
        size,
        keyword,
        startAt,
        endAt,
        sortBy,
        sortOrder,
        ...filter,
        ...ranger,
        ...search,
      }),
    );
  };

  const addStoreTransfer = checkPermission(permissions, "storeTransfer", "create")
    ? (newStoreTransfer: IStoreTransfer) => {
        dispatch(addItem(newStoreTransfer));
      }
    : undefined;

  const getStoreTransfer = checkPermission(permissions, "storeTransfer", "read")
    ? (id: string) => {
        dispatch(getItem(id));
      }
    : undefined;

  const updateStoreTransfer = checkPermission(permissions, "storeTransfer", "update")
    ? (updatedStoreTransfer: Partial<IStoreTransfer>) => {
        dispatch(updateItem(updatedStoreTransfer));
      }
    : undefined;

  const deleteStoreTransfer = checkPermission(permissions, "storeTransfer", "delete")
    ? (id: string) => {
        dispatch(deleteItem(id));
      }
    : undefined;

  useEffect(() => {
    if (!id) return;
    getStoreTransfer?.(id);
  }, [id, reload, permissions]);

  useEffect(() => {
    fetchStoreTransferData();
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
    permissions,
  ]);

  useEffect(() => {
    if (!storeTransfer) return;
    dispatch(resetItem());
  }, [storeTransfer]);

  useEffect(() => {
    if (!newStoreTransfer) return;
    dispatch(resetNewData());
  }, [newStoreTransfer]);

  useEffect(() => {
    if (!isCheckAdd && !isCheckDelete && !isCheckUpdate) return;

    fetchStoreTransferData();
    dispatch(reset());
    onCloseModal?.({
      isAdded: isCheckAdd,
      isUpdated: isCheckUpdate,
      isDeleted: isCheckDelete,
    });
  }, [isCheckAdd, isCheckDelete, isCheckUpdate]);

  return {
    storeTransfers,
    storeTransfer,
    newStoreTransfer,
    deletedId,
    summary,
    errors,
    loading,
    pagination,
    isCheckAdd,
    isCheckUpdate,
    isCheckDelete,
    addStoreTransfer,
    getStoreTransfer,
    updateStoreTransfer,
    deleteStoreTransfer,
  };
};
