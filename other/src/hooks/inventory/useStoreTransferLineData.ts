import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { RootState } from "../../stores";
import { BaseState } from "../../stores/baseReducers";
import { IStoreTransferLine } from "../../models/storeTransferLine";
import {
  addItem,
  getItem,
  updateItem,
  deleteItem,
  reset,
} from "../../stores/storeTransfer/storeTransferLine/slice";
import { useEffect } from "react";
import { UseDataParams } from "../../models/base/interface";
import { useClientData } from "../core/useClientData";
import { checkPermission } from "../../utils/permissionUtils";

interface Params extends UseDataParams {
  transferId?: string;
}

export const useStoreTransferLineData = ({ transferId, onCloseModal }: Params) => {
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
    (state: RootState) => state.StoreTransferLine as BaseState<IStoreTransferLine>,
    shallowEqual,
  );
  const { permissions } = useClientData();

  const canUpdate = checkPermission(permissions, "storeTransfer", "update");

  const addStoreTransferLine = canUpdate
    ? (newStoreTransferLine: IStoreTransferLine) => {
        if (!transferId) return;
        dispatch(addItem({ ...newStoreTransferLine, transferId }));
      }
    : undefined;

  const getStoreTransferLine = canUpdate
    ? (id: string) => {
        dispatch(getItem(id));
      }
    : undefined;

  const updateStoreTransferLine = canUpdate
    ? (updatedStoreTransferLine: Partial<IStoreTransferLine>) => {
        if (!transferId) return;
        dispatch(updateItem({ ...updatedStoreTransferLine, transferId }));
      }
    : undefined;

  const deleteStoreTransferLine = canUpdate
    ? (id: string) => {
        if (!transferId) return;
        dispatch(deleteItem({ id, transferId }));
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
    addStoreTransferLine,
    getStoreTransferLine,
    updateStoreTransferLine,
    deleteStoreTransferLine,
  };
};
