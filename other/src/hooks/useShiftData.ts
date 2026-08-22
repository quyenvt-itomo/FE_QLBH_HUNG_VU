import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { RootState } from "../stores";
import { BaseState } from "../stores/baseReducers";
import { CloseShiftPayload, IShift, OpenShiftPayload, ShiftSummary } from "../models/store/shift";
import {
  openItem,
  closeItem,
  addItem,
  getAll,
  getItem,
  getItemSummary,
  updateItem,
  deleteItem,
  reset,
  resetItem,
  resetNewData,
  setItemSummary,
} from "../stores/shift/slice";
import { useEffect } from "react";
import { useClientData } from "./core/useClientData";
import { UseDataParams } from "../models/base/interface";
import { checkPermission } from "../utils/permissionUtils";

interface Params extends UseDataParams {}

export const useShiftData = ({
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
  status,
  onCloseModal,
}: Params) => {
  const dispatch = useDispatch();
  const {
    shiftSummary,
    data: shifts,
    dataById: shift,
    newData: newShift,
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
    (state: RootState) =>
      state.Shift as BaseState<IShift> & {
        shiftSummary: ShiftSummary | null;
      },
    shallowEqual,
  );
  const { info, permissions } = useClientData();

  const currentShift = info?.currentShift;

  const fetchShiftData = () => {
    if (isLockHook || !checkPermission(permissions, "shift", "read")) return;
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
        status,
        ...filter,
        ...ranger,
        ...search,
      }),
    );
  };

  const openShift =
    info && !currentShift
      ? (data: OpenShiftPayload) => {
          dispatch(openItem(data));
        }
      : undefined;

  const closeShift = currentShift
    ? (data: Omit<CloseShiftPayload, "id">) => {
        dispatch(
          closeItem({
            ...data,
            id: currentShift.id,
          }),
        );
      }
    : undefined;

  const getShiftSummary = (id: string) => {
    if (!info) return;
    dispatch(getItemSummary(id));
  };

  const addShift = checkPermission(permissions, "shift", "create")
    ? (newShift: Partial<IShift>) => {
        dispatch(addItem(newShift));
      }
    : undefined;

  const getShift = checkPermission(permissions, "shift", "read")
    ? (id: string) => {
        dispatch(getItem(id));
      }
    : undefined;

  const updateShift = checkPermission(permissions, "shift", "update")
    ? (updatedShift: Partial<IShift>) => {
        dispatch(updateItem(updatedShift));
      }
    : undefined;

  const deleteShift = checkPermission(permissions, "shift", "delete")
    ? (id: string) => {
        dispatch(deleteItem(id));
      }
    : undefined;

  useEffect(() => {
    if (!shiftSummary) return;
    dispatch(setItemSummary(null));
  }, [shiftSummary]);

  useEffect(() => {
    if (!id) return;
    getShift?.(id);
  }, [id, reload, permissions]);

  useEffect(() => {
    fetchShiftData();
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
    status,
  ]);

  useEffect(() => {
    if (!shift) return;
    dispatch(resetItem());
  }, [shift]);

  useEffect(() => {
    if (!newShift) return;
    dispatch(resetNewData());
  }, [newShift]);

  useEffect(() => {
    if (!isCheckAdd && !isCheckDelete && !isCheckUpdate) return;

    fetchShiftData();
    dispatch(reset());
    onCloseModal?.();
  }, [isCheckAdd, isCheckDelete, isCheckUpdate]);

  return {
    shiftSummary,
    shifts,
    shift,
    newShift,
    deletedId,
    summary,
    filterItems,
    errors,
    loading,
    pagination,
    isCheckAdd,
    isCheckUpdate,
    isCheckDelete,
    addShift,
    getShiftSummary,
    getShift,
    updateShift,
    deleteShift,
    openShift,
    closeShift,
  };
};
