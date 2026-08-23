import React from "react";
import { Card, List, Segmented, Tag, Typography } from "antd";
import { usePurchaseReturnStore, usePurchaseStore } from "./order.store";
import { Order } from "./order.model";

const PurchasePage: React.FC = () => {
  const [mode, setMode] = React.useState<"purchase" | "purchaseReturn">("purchase");
  const purchases = usePurchaseStore({ page: 1, size: 100 });
  const returns = usePurchaseReturnStore({ page: 1, size: 100 });
  const orders = mode === "purchase" ? purchases.data : returns.data;
  return <div className="p-4"><div className="mb-4 flex items-center justify-between"><Typography.Title level={3}>Nhập hàng</Typography.Title><Segmented value={mode} onChange={(value) => setMode(value as typeof mode)} options={[{ label: "Đơn nhập", value: "purchase" }, { label: "Đổi trả nhập", value: "purchaseReturn" }]} /></div><Card><List dataSource={orders} rowKey="id" loading={mode === "purchase" ? purchases.loading : returns.loading} renderItem={(order: Order) => <List.Item><span>{order.code}</span><Tag>{order.status}</Tag><span>{Number(order.totalAmount || 0).toLocaleString("vi-VN")} đ</span></List.Item>} /></Card></div>;
};
export default PurchasePage;
