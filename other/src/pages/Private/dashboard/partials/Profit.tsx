import { Icon } from "@iconify/react";
import { PartialProps } from "..";
import { DashboardProfitData } from "../../../../models/dashboard";
import { GrowthCard } from "../components/GrowthCard";
import { formatMoney } from "../../../../utils/formatNumber";
import Title from "../../../../components/display/Title";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { Tabs, TabsProps } from "antd";
import { RevenueByCategoryTable } from "../components/RevenueByCategory";
import { RevenueByEmployeeTable } from "../components/RevenueByEmployee";
import { RevenueByStoreTable } from "../components/RevenueByStore";
import { useClientData } from "../../../../hooks/core/useClientData";

const getOptions = (categories: string[]): ApexOptions => ({
  chart: {
    type: "line",
    stacked: false,
    toolbar: { show: false },
  },
  stroke: {
    width: [0, 0, 3], // line dày hơn
  },
  plotOptions: {
    bar: {
      columnWidth: "8px", //
      borderRadius: 1,
    },
  },
  dataLabels: {
    enabled: false,
  },
  xaxis: {
    categories,
    tickAmount: 7,
    labels: {
      rotate: 0, // ❌ không xoay chéo
      rotateAlways: false,
      trim: false, // không cắt chữ
      hideOverlappingLabels: false,
      showDuplicates: false,

      style: {
        fontSize: "10px",
        fontWeight: 500,
        colors: "#999999",
      },
    },

    tickPlacement: "on", // 👈 tick nằm giữa
  },
  yaxis: {
    labels: {
      formatter: (val) => formatMoney(val),
    },
  },
  tooltip: {
    y: {
      formatter: (val) => formatMoney(val),
    },
  },
  colors: ["#16a34a", "#ef4444", "#16a34a"], // green, red, blue
  legend: {
    position: "top",
  },
});

