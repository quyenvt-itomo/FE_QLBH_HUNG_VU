import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { RootState } from "../../stores";
import { BaseState } from "../../stores/baseReducers";
import { IContact } from "../../models/partnerContact";
import {
  addItem,
  updateItem,
  deleteItem,
  reset,
} from "../../stores/supplier/supplierContact/slice";
import { useEffect } from "react";
import { useClientData } from "../core/useClientData";
import { UseDataParams } from "../../models/base/interface";
import { checkPermission } from "../../utils/permissionUtils";

interface Params extends UseDataParams {
  partnerId?: string;
}
export const useSupplierContactData = ({ partnerId, onCloseModal }: Params) => {
  const dispatch = useDispatch();
  const { errors, loading, isCheckAdd, isCheckDelete, isCheckUpdate } = useSelector(
    (state: RootState) => state.SupplierContact as BaseState<IContact>,
    shallowEqual,
  );
  const { permissions } = useClientData();
  const canUpdate = checkPermission(permissions, "supplier", "update");

  const addSupplierContact = canUpdate
    ? (newSupplierContact: IContact) => {
        if (!partnerId) return;
        dispatch(addItem({ ...newSupplierContact, partnerId }));
      }
    : undefined;

  const updateSupplierContact = canUpdate
    ? (updatedSupplierContact: Partial<IContact>) => {
        if (!partnerId) return;
        dispatch(updateItem({ ...updatedSupplierContact, partnerId }));
      }
    : undefined;

  const deleteSupplierContact = canUpdate
    ? (id: string) => {
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
    addSupplierContact,
    updateSupplierContact,
    deleteSupplierContact,
  };
};
