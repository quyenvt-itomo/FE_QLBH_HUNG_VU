import { Table, TableProps, Image, Alert } from "antd";
import { LowStockProduct } from "../../../../models/dashboard";
import { CLASSNAME } from "../../../../constants/UI";
import { formatQuantity } from "../../../../utils/formatNumber";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

export const LowStockProductsTable: React.FC<{
  data: LowStockProduct[];
  loading?: boolean;
}> = ({ data, loading }) => {
  const columns: TableProps<LowStockProduct>["columns"] = [
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
      title: "Tồn hiện tại",
      dataIndex: "currentStock",
      key: "currentStock",
      width: 120,
      align: "right",
      render: (value: number) => (
        <span className="text-red-600 font-semibold">{formatQuantity(value)}</span>
      ),
    },
    {
      title: "Tồn tối thiểu",
      dataIndex: "minimumStock",
      key: "minimumStock",
      width: 120,
      align: "right",
      render: (value: number) => formatQuantity(value),
    },
    {
      title: "SL Bán/Ngày",
      dataIndex: "avgDailySales",
      key: "avgDailySales",
      width: 120,
      align: "right",
      render: (value: number) => formatQuantity(value),
    },
    {
      title: "Ngày hết hàng",
      dataIndex: "daysUntilStockout",
      key: "daysUntilStockout",
      width: 120,
      align: "center",
      render: (value: number) => (
        <span className={value <= 7 ? "text-red-600 font-semibold" : "text-orange-600"}>
          {value} ngày
        </span>
      ),
    },
    {
      title: "Đề xuất tái lấy",
      dataIndex: "reorderRecommendation",
      key: "reorderRecommendation",
      width: 150,
      align: "right",
      render: (value: number) => (
        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
          {formatQuantity(value)}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-3">
      <Alert
        message="⚠️ Sản phẩm sắp hết hàng - Hãy tái lấy hàng để không bị mất doanh số"
        type="warning"
        showIcon
        icon={<ExclamationTriangleIcon className="w-5 h-5" />}
      />
      <div className="flex flex-col h-64">
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
      </div>
    </div>
  );
};
