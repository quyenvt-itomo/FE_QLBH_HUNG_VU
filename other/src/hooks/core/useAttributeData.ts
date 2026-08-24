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
  resetNewData,
} from "../../stores/attribute/slice";
import { useEffect } from "react";
import { useClientData } from "./useClientData";
import { UseDataParams } from "../../models/base/interface";
import { IAttribute } from "../../models/base/attribute";
import { AttributeTypeEnum, SortOrder, attributeSystemModuleMap } from "../../constants/enum";
import { checkPermission } from "../../utils/permissionUtils";

interface Params extends UseDataParams {
  type: AttributeTypeEnum;
}

export const useAttributeData = ({ type, onCloseModal, isLockHook, size, reload }: Params) => {
  const dispatch = useDispatch();
  const {
    data: attributes,
    dataById: attribute,
    newData: newAttribute,
    errors,
    loading,
    pagination,
    isCheckAdd,
    isCheckDelete,
    isCheckUpdate,
  } = useSelector((state: RootState) => state.Attribute as BaseState<IAttribute>, shallowEqual);
  const { info, permissions } = useClientData();

  const fetchIAttribute = () => {
    if (isLockHook || !type) return;
    const moduleName = attributeSystemModuleMap[type] as any;
    if (!checkPermission(permissions, moduleName, "read")) return;
    dispatch(
      getAll({
        type,
        size,
        sortBy: "createdAt",
        sortOrder: SortOrder.ASC,
      }),
    );
  };

  const addAttribute =
    type && checkPermission(permissions, attributeSystemModuleMap[type] as any, "create")
      ? (newAttribute: IAttribute) => {
          dispatch(addItem(newAttribute));
        }
      : undefined;

  const getAttribute =
    type && checkPermission(permissions, attributeSystemModuleMap[type] as any, "read")
      ? (id: string) => {
          dispatch(getItem(id));
        }
      : undefined;

  const updateAttribute =
    type && checkPermission(permissions, attributeSystemModuleMap[type] as any, "update")
      ? (updatedAttribute: IAttribute) => {
          dispatch(updateItem(updatedAttribute));
        }
      : undefined;

  const deleteAttribute =
    type && checkPermission(permissions, attributeSystemModuleMap[type] as any, "delete")
      ? (id: string) => {
          dispatch(deleteItem(id));
        }
      : undefined;

  useEffect(() => {
    fetchIAttribute();
  }, [dispatch, type, isLockHook, size, permissions, reload]);

  useEffect(() => {
    if (!newAttribute) return;
    dispatch(resetNewData());
  }, [newAttribute]);

  useEffect(() => {
    if (!isCheckAdd && !isCheckDelete && !isCheckUpdate) return;

    fetchIAttribute();
    dispatch(reset());
    onCloseModal?.();
  }, [isCheckAdd, isCheckDelete, isCheckUpdate]);

  return {
    attributes,
    attribute,
    newAttribute,
    errors,
    loading,
    pagination,
    isCheckAdd,
    isCheckUpdate,
    isCheckDelete,
    addAttribute,
    getAttribute,
    updateAttribute,
    deleteAttribute,
  };
};
