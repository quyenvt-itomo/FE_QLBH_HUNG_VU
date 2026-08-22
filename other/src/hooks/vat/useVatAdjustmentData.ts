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
} from "../../stores/vatAdjustment/slice";
import { useEffect } from "react";
import { useClientData } from "../core/useClientData";
import { UseDataParams } from "../../models/base/interface";
import { checkPermission } from "../../utils/permissionUtils";
import { IVatAdjustment } from "../../models/store/vatAdjustment";

export const useVatAdjustmentData = ({
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
    data: vatAdjustments,
    dataById: vatAdjustment,
    newData: newVatAdjustment,
    deletedId,
    summary,
    errors,
    loading,
    pagination,
    isCheckAdd,
    isCheckDelete,
    isCheckUpdate,
  } = useSelector(
    (state: RootState) => state.VatAdjustment as BaseState<IVatAdjustment>,
    shallowEqual,
  );
  const { permissions } = useClientData();

  const fetchVatAdjustmentData = () => {
    if (isLockHook || !checkPermission(permissions, "vatAdjustment", "read")) return;
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

  const addVatAdjustment = checkPermission(permissions, "vatAdjustment", "create")
    ? (newVatAdjustment: IVatAdjustment) => {
        dispatch(addItem(newVatAdjustment));
      }
    : undefined;

  const getVatAdjustment = checkPermission(permissions, "vatAdjustment", "read")
    ? (id: string) => {
        dispatch(getItem(id));
      }
    : undefined;

  const updateVatAdjustment = checkPermission(permissions, "vatAdjustment", "update")
    ? (updatedVatAdjustment: Partial<IVatAdjustment>) => {
        dispatch(updateItem(updatedVatAdjustment));
      }
    : undefined;

  const deleteVatAdjustment = checkPermission(permissions, "vatAdjustment", "delete")
    ? (id: string) => {
        dispatch(deleteItem(id));
      }
    : undefined;

  useEffect(() => {
    if (!id) return;
    getVatAdjustment?.(id);
  }, [id, reload, permissions]);

  useEffect(() => {
    fetchVatAdjustmentData();
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
  ]);

  useEffect(() => {
    if (!vatAdjustment) return;
    dispatch(resetItem());
  }, [vatAdjustment]);

  useEffect(() => {
    if (!newVatAdjustment) return;
    dispatch(resetNewData());
  }, [newVatAdjustment]);

  useEffect(() => {
    if (!isCheckAdd && !isCheckDelete && !isCheckUpdate) return;

    fetchVatAdjustmentData();
    dispatch(reset());
    onCloseModal?.({
      isAdded: isCheckAdd,
      isUpdated: isCheckUpdate,
      isDeleted: isCheckDelete,
    });
  }, [isCheckAdd, isCheckDelete, isCheckUpdate]);

  return {
    vatAdjustments,
    vatAdjustment,
    newVatAdjustment,
    deletedId,
    summary,
    errors,
    loading,
    pagination,
    isCheckAdd,
    isCheckUpdate,
    isCheckDelete,
    addVatAdjustment,
    getVatAdjustment,
    updateVatAdjustment,
    deleteVatAdjustment,
  };
};
