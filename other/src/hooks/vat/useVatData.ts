import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { RootState } from "../../stores";
import { getVatTransaction } from "../../stores/vat/slice";
import { useEffect } from "react";
import { useClientData } from "../core/useClientData";
import { UseDataParams } from "../../models/base/interface";
import { checkPermission } from "../../utils/permissionUtils";

export const useVatData = ({
  startAt,
  endAt,
  isLockHook,
  reload,
  storeId,
  offsetAt,
}: UseDataParams) => {
  const dispatch = useDispatch();
  const { vatTransactions, summary, loading, pagination } = useSelector(
    (state: RootState) => state.Vat,
    shallowEqual,
  );
  const { permissions } = useClientData();

  const fetchVatTransactionData = () => {
    if (isLockHook || !checkPermission(permissions, "vatReport", "read")) return;
    dispatch(
      getVatTransaction({
        startAt,
        endAt,
        storeId,
      }),
    );
  };

  useEffect(() => {
    fetchVatTransactionData();
  }, [dispatch, startAt, endAt, permissions, storeId, reload]);

  return {
    vatTransactions,
    summary,
    loading,
    pagination,
  };
};
