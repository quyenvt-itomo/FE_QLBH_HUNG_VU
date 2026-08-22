import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { RootState } from "../../stores";
import { BaseState } from "../../stores/baseReducers";
import { IOrderLine } from "../../models/store/orderLine";
import {
  addItem,
  getAll,
  getItem,
  updateItem,
  deleteItem,
  reset,
  resetItem,
  resetNewData,
} from "../../stores/sale/line/slice";
import { useEffect } from "react";
import { useClientData } from "../core/useClientData";
import { UseDataParams } from "../../models/base/interface";
import { checkPermission } from "../../utils/permissionUtils";

interface Params extends UseDataParams {
  orderId?: string;
}

export const useSaleLineData = ({ orderId, onCloseModal }: Params) => {
  const dispatch = useDispatch();
  const {
    data: sales,
    dataById: sale,
    newData: newSaleLine,
    deletedId,
    summary,
    errors,
    loading,
    pagination,
    isCheckAdd,
    isCheckDelete,
    isCheckUpdate,
  } = useSelector((state: RootState) => state.SaleLine as BaseState<IOrderLine>, shallowEqual);
  const { permissions } = useClientData();

  const canUpdate = checkPermission(permissions, "saleOrder", "update");

  const addSaleLine = canUpdate
    ? (newSaleLine: IOrderLine) => {
        if (!orderId) return;
        dispatch(addItem({ ...newSaleLine, orderId }));
      }
    : undefined;

  const getSaleLine = canUpdate
    ? (id: string) => {
        dispatch(getItem(id));
      }
    : undefined;

  const updateSaleLine = canUpdate
    ? (updatedSaleLine: Partial<IOrderLine>) => {
        if (!orderId) return;
        dispatch(updateItem({ ...updatedSaleLine, orderId }));
      }
    : undefined;

  const deleteSaleLine = canUpdate
    ? (id: string) => {
        if (!orderId) return;
        dispatch(deleteItem({ id, orderId }));
      }
    : undefined;

  useEffect(() => {
    if (!sale) return;
    dispatch(resetItem());
  }, [sale]);

  useEffect(() => {
    if (!newSaleLine) return;
    dispatch(resetNewData());
  }, [newSaleLine]);

  useEffect(() => {
    if (!isCheckAdd && !isCheckDelete && !isCheckUpdate) return;

    dispatch(reset());
    onCloseModal?.();
  }, [isCheckAdd, isCheckDelete, isCheckUpdate]);

  return {
    sales,
    sale,
    newSaleLine,
    deletedId,
    summary,
    errors,
    loading,
    pagination,
    isCheckAdd,
    isCheckUpdate,
    isCheckDelete,
    addSaleLine,
    getSaleLine,
    updateSaleLine,
    deleteSaleLine,
  };
};
