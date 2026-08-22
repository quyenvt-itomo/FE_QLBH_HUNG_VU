import { Input, InputNumber, Select } from "antd";
import { SearchOutlined, DeleteOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useProductStore } from "@/modules/product/product.store";
import { Product } from "@/modules/product/product.model";
import { addOrderCache } from "@/shared/stores/orderCache.slice";
import { formatMoney } from "@/shared/utils/number.util";

interface CartLine {
  product: Product;
  quantity: number;
}

export const PosPage = () => {
  const dispatch = useDispatch();
  const [keyword, setKeyword] = useState("");
  const [customer, setCustomer] = useState<string>();
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [cart, setCart] = useState<CartLine[]>([]);
  const { data: products = [], loading } = useProductStore({ page: 1, size: 100 });

  const visibleProducts = useMemo(
    () =>
      products.filter((product) =>
        `${product.code} ${product.name}`.toLowerCase().includes(keyword.toLowerCase()),
      ),
    [products, keyword],
  );

  const total = cart.reduce((sum, line) => sum + line.quantity * Number(line.product.price || 0), 0);

  const addToCart = (product: Product) => {
    setCart((current) => {
      const found = current.find((line) => line.product.id === product.id);
      if (found) {
        return current.map((line) =>
          line.product.id === product.id ? { ...line, quantity: line.quantity + 1 } : line,
        );
      }
      return [...current, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, quantity: number | null) => {
    if (!quantity || quantity <= 0) {
      setCart((current) => current.filter((line) => line.product.id !== productId));
      return;
    }
    setCart((current) =>
      current.map((line) => (line.product.id === productId ? { ...line, quantity } : line)),
    );
  };

  const saveOrderCache = () => {
    const cacheId = `pos-${Date.now()}`;
    dispatch(
      addOrderCache({
        id: cacheId,
        order: {
          id: cacheId,
          customer,
          paymentMethod,
          lines: cart.map((line) => ({
            productId: line.product.id,
            unitId: line.product.baseUnitId,
            quantity: line.quantity,
            unitPrice: line.product.price,
          })),
          subTotal: total,
          totalAmount: total,
        },
      }),
    );
  };

  return (
    <div className="flex h-screen flex-col bg-[#F3F7F4] text-gray-800">
      <div className="flex h-14 shrink-0 items-center gap-3 bg-[#0B2B1C] px-4 text-white">
        <button type="button" onClick={() => window.history.back()} className="rounded p-2 hover:bg-white/10">
          <ArrowLeftOutlined />
        </button>
        <span className="text-lg font-semibold">Bán hàng (POS)</span>
        <Input
          prefix={<SearchOutlined />}
          placeholder="Tìm hàng hóa theo tên hoặc mã (F3)"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          className="ml-4 max-w-xl"
        />
      </div>

      <div className="flex min-h-0 flex-1">
        <main className="min-w-0 flex-1 overflow-y-auto p-4">
          <div className="mb-3 text-sm text-gray-500">Chọn sản phẩm để thêm vào đơn hàng</div>
          {loading ? (
            <div className="rounded-lg bg-white p-8 text-center text-gray-500">Đang tải hàng hóa...</div>
          ) : (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
              {visibleProducts.map((product) => (
                <button
                  type="button"
                  key={product.id}
                  onClick={() => addToCart(product)}
                  className="rounded-lg border border-gray-200 bg-white p-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-green-500 hover:shadow"
                >
                  <div className="line-clamp-2 min-h-10 font-medium">{product.name}</div>
                  <div className="mt-2 text-lg font-semibold text-green-700">{formatMoney(product.price)}</div>
                  <div className="mt-1 text-xs text-gray-400">{product.code}</div>
                </button>
              ))}
            </div>
          )}
        </main>

        <aside className="flex w-[380px] shrink-0 flex-col border-l border-gray-200 bg-white">
          <div className="border-b border-gray-200 p-4">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Khách hàng</div>
            <Input placeholder="Tìm khách hàng (F4) — bỏ trống là khách lẻ" value={customer} onChange={(e) => setCustomer(e.target.value)} />
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {cart.length === 0 ? (
              <div className="py-16 text-center text-gray-400">Chưa có hàng hóa trong đơn</div>
            ) : (
              <div className="space-y-3">
                {cart.map((line) => (
                  <div key={line.product.id} className="border-b border-dashed border-gray-200 pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-medium">{line.product.name}</div>
                      <button type="button" className="text-red-500" onClick={() => updateQuantity(line.product.id, 0)}>
                        <DeleteOutlined />
                      </button>
                    </div>
                    <div className="mt-2 flex items-center justify-between gap-3">
                      <InputNumber min={1} value={line.quantity} onChange={(value) => updateQuantity(line.product.id, value)} />
                      <span className="font-semibold">{formatMoney(line.quantity * Number(line.product.price || 0))}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="border-t border-gray-200 p-4">
            <div className="mb-2 flex justify-between"><span>Tổng tiền hàng</span><b>{formatMoney(total)}</b></div>
            <div className="mb-3 flex items-center justify-between gap-3">
              <span>Thanh toán</span>
              <Select value={paymentMethod} onChange={setPaymentMethod} options={[{ value: "cash", label: "Tiền mặt" }, { value: "bank_transfer", label: "Chuyển khoản" }, { value: "card", label: "Thẻ" }]} />
            </div>
            <button
              type="button"
              disabled={!cart.length}
              onClick={saveOrderCache}
              className="flex w-full items-center justify-between rounded-lg bg-green-600 px-4 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              <span>THANH TOÁN</span><span>{formatMoney(total)}</span>
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default PosPage;
