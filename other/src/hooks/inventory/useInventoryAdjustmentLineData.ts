import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { RootState } from "../../stores";
import { BaseState } from "../../stores/baseReducers";
import {
  addItem,
  getItem,
  updateItem,
  deleteItem,
  reset,
} from "../../stores/inventoryAdjustment/inventoryAdjustmentLine/slice";
import { useEffect } from "react";
import { UseDataParams } from "../../models/base/interface";
import { IInventoryAdjustmentLine } from "../../models/store/inventoryAdjustmentLine";
import { useClientData } from "../core/useClientData";
import { checkPermission } from "../../utils/permissionUtils";

interface Params extends UseDataParams {
  adjustmentId?: string;
}

export const useInventoryAdjustmentLineData = ({ adjustmentId, onCloseModal }: Params) => {
  const dispatch = useDispatch();
  const {
    deletedId,
    summary,
    errors,
    loading,
    pagination,
    isCheckAdd,
    isCheckDelete,
    isCheckUpdate,
  } = useSelector(
    (state: RootState) => state.InventoryAdjustmentLine as BaseState<IInventoryAdjustmentLine>,
    shallowEqual,
  );
  const { permissions } = useClientData();

  const canUpdate = checkPermission(permissions, "inventoryAdjustment", "update");

  const addInventoryAdjustmentLine = canUpdate
    ? (newInventoryAdjustmentLine: IInventoryAdjustmentLine) => {
        if (!adjustmentId) return;
        dispatch(addItem({ ...newInventoryAdjustmentLine, adjustmentId }));
      }
    : undefined;

  const getInventoryAdjustmentLine = canUpdate
    ? (id: string) => {
        dispatch(getItem(id));
      }
    : undefined;

  const updateInventoryAdjustmentLine = canUpdate
    ? (updatedInventoryAdjustmentLine: Partial<IInventoryAdjustmentLine>) => {
        if (!adjustmentId) return;
        dispatch(updateItem({ ...updatedInventoryAdjustmentLine, adjustmentId }));
      }
    : undefined;

  const deleteInventoryAdjustmentLine = canUpdate
    ? (id: string) => {
        if (!adjustmentId) return;
        dispatch(deleteItem({ id, adjustmentId }));
      }
    : undefined;

  useEffect(() => {
    if (!isCheckAdd && !isCheckDelete && !isCheckUpdate) return;

    dispatch(reset());
    onCloseModal?.();
  }, [isCheckAdd, isCheckDelete, isCheckUpdate]);

  return {
    deletedId,
    summary,
    errors,
    loading,
    pagination,
    isCheckAdd,
    isCheckUpdate,
    isCheckDelete,
    addInventoryAdjustmentLine,
    getInventoryAdjustmentLine,
    updateInventoryAdjustmentLine,
    deleteInventoryAdjustmentLine,
  };
};
