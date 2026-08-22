import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { UseDataParams } from "../../models/base/interface";
import { PartnerTypeEnum } from "../../constants/enum";
import { RootState } from "../../stores";
import { BaseState } from "../../stores/baseReducers";
import { IPartner } from "../../models/partner";
import { useClientData } from "../core/useClientData";
import {
  getAll,
  addItem,
  updateItem,
  deleteItem,
  getItem,
  resetItem,
  resetNewData,
  reset,
} from "../../stores/partner/slice";
import { useEffect } from "react";

interface PartnerDataParams extends Omit<UseDataParams, "type"> {
  type?: PartnerTypeEnum;
}

export const usePartnerData = ({
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
  type,
  offsetAt,
  onCloseModal,
}: PartnerDataParams) => {
  const dispatch = useDispatch();
  const {
    data: partners,
    dataById: partner,
    newData: newPartner,
    deletedId,
    summary,
    errors,
    loading,
    pagination,
    isCheckAdd,
    isCheckDelete,
    isCheckUpdate,
  } = useSelector((state: RootState) => state.Partner as BaseState<IPartner>, shallowEqual);
  const { info } = useClientData();

  const fetchPartnerData = () => {
    if (isLockHook || !info) return;
    dispatch(
      getAll({
        page,
        size,
        keyword,
        startAt,
        endAt,
        sortBy,
        sortOrder,
        role: type,
        offsetAt,
        ...filter,
        ...ranger,
        ...search,
      }),
    );
  };

  const addPartner = (newPartner: IPartner) => {
    dispatch(addItem(newPartner));
  };

  const getPartner = (id: string) => {
    dispatch(getItem(id));
  };

  const updatePartner = (updatedPartner: Partial<IPartner>) => {
    dispatch(updateItem(updatedPartner));
  };

  const deletePartner = (id: string) => {
    dispatch(deleteItem(id));
  };

  useEffect(() => {
    fetchPartnerData();
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
    info,
    type,
    offsetAt,
  ]);

  useEffect(() => {
    if (!partner) return;
    dispatch(resetItem());
  }, [partner]);

  useEffect(() => {
    if (!newPartner) return;
    dispatch(resetNewData());
  }, [newPartner]);

  useEffect(() => {
    if (!isCheckAdd && !isCheckDelete && !isCheckUpdate) return;

    fetchPartnerData();
    dispatch(reset());
    onCloseModal?.();
  }, [isCheckAdd, isCheckDelete, isCheckUpdate]);

  return {
    partners,
    partner,
    newPartner,
    deletedId,
    summary,
    errors,
    loading,
    pagination,
    isCheckAdd,
    isCheckUpdate,
    isCheckDelete,
    addPartner,
    getPartner,
    updatePartner,
    deletePartner,
  };
};
