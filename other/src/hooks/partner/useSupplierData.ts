import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { RootState } from "../../stores";
import { BaseState } from "../../stores/baseReducers";
import { IPartner } from "../../models/partner";
import {
  addItem,
  getAll,
  getItem,
  updateItem,
  deleteItem,
  reset,
  resetItem,
  resetNewData,
} from "../../stores/supplier/slice";
import { useEffect } from "react";
import { useClientData } from "../core/useClientData";
import { UseDataParams } from "../../models/base/interface";
import { checkPermission } from "../../utils/permissionUtils";

export const useSupplierData = ({
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
    data: suppliers,
    dataById: supplier,
    newData: newSupplier,
    deletedId,
    summary,
    errors,
    loading,
    pagination,
    isCheckAdd,
    isCheckDelete,
    isCheckUpdate,
  } = useSelector((state: RootState) => state.Supplier as BaseState<IPartner>, shallowEqual);
  const { info, permissions } = useClientData();

  const fetchSupplierData = () => {
    if (isLockHook || !checkPermission(permissions, "supplier", "read")) return;
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

  const addSupplier = checkPermission(permissions, "supplier", "create")
    ? (newSupplier: IPartner) => {
        dispatch(addItem(newSupplier));
      }
    : undefined;

  const getSupplier = checkPermission(permissions, "supplier", "read")
    ? (id: string) => {
        dispatch(getItem(id));
      }
    : undefined;

  const updateSupplier = checkPermission(permissions, "supplier", "update")
    ? (updatedSupplier: Partial<IPartner>) => {
        dispatch(updateItem(updatedSupplier));
      }
    : undefined;

  const deleteSupplier = checkPermission(permissions, "supplier", "delete")
    ? (id: string) => {
        dispatch(deleteItem(id));
      }
    : undefined;

  useEffect(() => {
    if (!id) return;
    getSupplier?.(id);
  }, [id, reload, permissions]);

  useEffect(() => {
    fetchSupplierData();
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
    if (!supplier) return;
    dispatch(resetItem());
  }, [supplier]);

  useEffect(() => {
    if (!newSupplier) return;
    dispatch(resetNewData());
  }, [newSupplier]);

  useEffect(() => {
    if (!isCheckAdd && !isCheckDelete && !isCheckUpdate) return;

    fetchSupplierData();
    dispatch(reset());
    onCloseModal?.();
  }, [isCheckAdd, isCheckDelete, isCheckUpdate]);

  return {
    suppliers,
    supplier,
    newSupplier,
    deletedId,
    summary,
    errors,
    loading,
    pagination,
    isCheckAdd,
    isCheckUpdate,
    isCheckDelete,
    addSupplier,
    getSupplier,
    updateSupplier,
    deleteSupplier,
  };
};
