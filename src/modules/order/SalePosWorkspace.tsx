import React, { useEffect, useMemo } from "react";
import { Badge, Button, Card, Empty, List, Tag, Typography } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { addOrderCache, setCurrentOrderCache } from "@/shared/stores/orderCache.slice";
import { RootState } from "@/shared/stores";
import { Order, OrderType } from "./order.model";

interface SalePosWorkspaceProps {
  title: string;
  description: string;
  orderType: OrderType.SALE | OrderType.SALE_RETURN;
  orders: Order[];
  loading: boolean;
}

export const SalePosWorkspace: React.FC<SalePosWorkspaceProps> = ({ title, description, orderType, orders, loading }) => {
  const dispatch = useDispatch();
  const cached = useSelector((state: RootState) => state.OrderCache.cachedOrders);
  const currentId = useSelector((state: RootState) => state.OrderCache.currentCacheId);

  useEffect(() => {
    orders.forEach((order) => dispatch(addOrderCache({ id: order.id, order: { ...order, type: orderType } })));
  }, [dispatch, orderType, orders]);

  const cachedOrders = useMemo(
    () => Object.values(cached).filter((order) => order.type === orderType),
    [cached, orderType],
  );

  return (
    <div className="fixed inset-0 z-40 flex flex-col overflow-hidden bg-slate-100 p-4">
      <div className="mb-3">
        <Typography.Title level={3} className="!mb-0">{title}</Typography.Title>
        <Typography.Text type="secondary">{description}</Typography.Text>
      </div>
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <Card className="min-h-0 overflow-auto" title={<span>{title}</span>} extra={<Badge count={orders.length} showZero />} loading={loading}>
          {orders.length ? (
            <List dataSource={orders} rowKey="id" renderItem={(order) => (
              <List.Item>
                <Button type="link" onClick={() => dispatch(setCurrentOrderCache(order.id))}>{order.code}</Button>
                <Tag>{order.status}</Tag>
                <span>{Number(order.totalAmount || 0).toLocaleString("vi-VN")} đ</span>
              </List.Item>
            )} />
          ) : <Empty description="Chưa có đơn" />}
        </Card>
        <Card title="Cache POS" className="min-h-0 overflow-auto">
          {cachedOrders.length ? (
            <List dataSource={cachedOrders} rowKey={(order) => String(order.id)} renderItem={(order) => (
              <List.Item className={order.id === currentId ? "bg-blue-50" : ""}>
                <span>{order.code || order.id}</span>
                <span>{String(order.status || "draft")}</span>
              </List.Item>
            )} />
          ) : <Empty description="Cache đang trống" />}
        </Card>
      </div>
    </div>
  );
};
