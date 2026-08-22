import { Icon } from "@iconify/react";
import { Card, Tabs, TabsProps, Skeleton } from "antd";
import { PartialProps } from "..";
import { DashboardProductData } from "../../../../models/dashboard";
import { GrowthCard } from "../components/GrowthCard";
import { StatsCard } from "../components/StatsCard";
import { formatMoney, formatShortMoney, formatQuantity } from "../../../../utils/formatNumber";
import Title from "../../../../components/display/Title";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { RevenueByCategoryTable } from "../components/RevenueByCategory";
import { TopSellingProductsTable } from "../components/TopSellingProductsTable";
import { LowStockProductsTable } from "../components/LowStockProductsTable";
import { DeadStockProductsTable } from "../components/DeadStockProductsTable";
import {
  ChartPieIcon,
  ArrowTrendingUpIcon,
  SparklesIcon,
  ExclamationTriangleIcon,
  InboxIcon,
  BanknotesIcon,
} from "@heroicons/react/24/outline";
import { buildUrlWithId } from "../../../../utils/paramUtils";
import { privateRoutesName } from "../../../../constants/routerName";
import { useNavigate } from "react-router-dom";

/* ================= PIE CHART (Cơ cấu doanh thu) ================= */
const getPieOptions = (): ApexOptions => ({
  chart: {
    type: "pie",
  },
  legend: {
    position: "bottom",
    horizontalAlign: "center",
  },
  tooltip: {
    y: {
      formatter: (value: number) => formatMoney(value),
    },
  },
  dataLabels: {
    formatter: (val: number) => {
      return val.toFixed(1) + "%";
    },
  },
  colors: ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#06b6d4"],
});

