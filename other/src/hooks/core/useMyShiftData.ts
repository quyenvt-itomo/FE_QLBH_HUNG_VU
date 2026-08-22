import { useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { RootState } from "../../stores";
import { getShift } from "../../stores/auth/slice";
import { UseDataParams } from "../../models/base/interface";

export const useMyShiftData = ({
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
  status,
}: UseDataParams) => {
  const dispatch = useDispatch();
  const { shiftData, shiftLoading, shiftPagination, shiftSummary } = useSelector(
    (state: RootState) => state.Auth,
    shallowEqual,
  );

  const fetchMyShiftData = () => {
    if (isLockHook) return;
    dispatch(
      getShift({
        page,
        size,
        keyword,
        startAt,
        endAt,
        sortBy,
        sortOrder,
        type,
        status,
        ...filter,
        ...ranger,
        ...search,
      }),
    );
  };

  useEffect(() => {
    fetchMyShiftData();
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
    type,
    status,
  ]);

  return {
    shiftData,
    shiftLoading,
    shiftPagination,
    shiftSummary,
  };
};
