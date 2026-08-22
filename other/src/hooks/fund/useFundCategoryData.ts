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
} from "../../stores/fundCategory/slice";
import { useEffect } from "react";
import { UseDataParams } from "../../models/base/interface";
import { IFundCategory } from "../../models/fundCategory";
import { useClientData } from "../core/useClientData";
import { checkPermission } from "../../utils/permissionUtils";

export const useFundCategoryData = ({
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
    data: fundCategories,
    dataById: fundCategory,
    newData: newFundCategory,
    deletedId,
    summary,
    errors,
    loading,
    pagination,
    isCheckAdd,
    isCheckDelete,
    isCheckUpdate,
  } = useSelector(
    (state: RootState) => state.FundCategory as BaseState<IFundCategory>,
    shallowEqual,
  );
  const { permissions } = useClientData();

  const fetchIFundCategory = () => {
    if (isLockHook || !checkPermission(permissions, "category", "read")) return;
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

  const addFundCategory = checkPermission(permissions, "category", "create")
    ? (newFundCategory: IFundCategory) => {
        dispatch(addItem(newFundCategory));
      }
    : undefined;

  const getFundCategory = checkPermission(permissions, "category", "read")
    ? (id: string) => {
        dispatch(getItem(id));
      }
    : undefined;

  const updateFundCategory = checkPermission(permissions, "category", "update")
    ? (updatedFundCategory: Partial<IFundCategory>) => {
        dispatch(updateItem(updatedFundCategory));
      }
    : undefined;

  const deleteFundCategory = checkPermission(permissions, "category", "delete")
    ? (id: string) => {
        dispatch(deleteItem(id));
      }
    : undefined;

  useEffect(() => {
    if (!id) return;
    getFundCategory?.(id);
  }, [id, reload, permissions]);

  useEffect(() => {
    fetchIFundCategory();
  }, [dispatch, page, size, keyword, sortBy, sortOrder, isLockHook, status, reload, permissions]);

  useEffect(() => {
    if (!fundCategory) return;
    dispatch(resetItem());
  }, [fundCategory]);

  useEffect(() => {
    if (!newFundCategory) return;
    dispatch(resetNewData());
  }, [newFundCategory]);

  useEffect(() => {
    if (!isCheckAdd && !isCheckDelete && !isCheckUpdate) return;

    fetchIFundCategory();
    dispatch(reset());
    onCloseModal?.();
  }, [isCheckAdd, isCheckDelete, isCheckUpdate]);

  return {
    fundCategories,
    fundCategory,
    newFundCategory,
    deletedId,
    errors,
    loading,
    pagination,
    isCheckAdd,
    isCheckUpdate,
    isCheckDelete,
    summary,
    addFundCategory,
    getFundCategory,
    updateFundCategory,
    deleteFundCategory,
  };
};
