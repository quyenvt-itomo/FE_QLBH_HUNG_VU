import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { RootState } from "../../stores";
import { BaseState } from "../../stores/baseReducers";
import { IOrder } from "../../models/store/order";
import {
  addItem,
  getAll,
  getItem,
  updateItem,
  deleteItem,
  reset,
  resetItem,
  resetNewData,
} from "../../stores/saleReturn/slice";
import { useEffect } from "react";
import { useClientData } from "../core/useClientData";
import { UseDataParams } from "../../models/base/interface";
import { checkPermission } from "../../utils/permissionUtils";

export const useSaleReturnData = ({
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
    data: saleReturns,
    dataById: saleReturn,
    newData: newSaleReturn,
    deletedId,
    summary,
    errors,
    loading,
    pagination,
    isCheckAdd,
    isCheckDelete,
    isCheckUpdate,
  } = useSelector((state: RootState) => state.SaleReturn as BaseState<IOrder>, shallowEqual);
  const { info, permissions } = useClientData();
  const fetchSaleReturnData = () => {
    if (isLockHook || !checkPermission(permissions, "saleReturn", "read")) return;
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

  const addSaleReturn = checkPermission(permissions, "saleReturn", "create")
    ? (newSaleReturn: IOrder) => {
        dispatch(addItem(newSaleReturn));
      }
    : undefined;

  const getSaleReturn = checkPermission(permissions, "saleReturn", "read")
    ? (id: string) => {
        dispatch(getItem(id));
      }
    : undefined;

  const updateSaleReturn = checkPermission(permissions, "saleReturn", "update")
    ? (updatedSaleReturn: Partial<IOrder>) => {
        dispatch(updateItem(updatedSaleReturn));
      }
    : undefined;

  const deleteSaleReturn = checkPermission(permissions, "saleReturn", "delete")
    ? (id: string) => {
        dispatch(deleteItem(id));
      }
    : undefined;

  useEffect(() => {
    if (!id) return;
    getSaleReturn?.(id);
  }, [id, reload, permissions]);

  useEffect(() => {
    fetchSaleReturnData();
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
    if (!saleReturn) return;
    dispatch(resetItem());
  }, [saleReturn]);

  useEffect(() => {
    if (!newSaleReturn) return;
    dispatch(resetNewData());
  }, [newSaleReturn]);

  useEffect(() => {
    if (!isCheckAdd && !isCheckDelete && !isCheckUpdate) return;

    fetchSaleReturnData();
    dispatch(reset());
    onCloseModal?.();
  }, [isCheckAdd, isCheckDelete, isCheckUpdate]);

  return {
    saleReturns,
    saleReturn,
    newSaleReturn,
    deletedId,
    summary,
    errors,
    loading,
    pagination,
    isCheckAdd,
    isCheckUpdate,
    isCheckDelete,
    addSaleReturn,
    getSaleReturn,
    updateSaleReturn,
    deleteSaleReturn,
  };
};
