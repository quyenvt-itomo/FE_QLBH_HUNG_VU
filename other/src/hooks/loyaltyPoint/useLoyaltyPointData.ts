import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { RootState } from "../../stores";
import { getLoyaltyPointReport, getLoyaltyPointTransaction } from "../../stores/loyaltyPoint/slice";
import { useEffect } from "react";
import { useClientData } from "../core/useClientData";
import { UseDataParams } from "../../models/base/interface";
import { checkPermission } from "../../utils/permissionUtils";

interface Params extends UseDataParams {
  partnerId?: string;
}

export const useLoyaltyPointData = ({
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
}: Params) => {
  const dispatch = useDispatch();
  const {
    loyaltyPointReports,
    loyaltyPointTransactions,
    summary,
    transactionSummary,
    loading,
    pagination,
  } = useSelector((state: RootState) => state.LoyaltyPoint, shallowEqual);
  const { permissions } = useClientData();

  const fetchLoyaltyPointReportData = () => {
    if (isLockHook || !checkPermission(permissions, "loyaltyPointReport", "read")) return;
    dispatch(
      getLoyaltyPointReport({
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
    fetchLoyaltyPointReportData();
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

  const fetchLoyaltyPointTransactionData = () => {
    if (!checkPermission(permissions, "loyaltyPointReport", "read") || !partnerId) return;
    dispatch(
      getLoyaltyPointTransaction({
        startAt,
        endAt,
        partnerId,
        storeId,
      }),
    );
  };

  useEffect(() => {
    fetchLoyaltyPointTransactionData();
  }, [dispatch, startAt, endAt, permissions, partnerId, storeId, reload]);

  return {
    loyaltyPointReports,
    loyaltyPointTransactions,
    summary,
    transactionSummary,
    loading,
    pagination,
  };
};
