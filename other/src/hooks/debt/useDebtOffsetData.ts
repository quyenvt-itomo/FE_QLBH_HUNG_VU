import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { RootState } from "../../stores";
import { BaseState } from "../../stores/baseReducers";
import { IDebtOffset } from "../../models/store/debtOffset";
import {
  addItem,
  getAll,
  getItem,
  updateItem,
  deleteItem,
  reset,
  resetItem,
  resetNewData,
} from "../../stores/debtOffset/slice";
import { useEffect } from "react";
import { useClientData } from "../core/useClientData";
import { UseDataParams } from "../../models/base/interface";
import { checkPermission } from "../../utils/permissionUtils";

export const useDebtOffsetData = ({
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
    data: debtOffsets,
    dataById: debtOffset,
    newData: newDebtOffset,
    deletedId,
    summary,
    errors,
    loading,
    pagination,
    isCheckAdd,
    isCheckDelete,
    isCheckUpdate,
  } = useSelector((state: RootState) => state.DebtOffset as BaseState<IDebtOffset>, shallowEqual);
  const { info, permissions } = useClientData();

  const fetchDebtOffsetData = () => {
    if (isLockHook || !checkPermission(permissions, "debtOffset", "read")) return;
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

  const addDebtOffset = checkPermission(permissions, "debtOffset", "create")
    ? (newDebtOffset: IDebtOffset) => {
        dispatch(addItem(newDebtOffset));
      }
    : undefined;

  const getDebtOffset = checkPermission(permissions, "debtOffset", "read")
    ? (id: string) => {
        dispatch(getItem(id));
      }
    : undefined;

  const updateDebtOffset = checkPermission(permissions, "debtOffset", "update")
    ? (updatedDebtOffset: Partial<IDebtOffset>) => {
        dispatch(updateItem(updatedDebtOffset));
      }
    : undefined;

  const deleteDebtOffset = checkPermission(permissions, "debtOffset", "delete")
    ? (id: string) => {
        dispatch(deleteItem(id));
      }
    : undefined;

  useEffect(() => {
    if (!id) return;
    getDebtOffset?.(id);
  }, [id, reload, permissions]);

  useEffect(() => {
    fetchDebtOffsetData();
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
    if (!debtOffset) return;
    dispatch(resetItem());
  }, [debtOffset]);

  useEffect(() => {
    if (!newDebtOffset) return;
    dispatch(resetNewData());
  }, [newDebtOffset]);

  useEffect(() => {
    if (!isCheckAdd && !isCheckDelete && !isCheckUpdate) return;

    fetchDebtOffsetData();
    dispatch(reset());
    onCloseModal?.({
      isAdded: isCheckAdd,
      isUpdated: isCheckUpdate,
      isDeleted: isCheckDelete,
    });
  }, [isCheckAdd, isCheckDelete, isCheckUpdate]);

  return {
    debtOffsets,
    debtOffset,
    newDebtOffset,
    deletedId,
    summary,
    errors,
    loading,
    pagination,
    isCheckAdd,
    isCheckUpdate,
    isCheckDelete,
    addDebtOffset,
    getDebtOffset,
    updateDebtOffset,
    deleteDebtOffset,
  };
};
