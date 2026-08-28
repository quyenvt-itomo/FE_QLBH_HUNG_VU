import { App, Button, Empty, Input, InputNumber, Layout, Select, Spin } from "antd";
import {
  ArrowLeftOutlined,
  DeleteOutlined,
  PlusOutlined,
  PrinterOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

import { CustomerAddSelect } from "@/modules/partner/components/Select";
import { Partner } from "@/modules/partner/partner.model";
import { Product } from "@/modules/product/product.model";
import { useProductStore } from "@/modules/product/product.store";
import { Order, OrderType } from "./order.model";
import { useSaleReturnStore, useSaleStore } from "./order.store";
import { OrderSelect } from "./components/Select";
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

type PosLine = Record<string, any> & {
  id: string;
  productId: string;
  productSnapshot: { id: string; code: string; name: string };
  unitId?: string | null;
  unitSnapshot?: { id: string; name: string } | null;
  quantity: number;
  unitPrice: number;
  subTotal: number;
};

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
  paymentMethod: "cash",
  paidAmount: 0,
});

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

  return {
    grossAmount,
    discountAmount,
    netAmount,
    taxAmount,
    totalAmount: netAmount + taxAmount,
  };
};

const PosPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { message } = App.useApp();
  const { currentStore, info, handleSetCurrentStore } = useGlobalData();
  const [keyword, setKeyword] = useState("");
  const initializedEdit = useRef<string | null>(null);

  const type: PosOrderType =
    searchParams.get(POS_TYPE_PARAM) === OrderType.SALE_RETURN
      ? OrderType.SALE_RETURN
      : OrderType.SALE;
  const editId = searchParams.get(POS_EDIT_PARAM);
  const locationState = location.state as PosLocationState | null;

  const saleStore = useSaleStore({ page: 1, size: 100, isLocked: !currentStore });
  const saleReturnStore = useSaleReturnStore({ page: 1, size: 100, isLocked: !currentStore });
  const orderStore = type === OrderType.SALE ? saleStore : saleReturnStore;
  const productStore = useProductStore({ page: 1, size: 100, isLocked: !currentStore });

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

  const submit = () => {
    if (!activeOrder || !currentStore || !lines.length) return;
    const { id: cacheId, tempId: _tempId, label: _label, mode, sourceId, ...data } = activeOrder;
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

  const filteredProducts = (productStore.data || []).filter((product) =>
    `${product.code} ${product.name}`.toLocaleLowerCase().includes(keyword.toLocaleLowerCase()),
  );

  return (
    <Layout className={`h-screen w-screen flex overflow-hidden`}>
      <div className="flex h-full min-h-0 flex-col overflow-hidden bg-[#f3f7f4] text-[#10251b]">
        <header className="flex h-14 shrink-0 items-center gap-3 bg-[#062d1d] px-4 text-white">
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            className="!text-white"
            onClick={() => navigate(type === OrderType.SALE ? "/sales" : "/sales-returns")}
          >
            Quản lý
          </Button>
          <Input
            allowClear
            prefix={<SearchOutlined />}
            placeholder="Tìm hàng hóa theo tên hoặc mã (F3)"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            className="w-[360px]"
          />
          <div className="flex min-w-0 items-center gap-2 overflow-x-auto">
            {caches.map((cache) => (
              <Button
                key={cache.id}
                type={cache.id === activeOrder?.id ? "default" : "text"}
                className={cache.id === activeOrder?.id ? "!font-semibold" : "!text-white"}
                onClick={() => {
                  dispatch(setCurrentOrderCache(cache.id));
                  if (cache.type !== type) {
                    navigate(`/pos?${POS_TYPE_PARAM}=${cache.type}`);
                  }
                }}
              >
                {cache.label}
              </Button>
            ))}
          </div>
          <Button
            type="text"
            icon={<PlusOutlined />}
            className="!text-white"
            onClick={() => dispatch(addNewCache({ type, order: emptyOrder(type) }))}
          />
          <span className="ml-auto text-xs text-white/70">
            {currentStore.name} · {info?.name}
          </span>
        </header>

        {!activeOrder ? (
          <div className="flex flex-1 items-center justify-center">
            <Spin />
          </div>
        ) : (
          <div className="flex min-h-0 flex-1">
            <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
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
                  onRemove={(id) => updateQuantity(id, 0)}
                />
              )}
              <div className="flex shrink-0 items-center gap-2 border-t border-dashed border-gray-300 bg-[#f3f7f4] p-2 text-xs text-gray-500">
                <span>✎</span>
                <Input.TextArea
                  autoSize={{ minRows: 1, maxRows: 2 }}
                  value={String(activeOrder.note || "")}
                  onChange={(event) => updateActive({ note: event.target.value })}
                  placeholder="Ghi chú đơn hàng..."
                />
                <span className="whitespace-nowrap">
                  Tổng SL: {lines.reduce((sum, line) => sum + Number(line.quantity || 0), 0)}
                </span>
              </div>
            </main>

            <aside className="flex w-[520px] shrink-0 flex-col overflow-y-auto border-l border-gray-200 bg-white">
              <section className="border-b border-gray-200 p-4">
                <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Khách hàng
                </div>
                <CustomerAddSelect
                  value={activeOrder.partnerId || undefined}
                  defaultData={activeOrder.partner as Partner | undefined}
                  onChangeData={(partner) =>
                    updateActive({ partnerId: partner?.id || null, partner })
                  }
                  placeholder="Tìm khách hàng (F4) — bỏ trống là Khách lẻ"
                />
                {type === OrderType.SALE_RETURN && (
                  <div className="mt-3">
                    <OrderSelect
                      value={activeOrder.refOrderId || undefined}
                      query={{ type: OrderType.SALE }}
                      onChange={(refOrderId) => updateActive({ refOrderId })}
                      placeholder="Chọn hóa đơn gốc"
                    />
                  </div>
                )}
              </section>

              <section className="border-b border-gray-200 p-4">
                <h3 className="mb-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Tổng kết đơn
                </h3>
                <SummaryRow label="Tổng tiền hàng" value={totals.grossAmount} />
                <div className="flex items-center justify-between gap-3 py-2 text-sm">
                  <span>Giảm giá</span>
                  <div className="flex w-48 gap-2">
                    <Select
                      value={activeOrder.discountType || DiscountTypeEnum.AMOUNT}
                      onChange={(discountType) => updateActive({ discountType })}
                      options={[
                        { value: DiscountTypeEnum.AMOUNT, label: "Số tiền" },
                        { value: DiscountTypeEnum.PERCENT, label: "%" },
                      ]}
                      className="w-24"
                    />
                    <InputNumber
                      min={0}
                      value={activeOrder.discountValue || 0}
                      onChange={(discountValue) =>
                        updateActive({ discountValue: Number(discountValue || 0) })
                      }
                      className="w-full"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between gap-3 py-2 text-sm">
                  <span>VAT</span>
                  <div className="flex w-48 gap-2">
                    <Select
                      value={activeOrder.taxType || DiscountTypeEnum.PERCENT}
                      onChange={(taxType) => updateActive({ taxType })}
                      options={[
                        { value: DiscountTypeEnum.AMOUNT, label: "Số tiền" },
                        { value: DiscountTypeEnum.PERCENT, label: "%" },
                      ]}
                      className="w-24"
                    />
                    <InputNumber
                      min={0}
                      value={activeOrder.taxValue || 0}
                      onChange={(taxValue) => updateActive({ taxValue: Number(taxValue || 0) })}
                      className="w-full"
                    />
                  </div>
                </div>
                <SummaryRow label="Tiền VAT" value={totals.taxAmount} />
                <div className="mt-3 flex items-center justify-between border-t border-dashed border-gray-200 pt-4 font-semibold">
                  <span>
                    {type === OrderType.SALE_RETURN ? "Khách cần trả" : "Khách cần thanh toán"}
                  </span>
                  <span className="text-xl text-green-700">{formatMoney(totals.totalAmount)}</span>
                </div>
              </section>

              <section className="border-b border-gray-200 p-4">
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Thanh toán
                </h3>
                <Select
                  value={String(activeOrder.paymentMethod || "cash")}
                  onChange={(paymentMethod) => updateActive({ paymentMethod })}
                  className="w-full"
                  options={[
                    { value: "cash", label: "Tiền mặt" },
                    { value: "bank_transfer", label: "Chuyển khoản" },
                    { value: "card", label: "Thẻ" },
                  ]}
                />
                <div className="mt-3 flex items-center justify-between gap-3 text-sm">
                  <span>Khách thanh toán</span>
                  <InputNumber
                    min={0}
                    value={Number(activeOrder.paidAmount || 0)}
                    onChange={(paidAmount) => updateActive({ paidAmount: Number(paidAmount || 0) })}
                    className="w-48"
                  />
                </div>
                <SummaryRow
                  label="Tiền thừa trả khách"
                  value={Math.max(0, Number(activeOrder.paidAmount || 0) - totals.totalAmount)}
                />
              </section>

              <div className="mt-auto flex gap-2 p-4">
                <Button icon={<PrinterOutlined />} className="h-12 w-14" />
                <Button
                  type="primary"
                  block
                  className="h-12 !bg-green-600"
                  disabled={!lines.length}
                  loading={orderStore.creating || orderStore.updating}
                  onClick={submit}
                >
                  <span className="flex items-center justify-between">
                    <span>{activeOrder.mode === "edit" ? "CẬP NHẬT" : "THANH TOÁN"}</span>
                    <span>{formatMoney(totals.totalAmount)}</span>
                  </span>
                </Button>
              </div>
            </aside>
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
  <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
    {products.map((product) => (
      <button
        key={product.id}
        type="button"
        onClick={() => onSelect(product)}
        className="min-h-24 rounded-lg border border-gray-200 bg-white p-3 text-left transition hover:border-green-500 hover:shadow"
      >
        <div className="line-clamp-2 min-h-10 text-sm font-medium">{product.name}</div>
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

const OrderLineTable = ({
  lines,
  onQuantityChange,
  onRemove,
}: {
  lines: PosLine[];
  onQuantityChange: (id: string, quantity: number | null) => void;
  onRemove: (id: string) => void;
}) => (
  <div className="min-h-0 flex-1 overflow-auto bg-white">
    <div className="grid grid-cols-[42px_90px_minmax(220px,1fr)_120px_92px_120px_38px] border-b border-gray-200 px-2 py-3 text-xs font-semibold uppercase text-gray-500">
      <span>#</span>
      <span>Mã hàng</span>
      <span>Tên hàng</span>
      <span className="text-right">Đơn giá</span>
      <span className="text-center">SL</span>
      <span className="text-right">Thành tiền</span>
      <span />
    </div>
    {lines.map((line, index) => (
      <div
        key={line.id}
        className="grid grid-cols-[42px_90px_minmax(220px,1fr)_120px_92px_120px_38px] items-center border-b border-gray-200 px-2 py-3 text-sm"
      >
        <span>{index + 1}</span>
        <span className="text-gray-500">{line.productSnapshot.code}</span>
        <span>
          <b>{line.productSnapshot.name}</b>
          <small className="block text-gray-500">Đơn vị: {line.unitSnapshot?.name || "-"}</small>
        </span>
        <span className="text-right">{formatMoney(line.unitPrice)}</span>
        <InputNumber
          min={1}
          value={line.quantity}
          onChange={(value) => onQuantityChange(line.id, value)}
          className="mx-auto w-20"
        />
        <span className="text-right font-semibold">
          {formatMoney(Number(line.quantity || 0) * Number(line.unitPrice || 0))}
        </span>
        <Button type="text" danger icon={<DeleteOutlined />} onClick={() => onRemove(line.id)} />
      </div>
    ))}
  </div>
);

const SummaryRow = ({ label, value }: { label: string; value: number }) => (
  <div className="flex items-center justify-between py-2 text-sm">
    <span>{label}</span>
    <b>{formatMoney(value)}</b>
  </div>
);

export { PosPage };
