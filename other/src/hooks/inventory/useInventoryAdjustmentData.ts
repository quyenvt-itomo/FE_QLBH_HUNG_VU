import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { RootState } from "../../stores";
import { BaseState } from "../../stores/baseReducers";
import {
  addItem,
  getAll,
  getItem,
  updateItem,
  deleteItem,
  reset,
  resetItem,
  resetNewData,
} from "../../stores/inventoryAdjustment/slice";
import { useEffect } from "react";
import { useClientData } from "../core/useClientData";
import { UseDataParams } from "../../models/base/interface";
import { IInventoryAdjustment } from "../../models/store/inventoryAdjustment";
import { checkPermission } from "../../utils/permissionUtils";

export const useInventoryAdjustmentData = ({
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
    data: inventoryAdjustments,
    dataById: inventoryAdjustment,
    newData: newInventoryAdjustment,
    deletedId,
    summary,
    errors,
    loading,
    pagination,
    isCheckAdd,
    isCheckDelete,
    isCheckUpdate,
  } = useSelector(
    (state: RootState) => state.InventoryAdjustment as BaseState<IInventoryAdjustment>,
    shallowEqual,
  );
  const { info, permissions } = useClientData();

  const fetchInventoryAdjustmentData = () => {
    if (isLockHook || !checkPermission(permissions, "inventoryAdjustment", "read")) return;
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

  const addInventoryAdjustment = checkPermission(permissions, "inventoryAdjustment", "create")
    ? (newInventoryAdjustment: IInventoryAdjustment) => {
        dispatch(addItem(newInventoryAdjustment));
      }
    : undefined;

  const getInventoryAdjustment = checkPermission(permissions, "inventoryAdjustment", "read")
    ? (id: string) => {
        dispatch(getItem(id));
      }
    : undefined;

  const updateInventoryAdjustment = checkPermission(permissions, "inventoryAdjustment", "update")
    ? (updatedInventoryAdjustment: Partial<IInventoryAdjustment>) => {
        dispatch(updateItem(updatedInventoryAdjustment));
      }
    : undefined;

  const deleteInventoryAdjustment = checkPermission(permissions, "inventoryAdjustment", "delete")
    ? (id: string) => {
        dispatch(deleteItem(id));
      }
    : undefined;

  useEffect(() => {
    if (!id) return;
    getInventoryAdjustment?.(id);
  }, [id, reload, permissions]);

  useEffect(() => {
    fetchInventoryAdjustmentData();
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
    if (!inventoryAdjustment) return;
    dispatch(resetItem());
  }, [inventoryAdjustment]);

  useEffect(() => {
    if (!newInventoryAdjustment) return;
    dispatch(resetNewData());
  }, [newInventoryAdjustment]);

  useEffect(() => {
    if (!isCheckAdd && !isCheckDelete && !isCheckUpdate) return;

    fetchInventoryAdjustmentData();
    dispatch(reset());
    onCloseModal?.({
      isAdded: isCheckAdd,
      isUpdated: isCheckUpdate,
      isDeleted: isCheckDelete,
    });
  }, [isCheckAdd, isCheckDelete, isCheckUpdate]);

  return {
    inventoryAdjustments,
    inventoryAdjustment,
    newInventoryAdjustment,
    deletedId,
    summary,
    errors,
    loading,
    pagination,
    isCheckAdd,
    isCheckUpdate,
    isCheckDelete,
    addInventoryAdjustment,
    getInventoryAdjustment,
    updateInventoryAdjustment,
    deleteInventoryAdjustment,
  };
};
