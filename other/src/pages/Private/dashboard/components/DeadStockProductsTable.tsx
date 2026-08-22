import { Table, TableProps, Image, Tag } from "antd";
import { DeadStockProduct } from "../../../../models/dashboard";
import { CLASSNAME } from "../../../../constants/UI";
import { formatQuantity, formatMoney } from "../../../../utils/formatNumber";
import { InboxIcon } from "@heroicons/react/24/outline";

export const DeadStockProductsTable: React.FC<{
  data: DeadStockProduct[];
  loading?: boolean;
}> = ({ data, loading }) => {
  const getRecommendationColor = (recommendation: string) => {
    const lowerRecommendation = recommendation?.toLowerCase() || "";
    if (lowerRecommendation.includes("discount")) return "orange";
    if (lowerRecommendation.includes("clearance")) return "red";
    if (lowerRecommendation.includes("return")) return "purple";
    return "default";
  };

  const columns: TableProps<DeadStockProduct>["columns"] = [
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
      render: (text: string) => <div className="text-sm font-medium truncate">{text}</div>,
    },
    {
      title: "Tồn kho",
      dataIndex: "currentStock",
      key: "currentStock",
      width: 100,
      align: "right",
      render: (value: number) => (
        <span className="text-red-600 font-semibold">{formatQuantity(value)}</span>
      ),
    },
    {
      title: "Giá trị tồn",
      dataIndex: "stockValue",
      key: "stockValue",
      width: 150,
      align: "right",
      render: (value: number) => <span className="font-semibold">{formatMoney(value)}</span>,
    },
    {
      title: "Lần bán cuối",
      dataIndex: "lastSoldDate",
      key: "lastSoldDate",
      width: 150,
      align: "center",
      render: (date: string) => (
        <span className="text-gray-600">
          {date ? new Date(date).toLocaleDateString("vi-VN") : "Chưa bán"}
        </span>
      ),
    },
    {
      title: "Ngày không bán",
      dataIndex: "daysWithoutSale",
      key: "daysWithoutSale",
      width: 130,
      align: "center",
      render: (value: number) => <span className="text-red-600 font-semibold">{value} ngày</span>,
    },
    {
      title: "Đề xuất xử lý",
      dataIndex: "recommendation",
      key: "recommendation",
      width: 150,
      align: "center",
      render: (value: string) => (
        <Tag color={getRecommendationColor(value)} className="text-xs font-semibold">
          {value}
        </Tag>
      ),
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 p-3 bg-red-50 rounded-md border border-red-200">
        <InboxIcon className="w-5 h-5 text-red-600" />
        <span className="text-sm text-red-700">
          <strong>Tồn kho chết:</strong> Những sản phẩm không được bán trong kỳ này nhưng vẫn có tồn
          kho. Hãy xem xét chiết khấu, dọn kho hoặc hoàn trả cho nhà cung cấp.
        </span>
      </div>

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
