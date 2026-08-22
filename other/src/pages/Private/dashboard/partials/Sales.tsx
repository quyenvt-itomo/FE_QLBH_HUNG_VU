import { Icon } from "@iconify/react";
import { PartialProps } from "..";
import { DashboardSalesData, TopProduct } from "../../../../models/dashboard";
import { GrowthCard } from "../components/GrowthCard";
import { formatMoney, formatShortMoney } from "../../../../utils/formatNumber";
import Title from "../../../../components/display/Title";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useClientData } from "../../../../hooks/core/useClientData";
import { useNavigate } from "react-router-dom";
import { buildUrlWithId } from "../../../../utils/paramUtils";
import { privateRoutesName } from "../../../../constants/routerName";

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

/* ================= LINE CHART (Doanh thu 2 năm) ================= */
const getLineOptions = (categories: string[]): ApexOptions => ({
  chart: {
    type: "line",
    toolbar: { show: false },
  },
  stroke: {
    curve: "smooth",
    width: [3, 2], // năm nay đậm hơn
    dashArray: [0, 5], // năm ngoái nét đứt
  },
  colors: ["#3b82f6", "#9ca3af"], // năm nay xanh, năm ngoái xám
  fill: {
    opacity: [1, 0.4], // năm ngoái mờ
  },
  xaxis: {
    categories,
    tickAmount: 7,
    labels: {
      rotate: 0,
      rotateAlways: false,
      trim: false,
      hideOverlappingLabels: false,
      showDuplicates: false,
      style: {
        fontSize: "10px",
        fontWeight: 500,
        colors: "#999999",
      },
    },
    tickPlacement: "on",
  },
  yaxis: {
    labels: {
      formatter: (val) => formatShortMoney(val),
    },
  },
  tooltip: {
    y: {
      formatter: (val) => formatMoney(val),
    },
  },
  legend: {
    position: "top",
    horizontalAlign: "right",
  },
});

