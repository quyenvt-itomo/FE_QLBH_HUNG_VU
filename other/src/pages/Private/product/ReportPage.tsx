import ReactApexChart from "react-apexcharts";
import { usePageState } from "../../../hooks/core/usePageState";
import { useNotFoundGuard } from "../../../hooks/core/useNotFoundGuard";

import { IProduct } from "../../../models/product";
import CustomTitle from "../../../layout/Private/header/components/Title";
import { Button, Card, Col, Row, Skeleton, Table, Tag } from "antd";
import { useNavigate } from "react-router-dom";
import NotFoundData from "../../../components/display/NotFoundData";
import { useDashboardData } from "../../../hooks/core/useDashboardData";
import { StatsCard } from "../dashboard/components/StatsCard";
import {
  formatMoney,
  formatPercentage,
  formatQuantity,
  formatShortMoney,
} from "../../../utils/formatNumber";
import { ApexOptions } from "apexcharts";
import dayjs from "dayjs";
import { Icon } from "@iconify/react";
import Title from "../../../components/display/Title";
import { OrderSnapshot } from "../../../models/store/order";
import { OrderTypeEnum, orderTypeMap } from "../../../constants/enum";
import { RevenueByDate } from "../../../models/dashboard";
import ProductImage from "../../../components/image/ProductImage";
import { getMainImage } from "../../../utils/fileUtil";
import { BackButton } from "../../../components/button/BackButton";
import DateRangeFilter from "../../../components/button/DateRangeFilter";
import StoreSelect from "../../../components/select/StoreSelect";
import { useClientData } from "../../../hooks/core/useClientData";

/* ================= LINE CHART OPTIONS ================= */
const getLineOptions = (categories: string[]): ApexOptions => ({
  chart: {
    type: "line",
    toolbar: { show: false },
  },
  stroke: {
    curve: "smooth",
    width: [3, 3],
  },
  colors: ["#3b82f6", "#22c55e"],
  xaxis: {
    categories,
    tickAmount: 7,
    labels: {
      rotate: 0,
      style: {
        fontSize: "10px",
        fontWeight: 500,
        colors: "#999999",
      },
    },
  },
  yaxis: [
    {
      labels: {
        formatter: (val) => formatShortMoney(val),
        style: { colors: "#3b82f6" },
      },
    },
    {
      opposite: true,
      labels: {
        formatter: (val) => formatQuantity(val),
        style: { colors: "#22c55e" },
      },
    },
  ],
  tooltip: {
    shared: true,
    intersect: false,
    y: [
      {
        formatter: (val) => formatMoney(val),
      },
      {
        formatter: (val) => formatQuantity(val) + " sản phẩm",
      },
    ],
  },
  legend: {
    position: "top",
    horizontalAlign: "right",
  },
});

