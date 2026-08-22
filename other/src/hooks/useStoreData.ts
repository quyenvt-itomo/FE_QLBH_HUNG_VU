import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { RootState } from "../stores";
import { BaseState } from "../stores/baseReducers";
import { IStore } from "../models/store";
import {
  addItem,
  getAll,
  getItem,
  updateItem,
  deleteItem,
  reset,
  resetItem,
  resetNewData,
} from "../stores/store/slice";
import { useEffect } from "react";
import { useClientData } from "./core/useClientData";
import { UseDataParams } from "../models/base/interface";
import { checkPermission } from "../utils/permissionUtils";

export const useStoreData = ({
  id,
  keyword,
  page,
  size,
  startAt,
  endAt,
  isLockHook,
  status,
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
    data: stores,
    dataById: store,
    newData: newstore,
    deletedId,
    summary,
    errors,
    loading,
    pagination,
    isCheckAdd,
    isCheckDelete,
    isCheckUpdate,
  } = useSelector((state: RootState) => state.Store as BaseState<IStore>, shallowEqual);
  const { info, permissions } = useClientData();

  const fetchStoreData = () => {
    if (isLockHook || !checkPermission(permissions, "store", "read")) return;
    dispatch(
      getAll({
        page,
        size,
        keyword,
        startAt,
        endAt,
        sortBy,
        sortOrder,
        status: status === "all" ? undefined : status,
        ...filter,
        ...ranger,
        ...search,
      }),
    );
  };

  const addStore = checkPermission(permissions, "store", "create")
    ? (newstore: IStore) => {
        dispatch(addItem(newstore));
      }
    : undefined;

  const getStore = checkPermission(permissions, "store", "read")
    ? (id: string) => {
        dispatch(getItem(id));
      }
    : undefined;

  const updateStore = checkPermission(permissions, "store", "update")
    ? (updatedstore: Partial<IStore>) => {
        dispatch(updateItem(updatedstore));
      }
    : undefined;

  const deleteStore = checkPermission(permissions, "store", "delete")
    ? (id: string) => {
        dispatch(deleteItem(id));
      }
    : undefined;

  useEffect(() => {
    if (!id) return;
    getStore?.(id);
  }, [id, reload, permissions]);

  useEffect(() => {
    fetchStoreData();
  }, [
    dispatch,
    page,
    size,
    keyword,
    startAt,
    endAt,
    isLockHook,
    status,
    sortBy,
    sortOrder,
    filter,
    reload,
    ranger,
    permissions,
  ]);

  useEffect(() => {
    if (!store) return;
    dispatch(resetItem());
  }, [store]);

  useEffect(() => {
    if (!newstore) return;
    dispatch(resetNewData());
  }, [newstore]);

  useEffect(() => {
    if (!isCheckAdd && !isCheckDelete && !isCheckUpdate) return;

    fetchStoreData();
    dispatch(reset());
    onCloseModal?.();
  }, [isCheckAdd, isCheckDelete, isCheckUpdate]);

  return {
    stores,
    store,
    newstore,
    deletedId,
    summary,
    errors,
    loading,
    pagination,
    isCheckAdd,
    isCheckUpdate,
    isCheckDelete,
    addStore,
    getStore,
    updateStore,
    deleteStore,
  };
};
