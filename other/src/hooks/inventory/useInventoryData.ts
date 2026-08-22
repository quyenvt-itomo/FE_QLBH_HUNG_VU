import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { RootState } from "../../stores";
import { getInventoryReport, getInventoryTransaction } from "../../stores/inventory/slice";
import { useEffect } from "react";
import { useClientData } from "../core/useClientData";
import { UseDataParams } from "../../models/base/interface";
import { checkPermission } from "../../utils/permissionUtils";

interface Params extends UseDataParams {
  productId?: string;
  productVariantId?: string;
  refType?: string;
}

export const useInventoryData = ({
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
  productId,
  productVariantId,
  refType,
  storeId,
}: Params) => {
  const dispatch = useDispatch();
  const {
    inventoryReports,
    inventoryTransactions,
    summary,
    transactionSummary,
    transactionPagination,
    loading,
    pagination,
  } = useSelector((state: RootState) => state.Inventory, shallowEqual);
  const { permissions } = useClientData();

  const fetchInventoryReportData = () => {
    if (isLockHook || !checkPermission(permissions, "inventoryReport", "read")) return;
    dispatch(
      getInventoryReport({
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
    fetchInventoryReportData();
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

  const fetchInventoryTransactionData = () => {
    if (!checkPermission(permissions, "inventoryReport", "read") || !productId) return;
    dispatch(
      getInventoryTransaction({
        page,
        size,
        startAt,
        endAt,
        productId,
        productVariantId,
        storeId,
        refType,
      }),
    );
  };

  useEffect(() => {
    fetchInventoryTransactionData();
  }, [
    dispatch,
    page,
    size,
    startAt,
    endAt,
    permissions,
    productId,
    productVariantId,
    storeId,
    refType,
    reload,
  ]);

  return {
    inventoryReports,
    inventoryTransactions,
    summary,
    transactionSummary,
    transactionPagination,
    loading,
    pagination,
  };
};
