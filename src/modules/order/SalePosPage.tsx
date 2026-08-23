import React, { useEffect, useMemo } from "react";
import { Badge, Button, Card, Empty, List, Segmented, Tag, Typography } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useSaleReturnStore, useSaleStore } from "./order.store";
import { Order, OrderType } from "./order.model";
import { addOrderCache, setCurrentOrderCache } from "@/shared/stores/orderCache.slice";
import { RootState } from "@/shared/stores";

type Mode = "sale" | "saleReturn";
const typeOf = (mode: Mode): OrderType => mode === "sale" ? OrderType.SALE : OrderType.SALE_RETURN;

/** Full-screen POS shell. The working list is persisted in the order cache. */
const SalePosPage: React.FC = () => {
  const dispatch = useDispatch();
  const [mode, setMode] = React.useState<Mode>("sale");
  const sales = useSaleStore({ page: 1, size: 100 });
  const returns = useSaleReturnStore({ page: 1, size: 100 });
  const cached = useSelector((state: RootState) => state.OrderCache.cachedOrders);
  const currentId = useSelector((state: RootState) => state.OrderCache.currentCacheId);
  const orders = mode === "sale" ? sales.data : returns.data;

  useEffect(() => {
    orders.forEach((order) => dispatch(addOrderCache({ id: order.id, order: { ...order, type: typeOf(mode) } })));
  }, [dispatch, mode, orders]);

  const cachedOrders = useMemo(() => Object.values(cached).filter((order) => order.type === typeOf(mode)), [cached, mode]);

  return (
    <div className="fixed inset-0 z-40 flex flex-col overflow-hidden bg-slate-100 p-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <Typography.Title level={3} className="!mb-0">Bán hàng</Typography.Title>
          <Typography.Text type="secondary">Danh sách đơn đang có trong cache POS</Typography.Text>
        </div>
        <Segmented value={mode} onChange={(value) => setMode(value as Mode)} options={[{ label: "Bán hàng", value: "sale" }, { label: "Đổi trả", value: "saleReturn" }]} />
      </div>
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <Card className="min-h-0 overflow-auto" title={<span>Đơn {mode === "sale" ? "bán" : "đổi trả"}</span>} extra={<Badge count={orders.length} showZero />}>
          {orders.length ? <List dataSource={orders} rowKey="id" renderItem={(order: Order) => <List.Item><Button type="link" onClick={() => dispatch(setCurrentOrderCache(order.id))}>{order.code}</Button><Tag>{order.status}</Tag><span>{Number(order.totalAmount || 0).toLocaleString("vi-VN")} đ</span></List.Item>} /> : <Empty description="Chưa có đơn" />}
        </Card>
        <Card title="Cache POS" className="min-h-0 overflow-auto">
          {cachedOrders.length ? <List dataSource={cachedOrders} rowKey={(order) => String(order.id)} renderItem={(order) => <List.Item className={order.id === currentId ? "bg-blue-50" : ""}><span>{order.code || order.id}</span><span>{String(order.status || "draft")}</span></List.Item>} /> : <Empty description="Cache đang trống" />}
        </Card>
      </div>
    </div>
  );
};
export default SalePosPage;
