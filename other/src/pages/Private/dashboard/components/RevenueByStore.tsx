import { Table, TableProps } from "antd";
import { RevenueByStore } from "../../../../models/dashboard";
import { CLASSNAME } from "../../../../constants/UI";
import { formatMoney, formatQuantity } from "../../../../utils/formatNumber";

export const RevenueByStoreTable: React.FC<{
  data: RevenueByStore[];
  loading?: boolean;
}> = ({ data, loading }) => {
  const columns: TableProps<RevenueByStore>["columns"] = [
    {
      title: "Tên cửa hàng",
      dataIndex: "name",
      key: "name",
      width: 180,
    },
    {
      title: "Doanh thu",
      dataIndex: "revenue",
      key: "revenue",
      width: 150,
      align: "right",
      render: (value: number) => formatMoney(value),
    },
    {
      title: "Giá vốn",
      dataIndex: "cost",
      key: "cost",
      width: 150,
      align: "right",
      render: (value: number) => formatMoney(value),
    },
    {
      title: "Lợi nhuận gộp",
      dataIndex: "grossProfit",
      key: "grossProfit",
      width: 150,
      align: "right",
      render: (value: number) => formatMoney(value),
    },
    {
      title: "Số đơn",
      dataIndex: "orders",
      key: "orders",
      width: 100,
      align: "right",
      render: (value: number) => formatQuantity(value),
    },
  ];
  return (
    <Table
      columns={columns}
      dataSource={data}
      loading={loading}
      pagination={false}
      rowKey="id"
      className={CLASSNAME.table + " dashboard-table"}
      scroll={{
        x: "max-content",
        y: "max-content",
      }}
    />
  );
};
