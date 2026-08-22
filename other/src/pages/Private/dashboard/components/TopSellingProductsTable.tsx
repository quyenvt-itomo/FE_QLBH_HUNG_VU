import { Table, TableProps, Image } from "antd";
import { TopSellingProduct } from "../../../../models/dashboard";
import { CLASSNAME } from "../../../../constants/UI";
import { formatMoney, formatQuantity, formatPercentage } from "../../../../utils/formatNumber";

export const TopSellingProductsTable: React.FC<{
  data: TopSellingProduct[];
  loading?: boolean;
}> = ({ data, loading }) => {
  const columns: TableProps<TopSellingProduct>["columns"] = [
    {
      title: "Hình ảnh",
      dataIndex: "album",
      key: "album",
      width: 80,
      align: "center",
      render: (album: any[]) => {
        if (album && album.length > 0) {
          return (
            <Image
              src={album[0]?.url}
              alt="product"
              width={50}
              height={50}
              style={{ objectFit: "cover" }}
            />
          );
        }
        return <div className="w-12 h-12 bg-gray-200 rounded" />;
      },
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      width: 200,
      render: (text: string, record) => (
        <div>
          <div className="text-sm font-medium truncate">{text}</div>
          <div className="text-xs text-gray-500">{record.code}</div>
        </div>
      ),
    },
    {
      title: "Danh mục",
      dataIndex: "categoryName",
      key: "categoryName",
      width: 150,
      render: (text: string) => <span className="text-sm">{text}</span>,
    },
    {
      title: "SL Bán",
      dataIndex: "soldQuantity",
      key: "soldQuantity",
      width: 100,
      align: "right",
      render: (value: number) => formatQuantity(value),
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
      title: "Lợi nhuận",
      dataIndex: "profit",
      key: "profit",
      width: 130,
      align: "right",
      render: (value: number) => formatMoney(value),
    },
    {
      title: "Margin",
      dataIndex: "profitMargin",
      key: "profitMargin",
      width: 80,
      align: "right",
      render: (value: number) => formatPercentage(value),
    },
    {
      title: "Tồn kho",
      dataIndex: "stockQty",
      key: "stockQty",
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
