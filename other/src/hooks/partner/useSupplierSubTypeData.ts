import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { RootState } from "../../stores";
import { BaseState } from "../../stores/baseReducers";
import { IPartnerSubType } from "../../models/partnerSubType";
import {
  addItem,
  updateItem,
  deleteItem,
  reset,
} from "../../stores/supplier/supplierSubType/slice";
import { useEffect } from "react";
import { useClientData } from "../core/useClientData";
import { UseDataParams } from "../../models/base/interface";
import { checkPermission } from "../../utils/permissionUtils";

interface Params extends UseDataParams {
  partnerId?: string;
}
export const useSupplierSubTypeData = ({ partnerId, onCloseModal }: Params) => {
  const dispatch = useDispatch();
  const { errors, loading, isCheckAdd, isCheckDelete, isCheckUpdate } = useSelector(
    (state: RootState) => state.SupplierSubType as BaseState<IPartnerSubType>,
    shallowEqual,
  );
  const { permissions } = useClientData();
  const canUpdate = checkPermission(permissions, "supplier", "update");

  const addSubType = canUpdate
    ? (newSubType: Partial<IPartnerSubType>) => {
        if (!partnerId) return;
        dispatch(addItem({ ...newSubType, partnerId }));
      }
    : undefined;

  const updateSubType = canUpdate
    ? (updatedSubType: Partial<IPartnerSubType>) => {
        if (!partnerId) return;
        dispatch(updateItem({ ...updatedSubType, partnerId }));
      }
    : undefined;

  const deleteSubType = canUpdate
    ? (id: string) => {
        console.log({
          partnerId,
        });
        if (!partnerId) return;
        dispatch(deleteItem({ partnerId, id }));
      }
    : undefined;

  useEffect(() => {
    if (!isCheckAdd && !isCheckDelete && !isCheckUpdate) return;

    dispatch(reset());
    onCloseModal?.();
  }, [isCheckAdd, isCheckDelete, isCheckUpdate]);

  return {
    errors,
    loading,
    isCheckAdd,
    isCheckUpdate,
    isCheckDelete,
    canUpdate,
    addSubType,
    updateSubType,
    deleteSubType,
  };
};
