import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { RootState } from "../../stores";
import { BaseState } from "../../stores/baseReducers";
import { IOrderLine } from "../../models/store/orderLine";
import { addItem, getItem, updateItem, deleteItem, reset } from "../../stores/purchase/line/slice";
import { useEffect } from "react";
import { useClientData } from "../core/useClientData";
import { UseDataParams } from "../../models/base/interface";
import { checkPermission } from "../../utils/permissionUtils";

interface Params extends UseDataParams {
  orderId?: string;
}

export const usePurchaseLineData = ({ orderId, onCloseModal }: Params) => {
  const dispatch = useDispatch();
  const { errors, loading, isCheckAdd, isCheckDelete, isCheckUpdate } = useSelector(
    (state: RootState) => state.PurchaseLine as BaseState<IOrderLine>,
    shallowEqual,
  );
  const { permissions } = useClientData();

  const canUpdate = checkPermission(permissions, "purchaseOrder", "update");

  const addPurchaseLine = canUpdate
    ? (newPurchaseLine: IOrderLine) => {
        if (!orderId) return;
        dispatch(addItem({ ...newPurchaseLine, orderId }));
      }
    : undefined;

  const getPurchaseLine = canUpdate
    ? (id: string) => {
        dispatch(getItem(id));
      }
    : undefined;

  const updatePurchaseLine = canUpdate
    ? (updatedPurchaseLine: Partial<IOrderLine>) => {
        if (!orderId) return;
        dispatch(updateItem({ ...updatedPurchaseLine, orderId }));
      }
    : undefined;

  const deletePurchaseLine = canUpdate
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
    addPurchaseLine,
    getPurchaseLine,
    updatePurchaseLine,
    deletePurchaseLine,
  };
};
