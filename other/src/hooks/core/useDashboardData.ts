import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { RootState } from "../../stores";
import {
  getOverview,
  getProfit,
  getSales,
  getProduct,
  getDetailProduct,
} from "../../stores/dashboard/slice";
import { useEffect } from "react";
import { UseDataParams } from "../../models/base/interface";
import { useClientData } from "./useClientData";
import { checkPermission } from "../../utils/permissionUtils";

export type DashboardDataType = "overview" | "profit" | "sales" | "product" | "detail-product";
interface Params extends UseDataParams {
  type: DashboardDataType;
  productId?: string; // Xem chi tiết 1 sản phẩm cụ thể (dùng cho tab Product)
}
export const useDashboardData = ({
  startAt,
  endAt,
  storeId,
  isLockHook,
  reload,
  type,
  productId,
}: Params) => {
  const dispatch = useDispatch();
  const { overviewData, profitData, salesData, productData, detailProductData, loading } =
    useSelector((state: RootState) => state.Dashboard, shallowEqual);

  const { permissions } = useClientData();

  const canView = checkPermission(permissions, "report", "read");

  const getDashboard = () => {
    if (isLockHook || !canView) return;
    switch (type) {
      case "overview":
        dispatch(
          getOverview({
            startAt,
            endAt,
            storeId,
          }),
        );
        break;

      case "profit":
        dispatch(
          getProfit({
            startAt,
            endAt,
            storeId,
          }),
        );
        break;

      case "sales":
        dispatch(
          getSales({
            startAt,
            endAt,
            storeId,
          }),
        );
        break;

      case "product":
        dispatch(
          getProduct({
            startAt,
            endAt,
            storeId,
          }),
        );
        break;

      case "detail-product":
        if (productId) {
          dispatch(
            getDetailProduct({
              startAt,
              endAt,
              storeId,
              productId,
            }),
          );
        }
        break;

      default:
        return;
    }
  };

  useEffect(() => {
    getDashboard();
  }, [dispatch, isLockHook, permissions, reload, storeId, startAt, endAt, type, productId]);

  return { canView, overviewData, profitData, salesData, productData, detailProductData, loading };
};
