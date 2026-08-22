import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { RootState } from "../stores";
import { BaseState } from "../stores/baseReducers";
import { ISystemRole } from "../models/systemRole";
import {
  addItem,
  getAll,
  getItem,
  updateItem,
  deleteItem,
  reset,
  resetNewData,
  updatePermissionItem,
} from "../stores/systemRole/slice";
import { useEffect } from "react";
import { useClientData } from "./core/useClientData";
import { UseDataParams } from "../models/base/interface";
import { checkPermission } from "../utils/permissionUtils";

export const useSystemRoleData = ({ id, isLockHook, reload, onCloseModal }: UseDataParams) => {
  const dispatch = useDispatch();
  const {
    data: systemRoleData,
    dataById: systemRoleDataById,
    newData: newSystemRoleData,
    errors,
    loading,
    pagination,
    isCheckAdd,
    isCheckDelete,
    isCheckUpdate,
  } = useSelector((state: RootState) => state.SystemRole as BaseState<ISystemRole>, shallowEqual);
  const { info, permissions } = useClientData();

  const fetchSystemRoleData = () => {
    if (isLockHook || !checkPermission(permissions, "systemPermission", "read")) return;
    dispatch(
      getAll({
        page: 1,
        size: 1000,
      }),
    );
  };

  const addSystemRole = checkPermission(permissions, "systemPermission", "create")
    ? (newSystemRole: ISystemRole) => {
        dispatch(addItem(newSystemRole));
      }
    : undefined;

  const getSystemRole = checkPermission(permissions, "systemPermission", "read")
    ? (id: string) => {
        dispatch(getItem(id));
      }
    : undefined;

  const updateSystemRole = checkPermission(permissions, "systemPermission", "update")
    ? (updatedSystemRole: Partial<ISystemRole>) => {
        dispatch(updateItem(updatedSystemRole));
      }
    : undefined;

  const updatePermissionSystemRole = checkPermission(permissions, "systemPermission", "update")
    ? (updatedSystemRole: Partial<ISystemRole>) => {
        dispatch(updatePermissionItem(updatedSystemRole));
      }
    : undefined;

  const deleteSystemRole = checkPermission(permissions, "systemPermission", "delete")
    ? (id: string) => {
        dispatch(deleteItem(id));
      }
    : undefined;

  useEffect(() => {
    if (!id) return;
    getSystemRole?.(id);
  }, [id, reload, permissions]);

  useEffect(() => {
    fetchSystemRoleData();
  }, [dispatch, isLockHook, permissions]);

  useEffect(() => {
    if (!newSystemRoleData) return;
    dispatch(resetNewData());
  }, [newSystemRoleData]);

  useEffect(() => {
    if (!isCheckAdd && !isCheckDelete && !isCheckUpdate) return;

    fetchSystemRoleData();
    dispatch(reset());
    onCloseModal?.();
  }, [isCheckAdd, isCheckDelete, isCheckUpdate]);

  return {
    systemRoleData,
    systemRoleDataById,
    newSystemRoleData,
    errors,
    loading,
    pagination,
    isCheckAdd,
    isCheckUpdate,
    isCheckDelete,
    addSystemRole,
    getSystemRole,
    updateSystemRole,
    updatePermissionSystemRole,
    deleteSystemRole,
  };
};
