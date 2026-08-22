import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { RootState } from "../../stores";
import { getDebtReport, getDebtTransaction } from "../../stores/debt/slice";
import { useEffect } from "react";
import { useClientData } from "../core/useClientData";
import { UseDataParams } from "../../models/base/interface";
import { checkPermission } from "../../utils/permissionUtils";
import { PartnerDebtSideEnum } from "../../constants/enum";

interface Params extends UseDataParams {
  partnerId?: string;
  side: PartnerDebtSideEnum;
}

export const useDebtData = ({
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
  partnerId,
  storeId,
  side,
}: Params) => {
  const dispatch = useDispatch();
  const { debtReports, debtTransactions, summary, transactionSummary, loading, pagination } =
    useSelector((state: RootState) => state.Debt, shallowEqual);
  const { permissions } = useClientData();

  const fetchDebtReportData = () => {
    if (isLockHook || !checkPermission(permissions, "debtReport", "read")) return;
    dispatch(
      getDebtReport({
        page,
        size,
        keyword,
        startAt,
        endAt,
        sortBy,
        sortOrder,
        storeId,
        side,
        ...filter,
        ...ranger,
        ...search,
      }),
    );
  };

  useEffect(() => {
    fetchDebtReportData();
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
    side,
    permissions,
  ]);

  const fetchDebtTransactionData = () => {
    if (!checkPermission(permissions, "debtReport", "read") || !partnerId) return;
    dispatch(
      getDebtTransaction({
        startAt,
        endAt,
        partnerId,
        storeId,
        side,
      }),
    );
  };

  useEffect(() => {
    fetchDebtTransactionData();
  }, [dispatch, startAt, endAt, permissions, partnerId, storeId, reload, side]);

  return {
    debtReports,
    debtTransactions,
    summary,
    transactionSummary,
    loading,
    pagination,
  };
};
