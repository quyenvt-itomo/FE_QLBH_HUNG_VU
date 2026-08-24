import React from "react";
import { Card, Empty, List, Tag, Typography } from "antd";
import { Order } from "./order.model";

interface PurchaseListWorkspaceProps {
  title: string;
  description: string;
  orders: Order[];
  loading: boolean;
}

export const PurchaseListWorkspace: React.FC<PurchaseListWorkspaceProps> = ({ title, description, orders, loading }) => (
  <div className="flex h-full flex-col p-4">
    <div className="mb-4">
      <Typography.Title level={3} className="!mb-0">{title}</Typography.Title>
      <Typography.Text type="secondary">{description}</Typography.Text>
    </div>
    <Card className="min-h-0 flex-1" loading={loading}>
      {orders.length ? (
        <List dataSource={orders} rowKey="id" renderItem={(order) => (
          <List.Item>
            <span>{order.code}</span>
            <Tag>{order.status}</Tag>
            <span>{Number(order.totalAmount || 0).toLocaleString("vi-VN")} đ</span>
          </List.Item>
        )} />
      ) : <Empty description="Chưa có đơn" />}
    </Card>
  </div>
);
