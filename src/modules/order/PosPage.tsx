import { App, Button, Empty, Input, Layout, Spin } from "antd";
import { ArrowLeftOutlined, PlusOutlined } from "@ant-design/icons";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

import { Product } from "@/modules/product/product.model";
import { useProductStore } from "@/modules/product/product.store";
import { collectUnits, getDefaultPricePerUnit } from "@/modules/product/product.util";
import { useSaleStore } from "@/modules/sale/store";
import { useSaleReturnStore } from "@/modules/saleReturn/store";
import { Order, OrderType } from "./order.model";
import { OrderProductSelect } from "./components/OrderProductSelect";
import { OrderLineTable, PosLine } from "./components/OrderLineTable";
import { PosInvoiceInfo, PosPayment } from "./components/PosInvoiceInfo";
import {
  addNewCache,
  CachedOrder,
  PosOrderType,
  removeOrderCache,
  setCurrentOrderCache,
  updateOrderCache,
} from "@/shared/stores/orderCache.slice";
import { RootState } from "@/shared/stores";
import { StoreCardLite } from "@/modules/store/components/Card";
import { icons } from "@/shared/assets/icons";
import { useGlobalData } from "@/shared/hooks/useGlobalData";
import { DiscountTypeEnum } from "@/shared/constants/enum";
import { formatMoney } from "@/shared/utils/number.util";
import { randomId } from "@/shared/utils/common.util";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { FundTypeEnum } from "@/modules/fund/fund.model";
import { ProductImage } from "@/shared/components";
import { getMainFile } from "@/shared/utils";

type PosLocationState = { order?: Order };

const POS_TYPE_PARAM = "type";
const POS_EDIT_PARAM = "editId";

const emptyOrder = (type: PosOrderType): Partial<CachedOrder> => ({
  type,
  orderAt: new Date().toISOString(),
  lines: [],
  returnLines: [],
  discountType: DiscountTypeEnum.AMOUNT,
  discountValue: 0,
  taxType: DiscountTypeEnum.PERCENT,
  taxValue: 0,
  returnDiscountType: DiscountTypeEnum.AMOUNT,
  returnDiscountValue: 0,
  returnTaxType: DiscountTypeEnum.PERCENT,
  returnTaxValue: 0,
  shippingFee: 0,
  isFreeShipping: true,
  paymentMode: FundTypeEnum.CASH,
  incomeExpenses: [{ amount: 0, fundId: null, fund: null }],
});

const CACHE_META_FIELDS = new Set(["id", "tempId", "label", "mode", "sourceId", "initialOrder"]);

const comparableCacheData = (cache: Partial<CachedOrder>) =>
  Object.fromEntries(Object.entries(cache).filter(([key]) => !CACHE_META_FIELDS.has(key)));

const hasCacheChanges = (cache: CachedOrder): boolean => {
  const lines = cache.type === OrderType.SALE_RETURN ? cache.returnLines : cache.lines;

  if (cache.mode === "create") return Boolean(lines?.length);
  if (!cache.initialOrder) return Boolean(lines?.length || cache.returnLines?.length);

  return (
    JSON.stringify(comparableCacheData(cache)) !==
    JSON.stringify(comparableCacheData(cache.initialOrder))
  );
};

const getProductPrice = (product: Product) => Number(product.salePrice ?? 0);

const calculateTotals = (lines: PosLine[], order: CachedOrder) => {
  const grossAmount = lines.reduce(
    (total, line) => total + Number(line.quantity || 0) * Number(line.unitPrice || 0),
    0,
  );
  const discountValue = Math.max(0, Number(order.discountValue || 0));
  const discountAmount =
    order.discountType === DiscountTypeEnum.PERCENT
      ? Math.min(grossAmount, (grossAmount * discountValue) / 100)
      : Math.min(grossAmount, discountValue);
  const netAmount = Math.max(0, grossAmount - discountAmount);
  const taxValue = Math.max(0, Number(order.taxValue || 0));
  const taxAmount =
    order.taxType === DiscountTypeEnum.PERCENT ? (netAmount * taxValue) / 100 : taxValue;
  const shippingFee = Math.max(0, Number(order.shippingFee || 0));
  const shippingAmount = order.isFreeShipping === false ? shippingFee : 0;

  return {
    grossAmount,
    discountAmount,
    netAmount,
    taxAmount,
    totalAmount: netAmount + taxAmount + shippingAmount,
  };
};