export const Sales: React.FC<PartialProps<DashboardSalesData>> = ({ data, loading }) => {
  const { currentStore } = useClientData();
  const navigate = useNavigate();
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

  const [pieEmployeeState, setPieEmployeeState] = useState<{
    series: number[];
    options: ApexOptions;
    labels: string[];
  }>({
    series: [],
    options: getPieOptions(),
    labels: [],
  });

  const [pieStoreState, setPieStoreState] = useState<{
    series: number[];
    options: ApexOptions;
    labels: string[];
  }>({
    series: [],
    options: getPieOptions(),
    labels: [],
  });

  const {
    metrics,
    revenueByDate = [],
    revenueByDateLastYear = [],
    revenueByCategory = [],
    revenueByEmployee = [],
    revenueByStore = [],
    topProducts = [],
    topStores = [],
    topEmployees = [],
    topCustomers = [],
  } = data || {};

  useEffect(() => {
    const today = dayjs().startOf("day");

    // Line chart - Doanh thu 2 năm
    const categories = revenueByDate.map((item) => dayjs(item.date, "DD/MM/YYYY").format("DD/MM"));

    // Lọc ngày tương lai - trả về null thay vì 0
    const revenueThisYear = revenueByDate.map((item) =>
      dayjs(item.date, "DD/MM/YYYY").isAfter(today) ? null : item.revenue,
    );

    const lineSeries = [
      {
        name: "Năm nay",
        data: revenueThisYear,
      },
      {
        name: "Năm ngoái",
        data: revenueByDateLastYear.map((item) => item.revenue),
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

    // Pie chart - Cơ cấu doanh thu theo nhân viên (top 10)
    if (revenueByEmployee.length > 0) {
      const topEmployeesRevenue = revenueByEmployee.slice(0, 10);
      setPieEmployeeState({
        series: topEmployeesRevenue.map((item) => item.revenue),
        options: {
          ...getPieOptions(),
          labels: topEmployeesRevenue.map((item) => item.name),
        },
        labels: topEmployeesRevenue.map((item) => item.name),
      });
    }

    // Pie chart - Cơ cấu doanh thu theo cửa hàng (top 10)
    if (revenueByStore.length > 0) {
      const topStoresRevenue = revenueByStore.slice(0, 10);
      setPieStoreState({
        series: topStoresRevenue.map((item) => item.revenue),
        options: {
          ...getPieOptions(),
          labels: topStoresRevenue.map((item) => item.name),
        },
        labels: topStoresRevenue.map((item) => item.name),
      });
    }
  }, [data]);

  const handleProductClick = (product: TopProduct) => {
    const url = buildUrlWithId(privateRoutesName.product.report, product.id);
    navigate(url);
  };

  const growthCardDetail: Array<{
    label: string;
    value: number;
    growth?: number;
    type?: "quantity" | "money";
    warning?: boolean;
  }> = [
    {
      label: "Tổng doanh thu",
      value: metrics?.totalRevenue || 0,
      growth: metrics?.revenueGrowth,
    },
    {
      label: "Lợi nhuận gộp",
      value: metrics?.grossProfit || 0,
      growth: metrics?.grossProfitGrowth,
    },
    {
      label: "Tổng số đơn",
      value: metrics?.totalOrders || 0,
      growth: metrics?.orderGrowth,
      type: "quantity",
    },
    {
      label: "Giá trị ĐH TB",
      value: metrics?.avgOrderValue || 0,
      growth: metrics?.avgOrderValueGrowth,
    },
    {
      label: "Tổng giảm giá",
      value: metrics?.totalDiscount || 0,
      growth: metrics?.discountGrowth,
      warning: true,
    },
  ];

  const salesDetails = [
    {
      key: "(1)",
      label: "Doanh thu chưa thuế",
      value: metrics?.totalRevenue || 0,
    },
    {
      key: "(2)",
      label: "Thuế VAT đầu ra",
      value: metrics?.totalSalesTax || 0,
    },
    {
      key: "(3=1+2)",
      label: "Doanh thu có thuế",
      value: metrics?.totalRevenueWithTax || 0,
      bold: true,
    },
    {
      key: "(4)",
      label: "Giá vốn hàng bán",
      value: metrics?.totalCost || 0,
    },
    {
      key: "(5=1-4)",
      label: "Lợi nhuận gộp",
      value: metrics?.grossProfit || 0,
      bold: true,
    },
    {
      key: "",
      label: "Tỷ suất lợi nhuận gộp",
      value: `${(metrics?.grossProfitMargin || 0).toFixed(1)}%`,
      isPercent: true,
    },
  ];

  return (
    <div className="flex flex-col gap-4 w-full">
      <div
        className="
        grid grid-cols-5 bg-white shadow-sm py-4 rounded-md
        cursor-pointer transition-shadow ease-in-out
        "
      >
        {growthCardDetail.map((item, index) => (
          <GrowthCard
            key={item.label}
            label={item.label}
            value={item.value}
            type={item.type || "money"}
            growth={item.growth}
            loading={loading}
            warning={item.warning}
            borderLeft={index !== 0}
          />
        ))}
      </div>

      <div className="flex gap-4">
        {/* Chi tiết doanh thu */}
        <div className="flex flex-col gap-4 w-[440px]">
          <div
            className="
            bg-white shadow-sm p-4 pt-2 pb-8 rounded-md relative
            cursor-pointer transition-shadow ease-in-out
            "
          >
            <Title content="Chi tiết doanh thu" />
            {salesDetails.map((item) => (
              <div
                key={item.label}
                className={`flex gap-2 px-2 py-2.5 border-b items-center text-xs ${item.bold ? "font-semibold" : ""}`}
              >
                <div className="flex-1">
                  <span className="block truncate">{item.label}</span>
                </div>
                <div className="w-14 flex items-center justify-center text-[10px]">{item.key}</div>
                <div className="w-28 flex items-center justify-end">
                  {item.isPercent ? item.value : formatMoney(item.value as number) || "0"}
                </div>
              </div>
            ))}
            <span className="absolute bottom-2 text-[10px] text-gray-400 italic">
              Doanh thu bán hàng bao gồm cả doanh thu từ đơn đổi hàng
            </span>
          </div>

          {/* Top 5 cửa hàng - chỉ hiển thị khi không có currentStore */}
          {!currentStore && (
            <div
              className="
              bg-white shadow-sm p-4 pt-2 rounded-md
              cursor-pointer transition-shadow ease-in-out
              "
            >
              <Title content="Top 5 cửa hàng" />
              {topStores.length > 0 ? (
                <div className="space-y-2">
                  {topStores.slice(0, 5).map((store, index) => (
                    <div key={store.id} className="flex items-center gap-3 p-2 border-b">
                      <div className="text-sm font-semibold text-gray-500 w-6">{index + 1}</div>
                      <div className="flex-1">
                        <div className="text-xs font-medium truncate">{store.name}</div>
                        <div className="text-[10px] text-gray-500">{store.orders} đơn</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-semibold">{formatMoney(store.revenue)}</div>
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
          )}

          {/* Top 5 sản phẩm */}
          <div
            className="
            bg-white shadow-sm p-4 pt-2 rounded-md
            cursor-pointer transition-shadow ease-in-out
            "
          >
            <Title content="Top 5 sản phẩm" />
            {topProducts.length > 0 ? (
              <div className="space-y-2">
                {topProducts.slice(0, 5).map((product, index) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-3 p-2 border-b cursor-pointer group"
                    onClick={() => handleProductClick(product)}
                  >
                    <div className="text-sm font-semibold text-gray-500 w-6">{index + 1}</div>
                    <div className="flex-1">
                      <div className="text-xs font-medium truncate group-hover:text-primary">
                        {product.name}
                      </div>
                      <div className="text-[10px] text-gray-500">{product.code}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-semibold group-hover:text-primary">
                        {formatMoney(product.revenue)}
                      </div>
                      <div className="text-[10px] text-gray-500">SL: {product.quantity}</div>
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

          {/* Top 5 nhân viên */}
          <div
            className="
            bg-white shadow-sm p-4 pt-2 rounded-md
            cursor-pointer transition-shadow ease-in-out
            "
          >
            <Title content="Top 5 nhân viên" />
            {topEmployees.length > 0 ? (
              <div className="space-y-2">
                {topEmployees.slice(0, 5).map((employee, index) => (
                  <div key={employee.id} className="flex items-center gap-3 p-2 border-b">
                    <div className="text-sm font-semibold text-gray-500 w-6">{index + 1}</div>
                    <div className="flex-1">
                      <div className="text-xs font-medium truncate">{employee.name}</div>
                      <div className="text-[10px] text-gray-500">{employee.orders} đơn</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-semibold">{formatMoney(employee.revenue)}</div>
                      <div className="text-[10px] text-gray-500">
                        TB: {formatMoney(employee.avgOrderValue)}
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

          {/* Top 5 khách hàng */}
          <div
            className="
            bg-white shadow-sm p-4 pt-2 rounded-md
            cursor-pointer transition-shadow ease-in-out
            "
          >
            <Title content="Top 5 khách hàng" />
            {topCustomers.length > 0 ? (
              <div className="space-y-2">
                {topCustomers.slice(0, 5).map((customer, index) => (
                  <div key={customer.id} className="flex items-center gap-3 p-2 border-b">
                    <div className="text-sm font-semibold text-gray-500 w-6">{index + 1}</div>
                    <div className="flex-1">
                      <div className="text-xs font-medium truncate">{customer.name}</div>
                      <div className="text-[10px] text-gray-500">{customer.code}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-semibold">{formatMoney(customer.revenue)}</div>
                      <div className="text-[10px] text-gray-500">{customer.orders} đơn</div>
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
        </div>

        {/* Biểu đồ */}
        <div className="flex flex-col w-[calc(100%-456px)] gap-4">
          <div className="bg-white shadow-sm rounded-lg p-4 pt-2">
            <Title content="Biểu đồ doanh thu" />
            <ReactApexChart
              options={lineState.options}
              series={lineState.series}
              type="line"
              height={350}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white shadow-sm rounded-lg p-4 pt-2">
              <Title content="Cơ cấu doanh thu theo danh mục" />
              {revenueByCategory.length > 0 ? (
                <ReactApexChart
                  options={pieCategoryState.options}
                  series={pieCategoryState.series}
                  type="pie"
                  height={350}
                />
              ) : (
                <div className="flex items-center justify-center h-[350px] text-gray-400">
                  Không có dữ liệu
                </div>
              )}
            </div>

            {/* Hiển thị theo nhân viên nếu có currentStore hoặc không có revenueByStore, ngược lại theo cửa hàng */}
            {currentStore || revenueByStore.length === 0 ? (
              <div className="bg-white shadow-sm rounded-lg p-4 pt-2">
                <Title content="Cơ cấu doanh thu theo nhân viên" />
                {revenueByEmployee.length > 0 ? (
                  <ReactApexChart
                    options={pieEmployeeState.options}
                    series={pieEmployeeState.series}
                    type="pie"
                    height={350}
                  />
                ) : (
                  <div className="flex items-center justify-center h-[350px] text-gray-400">
                    Không có dữ liệu
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white shadow-sm rounded-lg p-4 pt-2">
                <Title content="Cơ cấu doanh thu theo cửa hàng" />
                {revenueByStore.length > 0 ? (
                  <ReactApexChart
                    options={pieStoreState.options}
                    series={pieStoreState.series}
                    type="pie"
                    height={350}
                  />
                ) : (
                  <div className="flex items-center justify-center h-[350px] text-gray-400">
                    Không có dữ liệu
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
