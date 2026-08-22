import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { RootState } from "../../stores";
import { BaseSettingState } from "../../stores/baseSettingReducers";
import { FormatData } from "../../models/base/format";
import { getItem, reset, updateItem } from "../../stores/setting/slice";
import { useEffect } from "react";
import { getInfo } from "../../stores/auth/slice";
import { useClientData } from "./useClientData";
import { UseDataParams } from "../../models/base/interface";

export const useSettingData = ({ onCloseModal, isLockHook }: UseDataParams) => {
  const dispatch = useDispatch();
  const {
    data: formatData,
    errors,
    loading,
    isCheckUpdate,
  } = useSelector(
    (state: RootState) => state.Setting as BaseSettingState<FormatData>,
    shallowEqual,
  );
  const { info } = useClientData();

  const getSetting = () => {
    if (isLockHook || !info) return;
    dispatch(getItem());
  };

  const updateSetting = (updatedFormat: FormatData) => {
    dispatch(updateItem(updatedFormat));
  };

  useEffect(() => {
    getSetting();
  }, [dispatch, isLockHook, info]);

  useEffect(() => {
    if (!isCheckUpdate) return;

    getSetting();
    dispatch(reset());
    dispatch(getInfo());
    onCloseModal?.();
  }, [isCheckUpdate]);

  return {
    formatData,
    errors,
    loading,
    isCheckUpdate,
    getSetting,
    updateSetting,
  };
};