export const PosPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { message, modal } = App.useApp();
  const { currentStore, info, handleSetCurrentStore } = useGlobalData();
  const initializedEdit = useRef<string | null>(null);
  const customerSelectRef = useRef<HTMLDivElement>(null);

  const type: PosOrderType =
    searchParams.get(POS_TYPE_PARAM) === OrderType.SALE_RETURN
      ? OrderType.SALE_RETURN
      : OrderType.SALE;
  const editId = searchParams.get(POS_EDIT_PARAM);
  const locationState = location.state as PosLocationState | null;

  const saleStore = useSaleStore({ page: 1, size: 100, isLocked: !currentStore });
  const saleReturnStore = useSaleReturnStore({ page: 1, size: 100, isLocked: !currentStore });
  const orderStore = type === OrderType.SALE ? saleStore : saleReturnStore;
  const productStore = useProductStore({ page: 1, size: 16, isLocked: !currentStore });

  const { cachedOrders, currentCacheId } = useSelector((state: RootState) => state.OrderCache);
  const caches = useMemo(() => Object.values(cachedOrders), [cachedOrders]);
  const typeCaches = useMemo(() => caches.filter((item) => item.type === type), [caches, type]);
  const activeCache = cachedOrders[currentCacheId || ""];
  const activeOrder = activeCache?.type === type ? activeCache : undefined;
  const allStores = info?.allStores || [];

  useEffect(() => {
    if (!currentStore || editId || locationState?.order) return;
    if (typeCaches.some((item) => item.mode === "create")) return;
    dispatch(addNewCache({ type, order: emptyOrder(type) }));
  }, [currentStore, dispatch, editId, locationState?.order, type, typeCaches]);

  useEffect(() => {
    if (!currentStore || !editId || initializedEdit.current === editId) return;
    const existing = caches.find((item) => item.sourceId === editId);
    if (existing) {
      initializedEdit.current = editId;
      dispatch(setCurrentOrderCache(existing.id));
      return;
    }

    initializedEdit.current = editId;
    if (locationState?.order) {
      dispatch(
        addNewCache({
          type,
          mode: "edit",
          sourceId: editId,
          order: locationState.order as unknown as Partial<CachedOrder>,
        }),
      );
      return;
    }

    orderStore.getById?.(editId, {
      onSuccess: (order) => {
        if (!order) {
          message.error("Không tìm thấy phiếu cần chỉnh sửa");
          navigate(type === OrderType.SALE ? "/sales" : "/sales-returns");
          return;
        }
        dispatch(
          addNewCache({
            type,
            mode: "edit",
            sourceId: editId,
            order: order as unknown as Partial<CachedOrder>,
          }),
        );
      },
    });
  }, [
    caches,
    currentStore,
    dispatch,
    editId,
    locationState?.order,
    message,
    navigate,
    orderStore,
    type,
  ]);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if (event.key !== "F4") return;
      event.preventDefault();
      customerSelectRef.current?.querySelector<HTMLInputElement>("input")?.focus();
    };

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  const lines = useMemo<PosLine[]>(() => {
    if (!activeOrder) return [];
    const source = type === OrderType.SALE_RETURN ? activeOrder.returnLines : activeOrder.lines;
    return (source || []) as PosLine[];
  }, [activeOrder, type]);

  const totals = useMemo(
    () => calculateTotals(lines, activeOrder || (emptyOrder(type) as CachedOrder)),
    [activeOrder, lines, type],
  );

  const updateActive = useCallback(
    (values: Partial<CachedOrder>) => {
      if (!activeOrder) return;
      dispatch(updateOrderCache({ id: activeOrder.id, order: values }));
    },
    [activeOrder, dispatch],
  );

  const updateLines = useCallback(
    (nextLines: PosLine[]) => {
      updateActive(type === OrderType.SALE ? { lines: nextLines } : { returnLines: nextLines });
    },
    [type, updateActive],
  );

  const addProduct = useCallback(
    (product: Product) => {
      if (!activeOrder) return;
      const unit = product.baseUnit;
      const found = lines.find(
        (line) => line.productId === product.id && line.unitId === product.baseUnitId,
      );
      if (found) {
        updateLines(
          lines.map((line) =>
            line.id === found.id
              ? {
                  ...line,
                  quantity: Number(line.quantity || 0) + 1,
                  subTotal: (Number(line.quantity || 0) + 1) * Number(line.unitPrice || 0),
                }
              : line,
          ),
        );
        return;
      }

      const line: PosLine = {
        id: randomId(),
        productId: product.id,
        productSnapshot: { id: product.id, code: product.code, name: product.name },
        product,
        unitId: product.baseUnitId,
        unit: unit || null,
        unitSnapshot: unit ? { id: unit.id, name: unit.name } : null,
        conversionRateAtTime: 1,
        quantity: 1,
        unitPrice: getProductPrice(product),
        subTotal: getProductPrice(product),
      };
      updateLines([...lines, line]);
    },
    [activeOrder, lines, updateLines],
  );

  const updateQuantity = (lineId: string, quantity: number | null) => {
    if (!quantity || quantity <= 0) {
      updateLines(lines.filter((line) => line.id !== lineId));
      return;
    }
    updateLines(
      lines.map((line) =>
        line.id === lineId
          ? { ...line, quantity, subTotal: quantity * Number(line.unitPrice || 0) }
          : line,
      ),
    );
  };

  const updateUnitPrice = (lineId: string, unitPrice: number | null) => {
    const nextUnitPrice = Math.max(0, Number(unitPrice || 0));
    updateLines(
      lines.map((line) =>
        line.id === lineId
          ? {
              ...line,
              unitPrice: nextUnitPrice,
              subTotal: Number(line.quantity || 0) * nextUnitPrice,
            }
          : line,
      ),
    );
  };

  const updateUnit = (lineId: string, unitId: string) => {
    const line = lines.find((item) => item.id === lineId);
    const product = line?.product as Product | undefined;
    if (!line || !product || !unitId) return;

    const units = collectUnits(product, line.unit || line.unitSnapshot);
    const unit = units.find((item) => item.id === unitId);
    if (!unit) return;

    const extraUnit = product.extraUnits?.find((item) => item.unitId === unitId);
    const conversionRateAtTime =
      unitId === product.baseUnitId ? 1 : Number(extraUnit?.conversionRate || 1);
    const unitPrice = Number(getDefaultPricePerUnit(product, unitId) ?? line.unitPrice ?? 0);

    updateLines(
      lines.map((item) =>
        item.id === lineId
          ? {
              ...item,
              unitId,
              unit,
              unitSnapshot: { id: unit.id, name: unit.name },
              conversionRateAtTime,
              unitPrice,
              subTotal: Number(item.quantity || 0) * unitPrice,
            }
          : item,
      ),
    );
  };

  const payment = activeOrder?.incomeExpenses?.[0] as PosPayment | undefined;

  const updatePayment = (values: Record<string, unknown>) => {
    updateActive({
      incomeExpenses: [
        {
          ...(payment || {}),
          ...values,
        },
      ],
    });
  };

  const changePaymentMode = (mode: FundTypeEnum) => {
    updateActive({
      paymentMode: mode,
      incomeExpenses: [
        {
          ...(payment || {}),
          fundId: null,
          fund: null,
        },
      ],
    });
  };

  const submit = () => {
    if (!activeOrder || !currentStore || !lines.length) return;
    const {
      id: cacheId,
      tempId: _tempId,
      label: _label,
      mode,
      sourceId,
      initialOrder: _initialOrder,
      paymentMethod: _paymentMethod,
      paidAmount: _paidAmount,
      paymentMode: _paymentMode,
      ...data
    } = activeOrder;
    const paymentAmount = Math.max(0, Number(payment?.amount ?? activeOrder.paidAmount ?? 0));
    const payload: Partial<Order> = {
      ...(data as Partial<Order>),
      ...(mode === "edit" && sourceId ? { id: sourceId } : { tempId: cacheId }),
      storeId: currentStore.id,
      type: type as Order["type"],
      orderAt: String(activeOrder.orderAt || new Date().toISOString()),
      ...(type === OrderType.SALE_RETURN
        ? {
            returnDiscountType: activeOrder.discountType as any,
            returnDiscountValue: activeOrder.discountValue,
            returnTaxType: activeOrder.taxType as any,
            returnTaxValue: activeOrder.taxValue,
          }
        : {}),
      grossAmount: totals.grossAmount,
      discountAmount: totals.discountAmount,
      netAmount: totals.netAmount,
      taxAmount: totals.taxAmount,
      totalAmount: totals.totalAmount,
      settlementAmount: totals.totalAmount,
      incomeExpenses: [
        {
          ...(payment || {}),
          amount: paymentAmount,
          fundId: payment?.fundId || null,
          partnerId: activeOrder.partnerId || null,
          occurredAt: activeOrder.orderAt,
          description: activeOrder.code
            ? `Thanh toán hóa đơn ${activeOrder.code}`
            : "Thanh toán hóa đơn",
        },
      ] as any,
      lines: (type === OrderType.SALE ? lines : []) as any,
      returnLines: (type === OrderType.SALE_RETURN ? lines : []) as any,
    };

    const onSuccess = () => {
      dispatch(removeOrderCache(activeOrder.id));
      dispatch(addNewCache({ type, order: emptyOrder(type) }));
      message.success(mode === "edit" ? "Đã cập nhật phiếu" : "Đã tạo phiếu");
    };

    if (mode === "edit" && sourceId) orderStore.update?.(payload, { onSuccess });
    else orderStore.create?.(payload, { onSuccess });
  };

  const handleRemoveCache = (cache: CachedOrder) => {
    const remove = () => {
      const wasActive = cache.id === currentCacheId;
      const remainingCaches = caches.filter((item) => item.id !== cache.id);
      const nextCache = remainingCaches[remainingCaches.length - 1];

      dispatch(removeOrderCache(cache.id));

      if (wasActive && nextCache && nextCache.type !== type) {
        navigate(`/pos?${POS_TYPE_PARAM}=${nextCache.type}`);
      }
    };

    if (!hasCacheChanges(cache)) {
      remove();
      return;
    }

    modal.confirm({
      centered: true,
      title: <span className="text-red-500">Đóng {cache.label}</span>,
      content: (
        <span>
          Thông tin của <strong>{cache.label}</strong> sẽ không được lưu lại. Bạn có chắc chắn muốn
          đóng không?
        </span>
      ),
      okText: "Đồng ý",
      okButtonProps: { danger: true },
      cancelText: "Bỏ qua",
      onOk: remove,
    });
  };

  if (!currentStore) {
    return (
      <div className="flex h-screen w-screen flex-col items-center overflow-auto p-3 pt-[10vh]">
        <img src={icons.pos} alt="Chưa chọn cửa hàng" className="w-60" />
        <div className="max-w-md text-center">
          <h3 className="text-lg font-semibold">Chưa chọn cửa hàng</h3>
          <p className="mt-2 text-sm text-gray-400">
            Thao tác chỉ có thể thực hiện trong một cửa hàng. Vui lòng chọn cửa hàng để tạo đơn
            hàng.
          </p>
        </div>
        {!!allStores.length && (
          <div className="mt-6 grid w-full max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {allStores.map((store) => (
              <StoreCardLite
                key={store.id}
                item={store}
                onClick={() => handleSetCurrentStore(store, false)}
              />
            ))}
          </div>
        )}

        <Button
          type="primary"
          className="mt-6"
          onClick={() => navigate(-1)} // Quay lại trang trước
        >
          Quay lại
        </Button>
      </div>
    );
  }

  const filteredProducts = productStore.data || [];

  return (
    <Layout className={`h-screen w-screen flex overflow-hidden`}>
      <div className="flex h-full min-h-0 flex-col overflow-hidden bg-[#f3f7f4] text-[#10251b]">
        <header className="flex h-14 shrink-0 items-center gap-3 bg-[#062d1d] px-4 text-white">
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            className="!text-white p-0"
            onClick={() => navigate(type === OrderType.SALE ? "/sales" : "/sales-returns")}
          >
            Quản lý
          </Button>
          <OrderProductSelect
            type={type as OrderType}
            onSelect={addProduct}
            className="w-[360px]"
          />
          <div className="overflow-x-scroll overflow-y-hidden pb-1.5 -mb-1.5 scrollbar-dark [scrollbar-gutter:stable]">
            <div className="flex min-w-0 w-fit items-center gap-2 pr-2">
              {caches.map((cache) => {
                const isActive = cache.id === activeOrder?.id;

                return (
                  <div key={cache.id} className="flex shrink-0 items-center">
                    <Button
                      type={isActive ? "default" : "text"}
                      className={`${isActive ? "!font-semibold" : "!text-white hover:!bg-white/10"} pr-2`}
                      onClick={() => {
                        dispatch(setCurrentOrderCache(cache.id));
                        if (cache.type !== type) {
                          navigate(`/pos?${POS_TYPE_PARAM}=${cache.type}`);
                        }
                      }}
                    >
                      {cache.label}
                      <Button
                        type="text"
                        size="small"
                        danger
                        title={`Đóng ${cache.label}`}
                        aria-label={`Đóng ${cache.label}`}
                        className={`${isActive ? "!text-red-500" : "!text-white/70 hover:!text-red-400 hover:!bg-transparent"} p-0`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveCache(cache);
                        }}
                      >
                        <XMarkIcon className="h-4" />
                      </Button>
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
          <Button
            type="text"
            className="!text-white hover:!bg-white/10 p-0 h-8 w-8 ml-0 mr-auto"
            onClick={() => dispatch(addNewCache({ type, order: emptyOrder(type) }))}
          >
            <PlusOutlined />
          </Button>
          <span className="text-xs text-white/70 w-60 text-right">
            {currentStore.name} · {info?.name}
          </span>
        </header>

        {!activeOrder ? (
          <div className="flex flex-1 items-center justify-center">
            <Spin />
          </div>
        ) : (
          <div className="flex min-h-0 flex-1">
            <main className="flex min-w-0 flex-1 flex-col overflow-hidden bg-[#f5f5f5]">
              {lines.length === 0 ? (
                <div className="flex min-h-0 flex-1 flex-col overflow-auto p-5">
                  <div className="mb-4 text-center">
                    <h2 className="font-semibold">
                      {type === OrderType.SALE_RETURN ? "Phiếu trả hàng" : "Hóa đơn"} chưa có hàng
                      hóa
                    </h2>
                    <p className="text-sm text-gray-500">Tìm hàng hóa hoặc chọn nhanh bên dưới</p>
                  </div>
                  {productStore.loading ? (
                    <div className="flex justify-center p-10">
                      <Spin />
                    </div>
                  ) : (
                    <ProductGrid products={filteredProducts} onSelect={addProduct} />
                  )}
                </div>
              ) : (
                <OrderLineTable
                  lines={lines}
                  onQuantityChange={updateQuantity}
                  onUnitChange={updateUnit}
                  onUnitPriceChange={updateUnitPrice}
                  onNoteChange={(id, note) =>
                    updateLines(lines.map((line) => (line.id === id ? { ...line, note } : line)))
                  }
                  onRemove={(id) => updateQuantity(id, 0)}
                />
              )}
              <div className="flex shrink-0 items-center gap-2 border-t border-dashed border-gray-300 bg-[#f3f7f4] p-2 text-xs text-gray-500">
                <span>✎</span>
                <Input.TextArea
                  autoSize={{ minRows: 2, maxRows: 3 }}
                  value={String(activeOrder.note || "")}
                  onChange={(event) => updateActive({ note: event.target.value })}
                  placeholder="Ghi chú đơn hàng..."
                />
                <span className="whitespace-nowrap w-20 h-full py-2 font-semibold uppercase">
                  Tổng SL: {lines.reduce((sum, line) => sum + Number(line.quantity || 0), 0)}
                </span>
              </div>
            </main>

            <PosInvoiceInfo
              type={type}
              activeOrder={activeOrder}
              totals={totals}
              payment={payment}
              customerSelectRef={customerSelectRef}
              updateActive={updateActive}
              updatePayment={updatePayment}
              changePaymentMode={changePaymentMode}
              onSubmit={submit}
              loading={orderStore.creating || orderStore.updating}
            />
          </div>
        )}
      </div>
    </Layout>
  );
};

const ProductGrid = ({
  products,
  onSelect,
}: {
  products: Product[];
  onSelect: (product: Product) => void;
}) => (
  <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
    {products.map((product) => (
      <button
        key={product.id}
        type="button"
        onClick={() => onSelect(product)}
        className="min-h-24 rounded-lg border border-gray-200 bg-white p-3 text-left transition hover:border-green-500 hover:shadow"
      >
        <div className="flex gap-2">
          <ProductImage shape="square" size={40} image={getMainFile(product.image)} />
          <div className="line-clamp-2 min-h-10 text-sm font-medium">{product.name}</div>
        </div>
        <div className="mt-2 font-semibold text-green-700">
          {formatMoney(getProductPrice(product))}
        </div>
        <div className="mt-1 text-xs text-gray-400">
          {product.code} · Tồn: {product.stockMetadata?.total?.quantity ?? 0}
        </div>
      </button>
    ))}
    {!products.length && <Empty className="col-span-full" description="Không tìm thấy hàng hóa" />}
  </div>
);