const ReportPage: React.FC = () => {
  const navigate = useNavigate();
  const { id, storeId, reload, startAt, endAt, pageAction } = usePageState();
  const { currentStore } = useClientData();
  const { detailProductData, loading } = useDashboardData({
    productId: id,
    reload,
    startAt,
    endAt,
    storeId,
    type: "detail-product",
  });

  const showNotFound = useNotFoundGuard({
    id,
    loading,
    data: detailProductData,
  });

  if (showNotFound) return <NotFoundData />;

  const rowData = detailProductData?.data;

  const metrics = detailProductData?.metrics;
  const revenueByDate = detailProductData?.revenueByDate || [];
  const soldOrders = detailProductData?.soldOrders || [];

  // Prepare chart data
  const chartCategories = revenueByDate.map((item: RevenueByDate) =>
    dayjs(item.date).format("DD/MM"),
  );
  const chartSeries = [
    {
      name: "Doanh thu",
      data: revenueByDate.map((item: RevenueByDate) => item.revenue),
    },
    {
      name: "Số lượng bán",
      data: revenueByDate.map((item: RevenueByDate) => item.productsSold),
    },
  ];

  const getOrderTypeColor = (type: OrderTypeEnum) => {
    switch (type) {
      case OrderTypeEnum.SALE:
        return "blue";
      case OrderTypeEnum.SALE_RETURN:
        return "red";
      case OrderTypeEnum.PURCHASE:
        return "green";
      case OrderTypeEnum.PURCHASE_RETURN:
        return "orange";
      default:
        return "default";
    }
  };

  const columns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "code",
      key: "code",
      render: (code: string) => <span className="font-medium text-blue-600">{code}</span>,
    },
    {
      title: "Loại đơn",
      dataIndex: "type",
      key: "type",
      render: (type: OrderTypeEnum) => (
        <Tag color={getOrderTypeColor(type)}>{orderTypeMap[type] || type}</Tag>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => dayjs(date).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Khách hàng",
      dataIndex: "partnerName",
      key: "partnerName",
    },
    {
      title: "Tổng tiền",
      dataIndex: "netAmount",
      key: "netAmount",
      align: "right" as const,
      render: (val: number) => formatMoney(val),
    },
  ];

  return (
    <div className="flex flex-col w-full h-full gap-4 overflow-y-auto scrollbar-hide pb-6">
      <div className="flex items-center w-full rounded-xl border shadow-sm bg-white px-6 py-4 gap-4">
        <div className="flex gap-4 items-center flex-1">
          <BackButton />
          <div className="flex gap-2 items-center">
            <ProductImage image={getMainImage(rowData?.album)} size={40} />
            <div className="flex flex-col">
              <div className="flex gap-4 items-center">
                <div className="font-semibold text-lg text-primary">{rowData?.name}</div>
                <div className="text-gray-500">ĐVT: {rowData?.unit?.name}</div>
              </div>
              <div className="text-xs text-gray-500">Mã hàng: {rowData?.code}</div>
            </div>
          </div>
        </div>
        {!currentStore && (
          <div className="w-80 flex flex-col gap-1">
            <span className="text-xs text-primary">CỬA HÀNG</span>
            <StoreSelect
              value={storeId}
              onChange={pageAction.handleStoreChange}
              placeholder="Lọc theo cửa hàng"
            />
          </div>
        )}
        <div className="flex flex-col gap-1">
          <span className="text-xs text-primary">THỜI GIAN ÁP DỤNG</span>
          <DateRangeFilter
            startDate={startAt}
            endDate={endAt}
            onRangeChange={pageAction.handleDateRangerChange}
          />
        </div>
      </div>

      {loading ? (
        <Skeleton active paragraph={{ rows: 10 }} />
      ) : (
        <>
          {/* Metrics Section */}
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <StatsCard
                label="Doanh thu"
                value={metrics?.totalRevenue || 0}
                type="money"
                growth={metrics?.revenueGrowth}
                icon={<Icon icon="mdi:finance" className="text-blue-500 w-6 h-6" />}
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <StatsCard
                label="Số lượng đã bán"
                value={metrics?.totalQuantitySold || 0}
                type="quantity"
                growth={metrics?.quantitySoldGrowth}
                icon={<Icon icon="mdi:cart-outline" className="text-green-500 w-6 h-6" />}
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <StatsCard
                label="Số lượng hoàn trả"
                value={metrics?.returnedQuantity || 0}
                type="quantity"
                growth={metrics?.returnedQuantityGrowth}
                icon={<Icon icon="mdi:keyboard-return" className="text-red-500 w-6 h-6" />}
                warning={metrics?.returnRate ? metrics.returnRate > 10 : false}
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <StatsCard
                label="Lợi nhuận gộp"
                value={metrics?.grossProfit || 0}
                type="money"
                growth={metrics?.grossProfitGrowth}
                icon={<Icon icon="mdi:trending-up" className="text-purple-500 w-6 h-6" />}
              />
            </Col>
          </Row>

          <Row gutter={[16, 16]} className="mt-2">
            <Col xs={24} sm={12} md={8}>
              <Card className="shadow-sm border-none">
                <div className="flex flex-col">
                  <span className="text-gray-400 text-sm">Tỷ suất LN gộp</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-bold">
                      {formatPercentage(metrics?.grossProfitMargin || 0)}
                    </span>
                  </div>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Card className="shadow-sm border-none">
                <div className="flex flex-col">
                  <span className="text-gray-400 text-sm">Giá bán/vốn trung bình</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-xl font-bold text-blue-600">
                      {formatShortMoney(metrics?.averageSellingPrice || 0)}
                    </span>
                    <span className="text-gray-300">/</span>
                    <span className="text-xl font-bold text-gray-600">
                      {formatShortMoney(metrics?.averageCostPrice || 0)}
                    </span>
                  </div>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Card className="shadow-sm border-none">
                <div className="flex flex-col">
                  <span className="text-gray-400 text-sm">Tồn kho / Giá trị tồn</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-bold">
                      {formatQuantity(metrics?.endingInventory || 0)}
                    </span>
                    <span className="text-gray-400 text-sm">
                      ({formatMoney(metrics?.endingInventoryValue || 0)})
                    </span>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>

          {/* Chart Section */}
          <Card
            className="mt-4 shadow-sm border-none"
            title={<Title content="Biểu đồ doanh thu & sản lượng" />}
          >
            <div className="h-[350px]">
              <ReactApexChart
                options={getLineOptions(chartCategories)}
                series={chartSeries}
                type="line"
                height="100%"
                width="100%"
              />
            </div>
          </Card>

          {/* Table Section */}
          <div className="mt-4">
            <Title content="10 đơn hàng gần nhất" className="mb-3" />
            <Table
              dataSource={soldOrders}
              columns={columns}
              pagination={false}
              rowKey="id"
              className="shadow-sm rounded-lg overflow-hidden"
              onRow={(record: OrderSnapshot) => ({
                onClick: () => navigate(`/orders/sale/detail/${record.id}`),
                className: "cursor-pointer",
              })}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ReportPage;
