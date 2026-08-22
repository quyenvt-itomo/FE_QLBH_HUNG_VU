import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { RootState } from "../../stores";
import { BaseState } from "../../stores/baseReducers";
import { IContact } from "../../models/partnerContact";
import {
  addItem,
  updateItem,
  deleteItem,
  reset,
} from "../../stores/customer/customerContact/slice";
import { useEffect } from "react";
import { useClientData } from "../core/useClientData";
import { UseDataParams } from "../../models/base/interface";
import { checkPermission } from "../../utils/permissionUtils";

interface Params extends UseDataParams {
  partnerId?: string;
}
export const useCustomerContactData = ({ partnerId, onCloseModal }: Params) => {
  const dispatch = useDispatch();
  const { errors, loading, isCheckAdd, isCheckDelete, isCheckUpdate } = useSelector(
    (state: RootState) => state.CustomerContact as BaseState<IContact>,
    shallowEqual,
  );
  const { permissions } = useClientData();
  const canUpdate = checkPermission(permissions, "customer", "update");

  const addCustomerContact = canUpdate
    ? (newCustomerContact: IContact) => {
        if (!partnerId) return;
        dispatch(addItem({ ...newCustomerContact, partnerId }));
      }
    : undefined;

  const updateCustomerContact = canUpdate
    ? (updatedCustomerContact: Partial<IContact>) => {
        if (!partnerId) return;
        dispatch(updateItem({ ...updatedCustomerContact, partnerId }));
      }
    : undefined;

  const deleteCustomerContact = canUpdate
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
    addCustomerContact,
    updateCustomerContact,
    deleteCustomerContact,
  };
};
