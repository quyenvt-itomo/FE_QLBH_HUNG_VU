import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { RootState } from "../../stores";
import { BaseState } from "../../stores/baseReducers";
import { IOrderLine } from "../../models/store/orderLine";
import {
  addItem,
  getItem,
  updateItem,
  deleteItem,
  reset,
} from "../../stores/purchaseReturn/line/slice";
import { useEffect } from "react";
import { useClientData } from "../core/useClientData";
import { UseDataParams } from "../../models/base/interface";
import { checkPermission } from "../../utils/permissionUtils";

interface Params extends UseDataParams {
  orderId?: string;
}

export const usePurchaseReturnLineData = ({ orderId, onCloseModal }: Params) => {
  const dispatch = useDispatch();
  const { errors, loading, isCheckAdd, isCheckDelete, isCheckUpdate } = useSelector(
    (state: RootState) => state.PurchaseReturnLine as BaseState<IOrderLine>,
    shallowEqual,
  );
  const { permissions } = useClientData();

  const canUpdate = checkPermission(permissions, "purchaseReturn", "update");

  const addPurchaseReturnLine = canUpdate
    ? (newPurchaseReturnLine: IOrderLine) => {
        if (!orderId) return;
        dispatch(addItem({ ...newPurchaseReturnLine, orderId }));
      }
    : undefined;

  const getPurchaseReturnLine = canUpdate
    ? (id: string) => {
        dispatch(getItem(id));
      }
    : undefined;

  const updatePurchaseReturnLine = canUpdate
    ? (updatedPurchaseReturnLine: Partial<IOrderLine>) => {
        if (!orderId) return;
        dispatch(updateItem({ ...updatedPurchaseReturnLine, orderId }));
      }
    : undefined;

  const deletePurchaseReturnLine = canUpdate
    ? (id: string) => {
        if (!orderId) return;
        dispatch(deleteItem({ id, orderId }));
      }
    : undefined;

  useEffect(() => {
    if (!isCheckAdd && !isCheckDelete && !isCheckUpdate) return;

    dispatch(reset());
    onCloseModal?.();
  }, [isCheckAdd, isCheckDelete, isCheckUpdate]);

  return {
    errors,
    loading,
    isCheckAdd,
    isCheckUpdate,
    isCheckDelete,
    addPurchaseReturnLine,
    getPurchaseReturnLine,
    updatePurchaseReturnLine,
    deletePurchaseReturnLine,
  };
};
