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
} from "../../stores/customer/slice";
import { useEffect } from "react";
import { useClientData } from "../core/useClientData";
import { UseDataParams } from "../../models/base/interface";
import { checkPermission } from "../../utils/permissionUtils";

export const useCustomerData = ({
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
    data: customers,
    dataById: customer,
    newData: newCustomer,
    deletedId,
    summary,
    errors,
    loading,
    pagination,
    isCheckAdd,
    isCheckDelete,
    isCheckUpdate,
  } = useSelector((state: RootState) => state.Customer as BaseState<IPartner>, shallowEqual);
  const { info, permissions } = useClientData();

  const fetchCustomerData = () => {
    if (isLockHook || !checkPermission(permissions, "customer", "read")) return;
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

  const addCustomer = checkPermission(permissions, "customer", "create")
    ? (newCustomer: IPartner) => {
        dispatch(addItem(newCustomer));
      }
    : undefined;

  const getCustomer = checkPermission(permissions, "customer", "read")
    ? (id: string) => {
        dispatch(getItem(id));
      }
    : undefined;

  const updateCustomer = checkPermission(permissions, "customer", "update")
    ? (updatedCustomer: Partial<IPartner>) => {
        dispatch(updateItem(updatedCustomer));
      }
    : undefined;

  const deleteCustomer = checkPermission(permissions, "customer", "delete")
    ? (id: string) => {
        dispatch(deleteItem(id));
      }
    : undefined;

  useEffect(() => {
    if (!id) return;
    getCustomer?.(id);
  }, [id, reload, permissions]);

  useEffect(() => {
    fetchCustomerData();
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
    if (!customer) return;
    dispatch(resetItem());
  }, [customer]);

  useEffect(() => {
    if (!newCustomer) return;
    dispatch(resetNewData());
  }, [newCustomer]);

  useEffect(() => {
    if (!isCheckAdd && !isCheckDelete && !isCheckUpdate) return;

    fetchCustomerData();
    dispatch(reset());
    onCloseModal?.();
  }, [isCheckAdd, isCheckDelete, isCheckUpdate]);

  return {
    customers,
    customer,
    newCustomer,
    deletedId,
    summary,
    errors,
    loading,
    pagination,
    isCheckAdd,
    isCheckUpdate,
    isCheckDelete,
    addCustomer,
    getCustomer,
    updateCustomer,
    deleteCustomer,
  };
};
