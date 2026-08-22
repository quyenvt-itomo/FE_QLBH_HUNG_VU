import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { RootState } from "../../stores";
import { BaseState } from "../../stores/baseReducers";
import { IRole } from "../../models/store/role";
import {
  addItem,
  getAll,
  getItem,
  updateItem,
  deleteItem,
  reset,
  resetNewData,
  updatePermissionItem,
} from "../../stores/role/slice";
import { useEffect } from "react";
import { useClientData } from "./useClientData";
import { UseDataParams } from "../../models/base/interface";
import { checkPermission } from "../../utils/permissionUtils";

interface RoleDataParams extends UseDataParams {
  storeId?: string;
}

export const useRoleData = ({ id, isLockHook, storeId, reload, onCloseModal }: RoleDataParams) => {
  const dispatch = useDispatch();
  const {
    data: roleData,
    dataById: roleDataById,
    newData: newRoleData,
    errors,
    loading,
    pagination,
    isCheckAdd,
    isCheckDelete,
    isCheckUpdate,
  } = useSelector((state: RootState) => state.Role as BaseState<IRole>, shallowEqual);
  const { permissions } = useClientData();

  const fetchRoleData = () => {
    if (isLockHook || !checkPermission(permissions, "permission", "read")) return;
    dispatch(
      getAll({
        page: 1,
        size: 1000,
        storeId,
      }),
    );
  };

  const addRole = checkPermission(permissions, "permission", "create")
    ? (newRole: IRole) => {
        dispatch(addItem(newRole));
      }
    : undefined;

  const getRole = checkPermission(permissions, "permission", "read")
    ? (id: string) => {
        dispatch(getItem(id));
      }
    : undefined;

  const updateRole = checkPermission(permissions, "permission", "update")
    ? (updatedRole: IRole) => {
        dispatch(updateItem(updatedRole));
      }
    : undefined;

  const updatePermissionRole = checkPermission(permissions, "permission", "update")
    ? (updatedRole: IRole) => {
        dispatch(updatePermissionItem(updatedRole));
      }
    : undefined;

  const deleteRole = checkPermission(permissions, "permission", "delete")
    ? (id: string) => {
        dispatch(deleteItem(id));
      }
    : undefined;

  useEffect(() => {
    if (!id) return;
    getRole?.(id);
  }, [id, reload, permissions]);

  useEffect(() => {
    fetchRoleData();
  }, [dispatch, isLockHook, permissions, storeId]);

  useEffect(() => {
    if (!newRoleData) return;
    dispatch(resetNewData());
  }, [newRoleData]);

  useEffect(() => {
    if (!isCheckAdd && !isCheckDelete && !isCheckUpdate) return;

    fetchRoleData();
    dispatch(reset());
    onCloseModal?.();
  }, [isCheckAdd, isCheckDelete, isCheckUpdate]);

  return {
    roleData,
    roleDataById,
    newRoleData,
    errors,
    loading,
    pagination,
    isCheckAdd,
    isCheckUpdate,
    isCheckDelete,
    addRole,
    getRole,
    updateRole,
    updatePermissionRole,
    deleteRole,
  };
};
