import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { RootState } from "../stores";
import { BaseState } from "../stores/baseReducers";
import { IIncomeExpense } from "../models/store/incomeExpense";
import {
  addItem,
  getAll,
  getItem,
  updateItem,
  deleteItem,
  reset,
  resetItem,
  resetNewData,
} from "../stores/incomeExpense/slice";
import { useEffect } from "react";
import { useClientData } from "./core/useClientData";
import { UseDataParams } from "../models/base/interface";
import { checkPermission } from "../utils/permissionUtils";
import { IncomeExpenseTypeEnum } from "../constants/enum";

interface Params extends UseDataParams {
  fundId?: string;
  type?: IncomeExpenseTypeEnum;
  categoryId?: string;
  fundCategoryGroupId?: string;
}

export const useIncomeExpenseData = ({
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
  type,
  categoryId,
  fundCategoryGroupId,
  onCloseModal,
}: Params) => {
  const dispatch = useDispatch();
  const {
    data: incomeExpenses,
    dataById: incomeExpense,
    newData: newIncomeExpense,
    deletedId,
    summary,
    filterItems,
    errors,
    loading,
    pagination,
    isCheckAdd,
    isCheckDelete,
    isCheckUpdate,
  } = useSelector(
    (state: RootState) => state.IncomeExpense as BaseState<IIncomeExpense>,
    shallowEqual,
  );
  const { info, permissions } = useClientData();

  const fetchIncomeExpenseData = () => {
    if (isLockHook || !checkPermission(permissions, "incomeExpense", "read")) return;
    dispatch(
      getAll({
        page,
        size,
        keyword,
        startAt,
        endAt,
        sortBy,
        sortOrder,
        type,
        categoryId,
        fundCategoryGroupId,
        ...filter,
        ...ranger,
        ...search,
      }),
    );
  };

  const addIncomeExpense = checkPermission(permissions, "incomeExpense", "create")
    ? (newIncomeExpense: Partial<IIncomeExpense>) => {
        dispatch(addItem(newIncomeExpense));
      }
    : undefined;

  const getIncomeExpense = checkPermission(permissions, "incomeExpense", "read")
    ? (id: string) => {
        dispatch(getItem(id));
      }
    : undefined;

  const updateIncomeExpense = checkPermission(permissions, "incomeExpense", "update")
    ? (updatedIncomeExpense: Partial<IIncomeExpense>) => {
        dispatch(updateItem(updatedIncomeExpense));
      }
    : undefined;

  const deleteIncomeExpense = checkPermission(permissions, "incomeExpense", "delete")
    ? (id: string) => {
        dispatch(deleteItem(id));
      }
    : undefined;

  useEffect(() => {
    if (!id) return;
    getIncomeExpense?.(id);
  }, [id, reload, permissions]);

  useEffect(() => {
    fetchIncomeExpenseData();
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
    type,
    categoryId,
    fundCategoryGroupId,
  ]);

  useEffect(() => {
    if (!incomeExpense) return;
    dispatch(resetItem());
  }, [incomeExpense]);

  useEffect(() => {
    if (!newIncomeExpense) return;
    dispatch(resetNewData());
  }, [newIncomeExpense]);

  useEffect(() => {
    if (!isCheckAdd && !isCheckDelete && !isCheckUpdate) return;

    fetchIncomeExpenseData();
    dispatch(reset());
    onCloseModal?.();
  }, [isCheckAdd, isCheckDelete, isCheckUpdate]);

  return {
    incomeExpenses,
    incomeExpense,
    newIncomeExpense,
    deletedId,
    summary,
    filterItems,
    errors,
    loading,
    pagination,
    isCheckAdd,
    isCheckUpdate,
    isCheckDelete,
    addIncomeExpense,
    getIncomeExpense,
    updateIncomeExpense,
    deleteIncomeExpense,
  };
};
