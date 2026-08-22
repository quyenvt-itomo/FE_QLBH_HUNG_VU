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
} from "../../stores/fundAdjustment/slice";
import { useEffect } from "react";
import { useClientData } from "../core/useClientData";
import { UseDataParams } from "../../models/base/interface";
import { IFundAdjustment } from "../../models/fundAdjustment";
import { checkPermission } from "../../utils/permissionUtils";

export const useFundAdjustmentData = ({
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
  onCloseModal,
}: UseDataParams) => {
  const dispatch = useDispatch();
  const {
    data: fundAdjustments,
    dataById: fundAdjustment,
    newData: newFundAdjustment,
    deletedId,
    summary,
    errors,
    loading,
    pagination,
    isCheckAdd,
    isCheckDelete,
    isCheckUpdate,
  } = useSelector(
    (state: RootState) => state.FundAdjustment as BaseState<IFundAdjustment>,
    shallowEqual,
  );
  const { info, permissions } = useClientData();

  const fetchFundAdjustmentData = () => {
    if (isLockHook || !checkPermission(permissions, "fundAdjustment", "read")) return;
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
        ...filter,
        ...ranger,
        ...search,
      }),
    );
  };

  const addFundAdjustment = checkPermission(permissions, "fundAdjustment", "create")
    ? (newFundAdjustment: IFundAdjustment) => {
        dispatch(addItem(newFundAdjustment));
      }
    : undefined;

  const getFundAdjustment = checkPermission(permissions, "fundAdjustment", "read")
    ? (id: string) => {
        dispatch(getItem(id));
      }
    : undefined;

  const updateFundAdjustment = checkPermission(permissions, "fundAdjustment", "update")
    ? (updatedFundAdjustment: Partial<IFundAdjustment>) => {
        dispatch(updateItem(updatedFundAdjustment));
      }
    : undefined;

  const deleteFundAdjustment = checkPermission(permissions, "fundAdjustment", "delete")
    ? (id: string) => {
        dispatch(deleteItem(id));
      }
    : undefined;

  useEffect(() => {
    if (!id) return;
    getFundAdjustment?.(id);
  }, [id, reload, permissions]);

  useEffect(() => {
    fetchFundAdjustmentData();
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
    storeId,
  ]);

  useEffect(() => {
    if (!fundAdjustment) return;
    dispatch(resetItem());
  }, [fundAdjustment]);

  useEffect(() => {
    if (!newFundAdjustment) return;
    dispatch(resetNewData());
  }, [newFundAdjustment]);

  useEffect(() => {
    if (!isCheckAdd && !isCheckDelete && !isCheckUpdate) return;

    fetchFundAdjustmentData();
    dispatch(reset());
    onCloseModal?.({
      isAdded: isCheckAdd,
      isUpdated: isCheckUpdate,
      isDeleted: isCheckDelete,
    });
  }, [isCheckAdd, isCheckDelete, isCheckUpdate]);

  return {
    fundAdjustments,
    fundAdjustment,
    newFundAdjustment,
    deletedId,
    summary,
    errors,
    loading,
    pagination,
    isCheckAdd,
    isCheckUpdate,
    isCheckDelete,
    addFundAdjustment,
    getFundAdjustment,
    updateFundAdjustment,
    deleteFundAdjustment,
  };
};
