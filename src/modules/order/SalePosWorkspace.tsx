import { Badge, Button, Card, Empty, List, Tag, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import { Order, OrderType } from "./order.model";

interface SalePosWorkspaceProps {
  title: string;
  description: string;
  orderType: OrderType.SALE | OrderType.SALE_RETURN;
  orders: Order[];
  loading: boolean;
}

const SalePosWorkspace = ({
  title,
  description,
  orderType,
  orders,
  loading,
}: SalePosWorkspaceProps) => {
  const navigate = useNavigate();
  const type = orderType === OrderType.SALE_RETURN ? OrderType.SALE_RETURN : OrderType.SALE;

  return (
    <div className="flex h-full flex-col p-4">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <Typography.Title level={3} className="!mb-0">{title}</Typography.Title>
          <Typography.Text type="secondary">{description}</Typography.Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate(`/pos?type=${type}`)}>
          Tạo mới
        </Button>
      </div>
      <Card className="min-h-0 flex-1" loading={loading}>
        {orders.length ? (
          <List
            dataSource={orders}
            rowKey="id"
            renderItem={(order) => (
              <List.Item
                actions={[
                  <Button key="edit" type="link" onClick={() => navigate(`/pos?type=${type}&editId=${order.id}`, { state: { order } })}>
                    Chỉnh sửa
                  </Button>,
                ]}
              >
                <Button type="link" onClick={() => navigate(`/pos?type=${type}&editId=${order.id}`, { state: { order } })}>
                  {order.code}
                </Button>
                <Tag>{order.status}</Tag>
                <span>{Number(order.totalAmount || 0).toLocaleString("vi-VN")} đ</span>
              </List.Item>
            )}
          />
        ) : (
          <Empty description={`Chưa có ${title.toLowerCase()}`}>
            <Button type="primary" onClick={() => navigate(`/pos?type=${type}`)}>Tạo phiếu đầu tiên</Button>
          </Empty>
        )}
      </Card>
    </div>
  );
};

export { SalePosWorkspace };
