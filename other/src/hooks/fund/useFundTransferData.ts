import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { RootState } from "../../stores";
import { BaseState } from "../../stores/baseReducers";
import { IFundTransfer } from "../../models/fundTransfer";
import {
  addItem,
  getAll,
  getItem,
  updateItem,
  deleteItem,
  reset,
  resetItem,
  resetNewData,
} from "../../stores/fundTransfer/slice";
import { useEffect } from "react";
import { useClientData } from "../core/useClientData";
import { UseDataParams } from "../../models/base/interface";
import { checkPermission } from "../../utils/permissionUtils";

export const useFundTransferData = ({
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
    data: fundTransfers,
    dataById: fundTransfer,
    newData: newFundTransfer,
    deletedId,
    summary,
    errors,
    loading,
    pagination,
    isCheckAdd,
    isCheckDelete,
    isCheckUpdate,
  } = useSelector(
    (state: RootState) => state.FundTransfer as BaseState<IFundTransfer>,
    shallowEqual,
  );
  const { info, permissions } = useClientData();

  const fetchFundTransferData = () => {
    if (isLockHook || !checkPermission(permissions, "fundTransfer", "read")) return;
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

  const addFundTransfer = checkPermission(permissions, "fundTransfer", "create")
    ? (newFundTransfer: IFundTransfer) => {
        dispatch(addItem(newFundTransfer));
      }
    : undefined;

  const getFundTransfer = checkPermission(permissions, "fundTransfer", "read")
    ? (id: string) => {
        dispatch(getItem(id));
      }
    : undefined;

  const updateFundTransfer = checkPermission(permissions, "fundTransfer", "update")
    ? (updatedFundTransfer: Partial<IFundTransfer>) => {
        dispatch(updateItem(updatedFundTransfer));
      }
    : undefined;

  const deleteFundTransfer = checkPermission(permissions, "fundTransfer", "delete")
    ? (id: string) => {
        dispatch(deleteItem(id));
      }
    : undefined;

  useEffect(() => {
    if (!id) return;
    getFundTransfer?.(id);
  }, [id, reload, permissions]);

  useEffect(() => {
    fetchFundTransferData();
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
    if (!fundTransfer) return;
    dispatch(resetItem());
  }, [fundTransfer]);

  useEffect(() => {
    if (!newFundTransfer) return;
    dispatch(resetNewData());
  }, [newFundTransfer]);

  useEffect(() => {
    if (!isCheckAdd && !isCheckDelete && !isCheckUpdate) return;

    fetchFundTransferData();
    dispatch(reset());
    onCloseModal?.({
      isAdded: isCheckAdd,
      isUpdated: isCheckUpdate,
      isDeleted: isCheckDelete,
    });
  }, [isCheckAdd, isCheckDelete, isCheckUpdate]);

  return {
    fundTransfers,
    fundTransfer,
    newFundTransfer,
    deletedId,
    summary,
    errors,
    loading,
    pagination,
    isCheckAdd,
    isCheckUpdate,
    isCheckDelete,
    addFundTransfer,
    getFundTransfer,
    updateFundTransfer,
    deleteFundTransfer,
  };
};
