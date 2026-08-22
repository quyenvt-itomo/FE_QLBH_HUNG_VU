import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { RootState } from "../stores";
import { BaseState } from "../stores/baseReducers";
import { IEmployee } from "../models/store/employee";
import {
  addItem,
  getAll,
  getItem,
  updateItem,
  deleteItem,
  reset,
  resetItem,
  resetNewData,
} from "../stores/employee/slice";
import { useEffect } from "react";
import { useClientData } from "./core/useClientData";
import { UseDataParams } from "../models/base/interface";
import { checkPermission } from "../utils/permissionUtils";

export const useEmployeeData = ({
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
    data: employees,
    dataById: employee,
    newData: newEmployee,
    deletedId,
    summary,
    errors,
    loading,
    pagination,
    isCheckAdd,
    isCheckDelete,
    isCheckUpdate,
  } = useSelector((state: RootState) => state.Employee as BaseState<IEmployee>, shallowEqual);
  const { permissions } = useClientData();

  const fetchEmployeeData = () => {
    if (isLockHook || !checkPermission(permissions, "employee", "read")) return;
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

  const addEmployee = checkPermission(permissions, "employee", "create")
    ? (newEmployee: IEmployee) => {
        dispatch(addItem(newEmployee));
      }
    : undefined;

  const getEmployee = checkPermission(permissions, "employee", "read")
    ? (id: string) => {
        dispatch(getItem(id));
      }
    : undefined;

  const updateEmployee = checkPermission(permissions, "employee", "update")
    ? (updatedEmployee: Partial<IEmployee>) => {
        dispatch(updateItem(updatedEmployee));
      }
    : undefined;

  const deleteEmployee = checkPermission(permissions, "employee", "delete")
    ? (id: string) => {
        dispatch(deleteItem(id));
      }
    : undefined;

  useEffect(() => {
    if (!id) return;
    getEmployee?.(id);
  }, [id, reload, permissions]);

  useEffect(() => {
    fetchEmployeeData();
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
    if (!employee) return;
    dispatch(resetItem());
  }, [employee]);

  useEffect(() => {
    if (!newEmployee) return;
    dispatch(resetNewData());
  }, [newEmployee]);

  useEffect(() => {
    if (!isCheckAdd && !isCheckDelete && !isCheckUpdate) return;

    fetchEmployeeData();
    dispatch(reset());
    onCloseModal?.();
  }, [isCheckAdd, isCheckDelete, isCheckUpdate]);

  return {
    employees,
    employee,
    newEmployee,
    deletedId,
    summary,
    errors,
    loading,
    pagination,
    isCheckAdd,
    isCheckUpdate,
    isCheckDelete,
    addEmployee,
    getEmployee,
    updateEmployee,
    deleteEmployee,
  };
};
