import { Table, TableProps } from "antd";
import { RevenueByEmployee } from "../../../../models/dashboard";
import { CLASSNAME } from "../../../../constants/UI";
import { formatMoney, formatQuantity } from "../../../../utils/formatNumber";

export const RevenueByEmployeeTable: React.FC<{
  data: RevenueByEmployee[];
  loading?: boolean;
}> = ({ data, loading }) => {
  const columns: TableProps<RevenueByEmployee>["columns"] = [
    {
      title: "Tên nhân viên",
      dataIndex: "name",
      key: "name",
      width: 150,
    },
    {
      title: "Mã NV",
      dataIndex: "code",
      key: "code",
      width: 100,
    },
    {
      title: "Doanh thu",
      dataIndex: "revenue",
      key: "revenue",
      width: 130,
      align: "right",
      render: (value: number) => formatMoney(value),
    },
    {
      title: "Giá vốn",
      dataIndex: "cost",
      key: "cost",
      width: 130,
      align: "right",
      render: (value: number) => formatMoney(value),
    },
    {
      title: "Lợi nhuận gộp",
      dataIndex: "grossProfit",
      key: "grossProfit",
      width: 130,
      align: "right",
      render: (value: number) => formatMoney(value),
    },
    {
      title: "Số đơn",
      dataIndex: "orders",
      key: "orders",
      width: 80,
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
