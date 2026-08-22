import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { RootState } from "../../stores";
import { getFundBalanceReport, getFundBalanceTransaction } from "../../stores/fundBalance/slice";
import { useEffect } from "react";
import { useClientData } from "../core/useClientData";
import { UseDataParams } from "../../models/base/interface";
import { checkPermission } from "../../utils/permissionUtils";

interface Params extends UseDataParams {
  fundId?: string;
}

export const useFundBalanceData = ({
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
  fundId,
  storeId,
}: Params) => {
  const dispatch = useDispatch();
  const { fundBalanceReports, fundBalanceTransactions, summary, loading, pagination } = useSelector(
    (state: RootState) => state.FundBalance,
    shallowEqual,
  );
  const { info, permissions } = useClientData();

  const fetchFundBalanceReportData = () => {
    if (isLockHook || !checkPermission(permissions, "fundReport", "read")) return;
    dispatch(
      getFundBalanceReport({
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

  useEffect(() => {
    fetchFundBalanceReportData();
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
    storeId,
    permissions,
  ]);

  const fetchFundBalanceTransactionData = () => {
    if (!checkPermission(permissions, "fundReport", "read") || !fundId) return;
    dispatch(
      getFundBalanceTransaction({
        startAt,
        endAt,
        fundId,
      }),
    );
  };

  useEffect(() => {
    fetchFundBalanceTransactionData();
  }, [dispatch, startAt, endAt, permissions, fundId, reload]);

  return {
    fundBalanceReports,
    fundBalanceTransactions,
    summary,
    loading,
    pagination,
  };
};
