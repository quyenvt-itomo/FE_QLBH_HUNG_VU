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
} from "../../stores/sale/slice";
import { useEffect } from "react";
import { useClientData } from "../core/useClientData";
import { UseDataParams } from "../../models/base/interface";
import { checkPermission } from "../../utils/permissionUtils";

export const useSaleData = ({
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
  storeId,
  status,
  onCloseModal,
}: UseDataParams) => {
  const dispatch = useDispatch();
  const {
    data: sales,
    dataById: sale,
    newData: newSale,
    deletedId,
    summary,
    errors,
    loading,
    pagination,
    isCheckAdd,
    isCheckDelete,
    isCheckUpdate,
  } = useSelector((state: RootState) => state.Sale as BaseState<IOrder>, shallowEqual);
  const { info, permissions } = useClientData();
  const fetchSaleData = () => {
    if (isLockHook || !checkPermission(permissions, "saleOrder", "read")) return;
    dispatch(
      getAll({
        page,
        size,
        keyword,
        startAt,
        endAt,
        sortBy,
        sortOrder,
        storeId,
        status,
        ...filter,
        ...ranger,
        ...search,
      }),
    );
  };

  const addSale = checkPermission(permissions, "saleOrder", "create")
    ? (newSale: Partial<IOrder>) => {
        dispatch(addItem(newSale));
      }
    : undefined;

  const getSale = checkPermission(permissions, "saleOrder", "read")
    ? (id: string) => {
        dispatch(getItem(id));
      }
    : undefined;

  const updateSale = checkPermission(permissions, "saleOrder", "update")
    ? (updatedSale: Partial<IOrder>) => {
        dispatch(updateItem(updatedSale));
      }
    : undefined;

  const deleteSale = checkPermission(permissions, "saleOrder", "delete")
    ? (id: string) => {
        dispatch(deleteItem(id));
      }
    : undefined;

  useEffect(() => {
    if (!id) return;
    getSale?.(id);
  }, [id, reload, permissions]);

  useEffect(() => {
    fetchSaleData();
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
    search,
    storeId,
    permissions,
    status,
  ]);

  useEffect(() => {
    if (!sale) return;
    dispatch(resetItem());
  }, [sale]);

  useEffect(() => {
    if (!newSale) return;
    dispatch(resetNewData());
  }, [newSale]);

  useEffect(() => {
    if (!isCheckAdd && !isCheckDelete && !isCheckUpdate) return;

    fetchSaleData();
    dispatch(reset());
    onCloseModal?.();
  }, [isCheckAdd, isCheckDelete, isCheckUpdate]);

  return {
    sales,
    sale,
    newSale,
    deletedId,
    summary,
    errors,
    loading,
    pagination,
    isCheckAdd,
    isCheckUpdate,
    isCheckDelete,
    addSale,
    getSale,
    updateSale,
    deleteSale,
  };
};
