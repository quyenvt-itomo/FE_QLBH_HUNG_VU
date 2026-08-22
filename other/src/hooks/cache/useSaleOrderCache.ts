import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../stores";
import {
  addCachedOrder,
  updateCachedOrder,
  removeCachedOrder,
  setCurrentCacheId,
  clearAllCachedOrders,
  IOrderCache,
} from "../../stores/cache/saleOrderCache";
import { useCallback, useMemo } from "react";
import { randomId } from "../../utils/common";
import { useClientData } from "../core/useClientData";
import { setFormCode } from "../../utils/formUtils";
import { DiscountTypeEnum } from "../../constants/enum";

export const useSaleOrderCache = () => {
  const dispatch = useDispatch();
  const { cachedOrders, currentCacheId } = useSelector((state: RootState) => state.SaleOrderCache);
  const { currentStore, info } = useClientData();

  // Lấy đơn hàng hiện tại đang chỉnh sửa
  const currentOrder = useMemo(
    () =>
      cachedOrders.find(
        (order) => order.id === currentCacheId && order.storeId === currentStore?.id,
      ),
    [cachedOrders, currentCacheId, currentStore],
  );

  // Thêm hoặc cập nhật đơn hàng vào cache
  const saveToCache = useCallback(
    (order: Omit<IOrderCache, "createdAt" | "updatedAt">) => {
      const orderToSave: IOrderCache = {
        ...order,
        createdAt: order.id
          ? currentOrder?.createdAt || new Date().toISOString()
          : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      dispatch(addCachedOrder(orderToSave));
      dispatch(setCurrentCacheId(orderToSave.id));
      return orderToSave.id;
    },
    [dispatch, currentOrder],
  );

  // Tạo đơn hàng mới
  const createNewCache = useCallback(
    async (initialData?: Partial<IOrderCache>) => {
      if (!currentStore) return;
      const newId: string = randomId();
      const newCode = await setFormCode({ type: "sale" });

      const newOrder: IOrderCache = {
        storeId: currentStore.id,
        code: newCode,
        id: newId,
        tempId: newId,
        lines: initialData?.lines || [],

        partner: initialData?.partner || undefined,
        partnerId: initialData?.partnerId || undefined,

        discountType: initialData?.discountType || DiscountTypeEnum.AMOUNT,
        discountValue: initialData?.discountValue || 0,
        loyaltyPointsUsed: initialData?.loyaltyPointsUsed || 0,

        employee: initialData?.employee || info?.employee,
        employeeId: initialData?.employeeId || info?.employee?.id,

        note: initialData?.note,
      };

      if (info?.defaultFund) {
        (newOrder as any).payments = [
          {
            fundId: info.defaultFund.id,
            fund: info.defaultFund,
            amount: 0,
          },
        ];
      }
      dispatch(addCachedOrder(newOrder));
      dispatch(setCurrentCacheId(newOrder.id));
      return newOrder.id;
    },
    [dispatch, currentStore],
  );

  // Cập nhật đơn hàng
  const updateCache = useCallback(
    (id: string, data: Partial<IOrderCache>) => {
      dispatch(updateCachedOrder({ id, data }));
    },
    [dispatch],
  );

  // Cập nhật đơn hàng hiện tại
  const updateCurrentCache = useCallback(
    (data: Partial<IOrderCache>) => {
      if (currentCacheId) {
        dispatch(updateCachedOrder({ id: currentCacheId, data }));
      }
    },
    [dispatch, currentCacheId],
  );

  // Xóa đơn hàng khỏi cache
  const removeFromCache = useCallback(
    (id: string) => {
      dispatch(removeCachedOrder(id));
      if (currentCacheId === id) {
        dispatch(setCurrentCacheId(undefined));
      }
    },
    [dispatch],
  );

  // Xóa đơn hàng hiện tại
  const removeCurrentCache = useCallback(() => {
    if (currentCacheId) {
      dispatch(removeCachedOrder(currentCacheId));
    }
  }, [dispatch, currentCacheId]);

  // Chọn đơn hàng để chỉnh sửa
  const selectCache = useCallback(
    (id: string) => {
      dispatch(setCurrentCacheId(id));
    },
    [dispatch],
  );

  // Bỏ chọn đơn hàng
  const deselectCache = useCallback(() => {
    dispatch(setCurrentCacheId(undefined));
  }, [dispatch]);

  // Xóa tất cả cache
  const clearCache = useCallback(() => {
    dispatch(clearAllCachedOrders());
  }, [dispatch]);

  // Lấy đơn hàng theo ID
  const getCacheById = useCallback(
    (id: string) => {
      return cachedOrders.find((order) => order.id === id);
    },
    [cachedOrders],
  );

  const filterOrdersByStore = [...cachedOrders].filter(
    (order) => order.storeId === currentStore?.id,
  );

  return {
    // Data
    cachedOrders: filterOrdersByStore,
    currentCacheId,
    currentOrder,
    totalCached: filterOrdersByStore.length,

    // Actions
    saveToCache,
    createNewCache,
    updateCache,
    updateCurrentCache,
    removeFromCache,
    removeCurrentCache,
    selectCache,
    deselectCache,
    clearCache,
    getCacheById,
  };
};