/* ================= LINE CHART (Doanh thu và Số lượng bán) ================= */
const getLineOptions = (categories: string[]): ApexOptions => ({
  chart: {
    type: "line",
    toolbar: { show: false },
  },
  stroke: {
    curve: "smooth",
    width: [4, 4], // Làm đường đậm hơn
  },
  colors: ["#3b82f6", "#22c55e"], // Doanh thu: Xanh dương, Số lượng: Xanh lá
  fill: {
    type: "solid",
    opacity: 1, // Tăng độ đục lên tối đa để đường đậm và rõ nét
  },
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

export const Product: React.FC<PartialProps<DashboardProductData>> = ({ data, loading }) => {
  const [lineState, setLineState] = useState<{
    series: ApexAxisChartSeries;
    options: ApexOptions;
  }>({
    series: [],
    options: getLineOptions([]),
  });

  const [pieCategoryState, setPieCategoryState] = useState<{
    series: number[];
    options: ApexOptions;
    labels: string[];
  }>({
    series: [],
    options: getPieOptions(),
    labels: [],
  });
  const navigate = useNavigate();

  const {
    metrics,
    revenueByDate = [],
    topSellingProducts = [],
    lowStockProducts = [],
    deadStockProducts = [],
    revenueByCategory = [],
  } = data || {};

  useEffect(() => {
    const today = dayjs().startOf("day");

    // Line chart - Doanh thu theo ngày
    const categories = revenueByDate.map((item) => dayjs(item.date, "DD/MM/YYYY").format("DD/MM"));

    // Lọc ngày tương lai - trả về null thay vì 0
    const revenueData = revenueByDate.map((item) =>
      dayjs(item.date, "DD/MM/YYYY").isAfter(today) ? null : item.revenue,
    );
    const quantityData = revenueByDate.map((item) =>
      dayjs(item.date, "DD/MM/YYYY").isAfter(today) ? null : item.productsSold,
    );

    const lineSeries = [
      {
        name: "Doanh thu",
        type: "line",
        data: revenueData,
      },
      {
        name: "Số lượng bán",
        type: "line",
        data: quantityData,
      },
    ];

    setLineState({
      series: lineSeries,
      options: getLineOptions(categories),
    });

    // Pie chart - Cơ cấu doanh thu theo danh mục
    if (revenueByCategory.length > 0) {
      setPieCategoryState({
        series: revenueByCategory.map((item) => item.revenue),
        options: {
          ...getPieOptions(),
          labels: revenueByCategory.map((item) => item.name),
        },
        labels: revenueByCategory.map((item) => item.name),
      });
    }
  }, [data]);

  const metricsCards = [
    {
      label: "Tổng sản phẩm",
      value: metrics?.totalProducts || 0,
      growth: metrics?.productGrowth,
      type: "quantity" as const,
      icon: <ChartPieIcon className="h-6 w-6" />,
    },
    {
      label: "Sản phẩm mới",
      value: metrics?.newProducts || 0,
      growth: metrics?.newProductGrowth,
      type: "quantity" as const,
      icon: <SparklesIcon className="h-6 w-6" />,
    },
    {
      label: "Sản phẩm bán được",
      value: metrics?.totalSellingProducts || 0,
      growth: metrics?.sellingProductGrowth,
      type: "quantity" as const,
      icon: <ArrowTrendingUpIcon className="h-6 w-6" />,
    },
    {
      label: "Sản phẩm đã mua",
      value: metrics?.totalPurchasedProducts || 0,
      growth: metrics?.purchasedProductGrowth,
      type: "quantity" as const,
      icon: <InboxIcon className="h-6 w-6" />,
    },
    {
      label: "Tồn kho cuối kỳ",
      value: metrics?.totalEndingInventory || 0,
      growth: metrics?.endingInventoryGrowth,
      type: "quantity" as const,
      warning: (metrics?.totalEndingInventory || 0) > 1000,
      icon: <InboxIcon className="h-6 w-6" />,
    },
    {
      label: "Giá trị tồn cuối kỳ",
      value: metrics?.totalEndingInventoryValue || 0,
      growth: metrics?.endingInventoryValueGrowth,
      type: "money" as const,
      warning: (metrics?.totalEndingInventoryValue || 0) > 500000000,
      icon: <BanknotesIcon className="h-6 w-6" />,
    },
    {
      label: "Điều chỉnh tồn",
      value: metrics?.totalInventoryAdjustment || 0,
      growth: metrics?.inventoryAdjustmentGrowth,
      type: "quantity" as const,
      icon: <SparklesIcon className="h-6 w-6" />,
    },
    {
      label: "Giá trị điều chỉnh",
      value: metrics?.totalInventoryAdjustmentValue || 0,
      growth: metrics?.inventoryAdjustmentValueGrowth,
      type: "money" as const,
      icon: <SparklesIcon className="h-6 w-6" />,
    },
  ];

  const handleViewDetailProduct = (productId: string) => {
    const url = buildUrlWithId(privateRoutesName.product.report, productId);
    navigate(url);
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Metrics Cards */}
      <div className="grid grid-cols-4 gap-3">
        {metricsCards.map((card) => (
          <StatsCard
            key={card.label}
            label={card.label}
            value={card.value}
            type={card.type}
            growth={card.growth}
            loading={loading}
            warning={card.warning}
            icon={card.icon}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="flex gap-4">
        {/* Revenue by date chart */}
        <div className="bg-white shadow-sm rounded-lg p-4 pt-2 w-3/5">
          <Title content="Biểu đồ doanh thu theo ngày" />
          {loading ? (
            <div className="flex items-center justify-center h-[300px]">
              <Skeleton.Button active style={{ width: 400, height: 280 }} />
            </div>
          ) : revenueByDate.length > 0 ? (
            <ReactApexChart
              options={lineState.options}
              series={lineState.series}
              type="line"
              height={300}
            />
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-400">
              Không có dữ liệu
            </div>
          )}
        </div>

        {/* Revenue by category pie chart */}
        <div className="bg-white shadow-sm rounded-lg p-4 pt-2 w-2/5">
          <Title content="Cơ cấu doanh thu theo danh mục" />
          {loading ? (
            <div className="flex items-center justify-center h-[300px]">
              <Skeleton.Avatar active size={200} shape="circle" />
            </div>
          ) : revenueByCategory.length > 0 ? (
            <ReactApexChart
              options={pieCategoryState.options}
              series={pieCategoryState.series}
              type="pie"
              height={300}
            />
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-400">
              Không có dữ liệu
            </div>
          )}
        </div>
      </div>

      {/* Bottom Sections: Tables converted to Lists */}
      <div className="grid grid-cols-3 gap-4">
        {/* Top Selling Products */}
        <div className="bg-white shadow-sm p-4 pt-2 rounded-md transition-shadow ease-in-out">
          <Title content="🔥 Top sản phẩm bán chạy" />
          {loading ? (
            <div className="space-y-4 py-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} active avatar paragraph={{ rows: 1 }} />
              ))}
            </div>
          ) : topSellingProducts.length > 0 ? (
            <div className="space-y-2">
              {topSellingProducts.slice(0, 10).map((product, index) => (
                <div
                  key={product.id}
                  className="flex items-center gap-3 p-2 border-b last:border-0 cursor-pointer group"
                  onClick={() => handleViewDetailProduct(product.id)}
                >
                  <div className="text-sm font-semibold text-gray-500 w-6">{index + 1}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium truncate group-hover:text-primary">
                      {product.name}
                    </div>
                    <div className="text-[10px] text-gray-500 font-mono">{product.code}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-semibold text-blue-600">
                      {formatMoney(product.revenue)}
                    </div>
                    <div className="text-[10px] text-gray-500">
                      SL: {formatQuantity(product.soldQuantity)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center py-8 text-gray-400 text-sm">
              Chưa có dữ liệu
            </div>
          )}
        </div>

        {/* Low Stock Products */}
        <div className="bg-white shadow-sm p-4 pt-2 rounded-md transition-shadow ease-in-out">
          <Title content="⚠️ Sắp hết hàng" />
          {loading ? (
            <div className="space-y-4 py-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} active avatar paragraph={{ rows: 1 }} />
              ))}
            </div>
          ) : lowStockProducts.length > 0 ? (
            <div className="space-y-2">
              {lowStockProducts.slice(0, 10).map((product, index) => (
                <div
                  key={product.id}
                  className="flex items-center gap-3 p-2 border-b last:border-0 cursor-pointer group"
                  onClick={() => handleViewDetailProduct(product.id)}
                >
                  <div className="text-sm font-semibold text-gray-500 w-6">{index + 1}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium truncate group-hover:text-primary">
                      {product.name}
                    </div>
                    <div className="text-[10px] text-gray-500 font-mono">{product.code}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-red-500 font-medium">
                      Tồn: {formatQuantity(product.currentStock)}
                    </div>
                    <div className="text-[10px]">{product.categoryName}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center py-8 text-gray-400 text-sm italic">
              Tồn kho ổn định
            </div>
          )}
        </div>

        {/* Dead Stock Products */}
        <div className="bg-white shadow-sm p-4 pt-2 rounded-md transition-shadow ease-in-out">
          <Title content="💀 Tồn kho chết" />
          {loading ? (
            <div className="space-y-4 py-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} active avatar paragraph={{ rows: 1 }} />
              ))}
            </div>
          ) : deadStockProducts.length > 0 ? (
            <div className="space-y-2">
              {deadStockProducts.slice(0, 10).map((product, index) => (
                <div
                  key={product.id}
                  className="flex items-center gap-3 p-2 border-b last:border-0 cursor-pointer group"
                  onClick={() => handleViewDetailProduct(product.id)}
                >
                  <div className="text-sm font-semibold text-gray-500 w-6">{index + 1}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium truncate group-hover:text-primary">
                      {product.name}
                    </div>
                    <div className="text-[10px] text-gray-500">
                      {product.daysWithoutSale} ngày chưa bán
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-medium text-red-600">
                      Tồn: {formatMoney(product.currentStock)}
                    </div>
                    <div className="text-xs  text-red-600">{formatMoney(product.stockValue)}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center py-8 text-gray-400 text-sm italic">
              Không có tồn chết
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