export const Profit: React.FC<PartialProps<DashboardProfitData>> = ({ data, loading }) => {
  const { currentStore } = useClientData();
  const [state, setState] = useState<{
    series: ApexAxisChartSeries;
    options: ApexOptions;
  }>({
    series: [],
    options: getOptions([]),
  });
  const [tabActive, setTabActive] = useState<string>("category");

  const {
    metrics,

    // hạch toán
    ortherIncomeDetails = [],
    otherExpenseDetails = [],

    // biểu đồ
    saleRevenueByDate = [],
    saleCostByDate = [],
    grossProfitByDate = [],

    // cơ cấu doanh thu
    revenueByCategory = [],
    revenueByEmployee = [],
    revenueByStore = [],
  } = data || {};

  useEffect(() => {
    const categories = saleRevenueByDate.map((item) =>
      dayjs(item.date, "DD/MM/YYYY").format("DD/MM"),
    );
    const series = [
      {
        name: "Doanh thu bán hàng",
        type: "column",
        data: saleRevenueByDate.map((item) => item.revenue),
      },
      {
        name: "Giá vốn hàng bán",
        type: "column",
        data: saleCostByDate.map((item) => item.revenue),
      },
      {
        name: "Lợi nhuận gộp",
        type: "line",
        data: grossProfitByDate.map((item) => item.revenue),
      },
    ];

    setState({
      series,
      options: getOptions(categories),
    });
  }, [data]);

  const growthCardDetail = [
    {
      label: "Tổng doanh thu (1+5)",
      value: metrics?.totalRevenue || 0,
      growth: metrics?.revenueGrowth,
    },
    {
      label: "Lợi nhuận gộp (4)",
      value: metrics?.grossProfit || 0,
      growth: metrics?.grossProfitGrowth,
    },
    {
      label: "Chi phí (6)",
      value: metrics?.totalOtherExpense || 0,
      growth: metrics?.otherExpenseGrowth,
      warning: true,
    },
    {
      label: "Lợi nhuận ròng (4 + 5 - 6)",
      value: metrics?.netProfit || 0,
      growth: metrics?.netProfitGrowth,
    },
    {
      label: "Tỷ suất lợi nhuận ròng",
      value: metrics?.netProfitMargin || 0,
      growth: 0,
    },
  ];

  // Doanh thu bán hàng
  const grossProfitDetails = [
    {
      key: "(1)",
      label: "Doanh thu bán hàng",
      value: (metrics?.totalSalesRevenue || 0) + (metrics?.totalReturnRevenue || 0),
    },
    {
      key: "(2)",
      label: "Giá vốn hàng bán",
      value: metrics?.totalCost || 0,
    },
    {
      key: "(3)",
      label: "Phí vận chuyển",
      value: metrics?.totalShippingExpense || 0,
    },
    {
      key: "(4=1-2-3)",
      label: "Lợi nhuận gộp",
      value: metrics?.grossProfit || 0,
    },
  ];

  // Doanh thu khác
  const otherRevenueDetails = [
    ...ortherIncomeDetails.map((item) => ({
      key: "",
      label: item.name || "",
      value: item.amount || 0,
      bold: false,
    })),
    {
      key: "(5)",
      label: "Tổng cộng",
      bold: true,
      value: metrics?.totalOtherIncome || 0,
    },
  ];

  // Cơ cấu chi phí khác
  const orderFeeDetails = [
    ...otherExpenseDetails.map((item) => ({
      key: "",
      label: item.name || "",
      value: item.amount || 0,
      bold: false,
    })),
    {
      key: "(6)",
      label: "Tổng cộng",
      bold: true,
      value: metrics?.totalOtherExpense || 0,
    },
  ];

  const adjustmentDetails = [
    ...[
      {
        key: "inventory",
        label: "Điều chỉnh tồn kho",
        value: metrics?.totalInventoryAdjustmentValue || 0,
        bold: false,
      },
      {
        key: "debt",
        label: "Điều chỉnh công nợ",
        value: metrics?.totalReceivableAdjustmentValue || 0,
        bold: false,
      },
      {
        key: "fund",
        label: "Điều chỉnh quỹ tiền",
        value: metrics?.totalFundAdjustmentValue || 0,
        bold: false,
      },
    ].filter((item) => item.value !== 0),
    {
      key: "total",
      label: "Tổng điều chỉnh",
      value:
        (metrics?.totalInventoryAdjustmentValue || 0) +
        (metrics?.totalReceivableAdjustmentValue || 0) +
        (metrics?.totalFundAdjustmentValue || 0),
      bold: true,
    },
  ];

  const tabItems: TabsProps["items"] = [
    {
      key: "category",
      label: "Nhóm hàng",
    },
    {
      key: "employee",
      label: "Nhân viên",
    },
    ...(!currentStore
      ? [
          {
            key: "store",
            label: "Cửa hàng",
          },
        ]
      : []),
  ];

  const tableMap: Record<string, React.ReactNode> = {
    category: <RevenueByCategoryTable data={revenueByCategory} loading={loading} />,
    employee: <RevenueByEmployeeTable data={revenueByEmployee} loading={loading} />,
    store: <RevenueByStoreTable data={revenueByStore || []} loading={loading} />,
  };

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
            type={index === growthCardDetail.length - 1 ? "percentage" : "money"}
            growth={item.growth}
            loading={loading}
            warning={item.warning}
            borderLeft={index !== 0}
          />
        ))}
      </div>
      <div className="flex gap-4">
        {/* Hạch toán */}
        <div className="flex flex-col gap-4 w-[440px]">
          <div
            className="
            bg-white shadow-sm p-4 pt-2 pb-8 rounded-md relative
            cursor-pointer transition-shadow ease-in-out
            "
          >
            <Title content="Doanh thu bán hàng" />
            {grossProfitDetails.map((item) => (
              <div key={item.key} className="flex gap-2 px-2 py-2.5 border-b items-center text-xs">
                <div className="flex-1">
                  <span className="block truncate">{item.label}</span>
                </div>
                <div className="w-14 flex items-center justify-center text-[10px]">{item.key}</div>
                <div className="w-28 flex items-center justify-end">
                  {formatMoney(item.value) || "0"}
                </div>
              </div>
            ))}

            <span className="absolute bottom-2 text-[10px] text-gray-400 italic">
              Doanh thu bán hàng bao gồm cả doanh thu từ đơn đổi hàng
            </span>
          </div>

          <div
            className="
            bg-white shadow-sm p-4 pt-2 pb-8 rounded-md relative
            cursor-pointer transition-shadow ease-in-out
            "
          >
            <Title content="Doanh thu khác" />
            {otherRevenueDetails.map((item) => (
              <div
                key={item.label}
                className={`flex gap-2 px-2 py-2.5 border-b items-center text-xs ${item.bold ? "font-semibold" : ""}`}
              >
                <div className="flex-1">
                  <span className="block truncate">{item.label}</span>
                </div>
                <div className="w-14 flex items-center justify-center text-[10px]">{item.key}</div>
                <div className="w-28 flex items-center justify-end">
                  {formatMoney(item.value) || "0"}
                </div>
              </div>
            ))}
          </div>

          <div
            className="
            bg-white shadow-sm p-4 pt-2 pb-8 rounded-md relative
            cursor-pointer transition-shadow ease-in-out
            "
          >
            <Title content="Cơ cấu chi phí" />
            {orderFeeDetails.map((item) => (
              <div
                key={item.label}
                className={`flex gap-2 px-2 py-2.5 border-b items-center text-xs ${item.bold ? "font-semibold" : ""}`}
              >
                <div className="flex-1">
                  <span className="block truncate">{item.label}</span>
                </div>
                <div className="w-14 flex items-center justify-center text-[10px]">{item.key}</div>
                <div className="w-28 flex items-center justify-end">
                  {formatMoney(item.value) || "0"}
                </div>
              </div>
            ))}
          </div>

          <div
            className="
            bg-white shadow-sm p-4 pt-2 pb-8 rounded-md relative
            cursor-pointer transition-shadow ease-in-out
            "
          >
            <Title content="Điều chỉnh trong kỳ" />
            {adjustmentDetails.map((item) => (
              <div
                key={item.label}
                className={`flex gap-2 px-2 py-2.5 border-b items-center text-xs ${item.bold ? "font-semibold" : ""}`}
              >
                <div className="flex-1">
                  <span className="block truncate">{item.label}</span>
                </div>
                <div className="w-14 flex items-center justify-center text-[10px]">
                  {item.bold ? "(7)" : ""}
                </div>
                <div className="w-28 flex items-center justify-end">
                  {formatMoney(item.value) || "0"}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Biểu đồ & cơ cấu */}
        <div className="flex flex-col w-[calc(100%-456px)] gap-4">
          <div className="bg-white shadow-sm rounded-lg p-4 pt-2">
            <Title content="Biểu đồ lợi nhuận gộp" />
            <ReactApexChart options={state.options} series={state.series} height={350} />
          </div>

          <div className="bg-white shadow-sm rounded-lg p-4 pt-2">
            <Title content="Cơ cấu doanh thu bán hàng" />
            <Tabs items={tabItems} activeKey={tabActive} onChange={setTabActive} />
            <div className="flex flex-col h-80">{tableMap[tabActive]}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
