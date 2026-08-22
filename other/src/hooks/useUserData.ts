import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { RootState } from "../stores";
import { BaseState } from "../stores/baseReducers";
import { IUser } from "../models/user";
import {
  addItem,
  getAll,
  getItem,
  updateItem,
  deleteItem,
  reset,
  resetItem,
  resetNewData,
} from "../stores/user/slice";
import { useEffect } from "react";
import { UseDataParams } from "../models/base/interface";
import { useClientData } from "./core/useClientData";
import { checkPermission } from "../utils/permissionUtils";

export const useUserData = ({
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
    data: users,
    dataById: user,
    newData: newUser,
    deletedId,
    summary,
    errors,
    loading,
    pagination,
    isCheckAdd,
    isCheckDelete,
    isCheckUpdate,
  } = useSelector((state: RootState) => state.User as BaseState<IUser>, shallowEqual);
  const { info, permissions } = useClientData();
  const fetchIUser = () => {
    if (isLockHook || !checkPermission(permissions, "user", "read")) return;
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

  const addUser = checkPermission(permissions, "user", "create")
    ? (newUser: IUser) => {
        dispatch(addItem(newUser));
      }
    : undefined;

  const getUser = checkPermission(permissions, "user", "read")
    ? (id: string) => {
        dispatch(getItem(id));
      }
    : undefined;

  const updateUser = checkPermission(permissions, "user", "update")
    ? (updatedUser: Partial<IUser>) => {
        dispatch(updateItem(updatedUser));
      }
    : undefined;

  const deleteUser = checkPermission(permissions, "user", "delete")
    ? (id: string) => {
        dispatch(deleteItem(id));
      }
    : undefined;

  useEffect(() => {
    if (!id) return;
    getUser?.(id);
  }, [id, reload, permissions]);

  useEffect(() => {
    fetchIUser();
  }, [dispatch, page, size, keyword, sortBy, sortOrder, isLockHook, status, reload, permissions]);

  useEffect(() => {
    if (!user) return;
    dispatch(resetItem());
  }, [user]);

  useEffect(() => {
    if (!newUser) return;
    dispatch(resetNewData());
  }, [newUser]);

  useEffect(() => {
    if (!isCheckAdd && !isCheckDelete && !isCheckUpdate) return;

    fetchIUser();
    dispatch(reset());
    onCloseModal?.();
  }, [isCheckAdd, isCheckDelete, isCheckUpdate]);

  return {
    users,
    user,
    newUser,
    deletedId,
    errors,
    loading,
    pagination,
    isCheckAdd,
    isCheckUpdate,
    isCheckDelete,
    summary,
    addUser,
    getUser,
    updateUser,
    deleteUser,
  };
};
