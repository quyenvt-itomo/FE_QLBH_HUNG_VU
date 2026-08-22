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
} from "../../stores/debtAdjustment/slice";
import { useEffect } from "react";
import { useClientData } from "../core/useClientData";
import { UseDataParams } from "../../models/base/interface";
import { checkPermission } from "../../utils/permissionUtils";
import { IDebtAdjustment } from "../../models/store/debtAdjustment";
import { PartnerDebtSideEnum } from "../../constants/enum";
interface Params extends UseDataParams {
  side: PartnerDebtSideEnum;
}
export const useDebtAdjustmentData = ({
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
  side,
  onCloseModal,
}: Params) => {
  const dispatch = useDispatch();
  const {
    data: debtAdjustments,
    dataById: debtAdjustment,
    newData: newDebtAdjustment,
    deletedId,
    summary,
    errors,
    loading,
    pagination,
    isCheckAdd,
    isCheckDelete,
    isCheckUpdate,
  } = useSelector(
    (state: RootState) => state.DebtAdjustment as BaseState<IDebtAdjustment>,
    shallowEqual,
  );
  const { info, permissions } = useClientData();

  const fetchDebtAdjustmentData = () => {
    if (isLockHook || !checkPermission(permissions, "debtAdjustment", "read")) return;
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
        side,
        ...filter,
        ...ranger,
        ...search,
      }),
    );
  };

  const addDebtAdjustment = checkPermission(permissions, "debtAdjustment", "create")
    ? (newDebtAdjustment: IDebtAdjustment) => {
        dispatch(
          addItem({
            ...newDebtAdjustment,
            side,
          }),
        );
      }
    : undefined;

  const getDebtAdjustment = checkPermission(permissions, "debtAdjustment", "read")
    ? (id: string) => {
        dispatch(getItem(id));
      }
    : undefined;

  const updateDebtAdjustment = checkPermission(permissions, "debtAdjustment", "update")
    ? (updatedDebtAdjustment: Partial<IDebtAdjustment>) => {
        dispatch(
          updateItem({
            ...updatedDebtAdjustment,
            side,
          }),
        );
      }
    : undefined;

  const deleteDebtAdjustment = checkPermission(permissions, "debtAdjustment", "delete")
    ? (id: string) => {
        dispatch(deleteItem(id));
      }
    : undefined;

  useEffect(() => {
    if (!id) return;
    getDebtAdjustment?.(id);
  }, [id, reload, permissions]);

  useEffect(() => {
    fetchDebtAdjustmentData();
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
    side,
  ]);

  useEffect(() => {
    if (!debtAdjustment) return;
    dispatch(resetItem());
  }, [debtAdjustment]);

  useEffect(() => {
    if (!newDebtAdjustment) return;
    dispatch(resetNewData());
  }, [newDebtAdjustment]);

  useEffect(() => {
    if (!isCheckAdd && !isCheckDelete && !isCheckUpdate) return;

    fetchDebtAdjustmentData();
    dispatch(reset());
    onCloseModal?.({
      isAdded: isCheckAdd,
      isUpdated: isCheckUpdate,
      isDeleted: isCheckDelete,
    });
  }, [isCheckAdd, isCheckDelete, isCheckUpdate]);

  return {
    debtAdjustments,
    debtAdjustment,
    newDebtAdjustment,
    deletedId,
    summary,
    errors,
    loading,
    pagination,
    isCheckAdd,
    isCheckUpdate,
    isCheckDelete,
    addDebtAdjustment,
    getDebtAdjustment,
    updateDebtAdjustment,
    deleteDebtAdjustment,
  };
};
