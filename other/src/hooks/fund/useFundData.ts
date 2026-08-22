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
} from "../../stores/fund/slice";
import { useEffect } from "react";
import { UseDataParams } from "../../models/base/interface";
import { IFund } from "../../models/fund";
import { useClientData } from "../core/useClientData";
import { checkPermission } from "../../utils/permissionUtils";

export const useFundData = ({
  id,
  keyword,
  page,
  size,
  sortBy,
  sortOrder,
  isLockHook,
  status,
  reload,
  onCloseModal,
}: UseDataParams) => {
  const dispatch = useDispatch();
  const {
    data: funds,
    dataById: fund,
    newData: newFund,
    deletedId,
    summary,
    errors,
    loading,
    pagination,
    isCheckAdd,
    isCheckDelete,
    isCheckUpdate,
  } = useSelector((state: RootState) => state.Fund as BaseState<IFund>, shallowEqual);
  const { permissions } = useClientData();

  const fetchIFund = () => {
    if (isLockHook || !checkPermission(permissions, "fund", "read")) return;
    dispatch(
      getAll({
        page,
        size,
        keyword,
        sortBy,
        sortOrder,
        status,
      }),
    );
  };

  const addFund = checkPermission(permissions, "fund", "create")
    ? (newFund: IFund) => {
        dispatch(addItem(newFund));
      }
    : undefined;

  const getFund = checkPermission(permissions, "fund", "read")
    ? (id: string) => {
        dispatch(getItem(id));
      }
    : undefined;

  const updateFund = checkPermission(permissions, "fund", "update")
    ? (updatedFund: Partial<IFund>) => {
        dispatch(updateItem(updatedFund));
      }
    : undefined;

  const deleteFund = checkPermission(permissions, "fund", "delete")
    ? (id: string) => {
        dispatch(deleteItem(id));
      }
    : undefined;

  useEffect(() => {
    if (!id) return;
    getFund?.(id);
  }, [id, reload, permissions]);

  useEffect(() => {
    fetchIFund();
  }, [dispatch, page, size, keyword, sortBy, sortOrder, isLockHook, status, reload, permissions]);

  useEffect(() => {
    if (!fund) return;
    dispatch(resetItem());
  }, [fund]);

  useEffect(() => {
    if (!newFund) return;
    dispatch(resetNewData());
  }, [newFund]);

  useEffect(() => {
    if (!isCheckAdd && !isCheckDelete && !isCheckUpdate) return;

    fetchIFund();
    dispatch(reset());
    onCloseModal?.();
  }, [isCheckAdd, isCheckDelete, isCheckUpdate]);

  return {
    funds,
    fund,
    newFund,
    deletedId,
    errors,
    loading,
    pagination,
    isCheckAdd,
    isCheckUpdate,
    isCheckDelete,
    summary,
    addFund,
    getFund,
    updateFund,
    deleteFund,
  };
};
