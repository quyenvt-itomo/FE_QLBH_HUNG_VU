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
} from "../../stores/saleReturn/line/slice";
import { useEffect } from "react";
import { useClientData } from "../core/useClientData";
import { UseDataParams } from "../../models/base/interface";
import { checkPermission } from "../../utils/permissionUtils";

interface Params extends UseDataParams {
  orderId?: string;
}

export const useSaleReturnLineData = ({ orderId, onCloseModal }: Params) => {
  const dispatch = useDispatch();
  const { errors, loading, isCheckAdd, isCheckDelete, isCheckUpdate } = useSelector(
    (state: RootState) => state.SaleReturnLine as BaseState<IOrderLine>,
    shallowEqual,
  );
  const { permissions } = useClientData();

  const canUpdate = checkPermission(permissions, "saleReturn", "update");

  const addSaleReturnLine = canUpdate
    ? (newSaleReturnLine: IOrderLine) => {
        if (!orderId) return;
        dispatch(addItem({ ...newSaleReturnLine, orderId }));
      }
    : undefined;

  const getSaleReturnLine = canUpdate
    ? (id: string) => {
        dispatch(getItem(id));
      }
    : undefined;

  const updateSaleReturnLine = canUpdate
    ? (updatedSaleReturnLine: Partial<IOrderLine>) => {
        if (!orderId) return;
        dispatch(updateItem({ ...updatedSaleReturnLine, orderId }));
      }
    : undefined;

  const deleteSaleReturnLine = canUpdate
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
    addSaleReturnLine,
    getSaleReturnLine,
    updateSaleReturnLine,
    deleteSaleReturnLine,
  };
};
