import React, { useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import { Empty } from "antd";
import { ApexOptions } from "apexcharts";
import { formatMoney, formatShortMoney } from "@/shared/utils/number.util";
import { useGlobalData } from "@/shared/hooks/useGlobalData";
import {
  DashboardChartType,
  DashboardRevenueBranch,
  DashboardTypeView,
} from "../dashboard.model";

interface RevenueChartProps {
  data?: DashboardRevenueBranch[];
  typeView: DashboardTypeView;
  chartType: DashboardChartType;
  loading?: boolean;
}

const colors = ["#1677ff", "#00b96b", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

const displayLabel = (label: string, typeView: DashboardTypeView): string => {
  if (typeView !== DashboardTypeView.DAY) return label;
  const [year, month, day] = label.split("-");
  return year && month && day ? `${day}/${month}` : label;
};

const formatAxisMoney = (value: number): string => {
  const shortValue = formatShortMoney(Number(value || 0));
  return shortValue === "0" ? "0" : shortValue;
};

export const RevenueChart: React.FC<RevenueChartProps> = ({
  data = [],
  typeView,
  chartType,
  loading,
}) => {
  const { themeMode } = useGlobalData();
  const labels = data[0]?.data.map((item) => displayLabel(item.label, typeView)) || [];
  const rawLabels = data[0]?.data.map((item) => item.label) || [];

  const barSeries = useMemo(
    () =>
      data.map((branch) => ({
        name: branch.branch,
        data: rawLabels.map(
          (label) => branch.data.find((item) => item.label === label)?.value || 0,
        ),
      })),
    [data, rawLabels],
  );

  const pieData = useMemo(
    () =>
      data.map((branch) => ({
        label: branch.branch,
        value: branch.data.reduce((total, item) => total + Number(item.value || 0), 0),
      })),
    [data],
  );

  const barOptions = useMemo<ApexOptions>(
    () => ({
      chart: {
        type: "bar",
        stacked: true,
        toolbar: { show: false },
        background: "transparent",
      },
      theme: { mode: themeMode },
      colors,
      plotOptions: { bar: { columnWidth: "42%", borderRadius: 0 } },
      dataLabels: { enabled: false },
      xaxis: {
        categories: labels,
        labels: { style: { colors: "#64748b", fontSize: "11px" } },
        axisBorder: { color: "#cbd5e1" },
      },
      yaxis: {
        labels: {
          formatter: (value: number) => formatAxisMoney(value),
          style: { colors: "#64748b", fontSize: "11px" },
        },
      },
      grid: { borderColor: "#e2e8f0", strokeDashArray: 0 },
      legend: { position: "bottom", horizontalAlign: "center" },
      tooltip: { y: { formatter: (value: number) => formatMoney(value) || "0" } },
    }),
    [labels, themeMode],
  );

  const pieOptions = useMemo<ApexOptions>(
    () => ({
      chart: { type: "pie", toolbar: { show: false }, background: "transparent" },
      theme: { mode: themeMode },
      colors,
      labels: pieData.map((item) => item.label),
      legend: { position: "bottom", horizontalAlign: "center" },
      dataLabels: {
        formatter: (value: number) => `${value.toFixed(1)}%`,
      },
      tooltip: { y: { formatter: (value: number) => formatMoney(value) || "0" } },
    }),
    [pieData, themeMode],
  );

  if (loading) {
    return <div className="h-[410px] animate-pulse rounded-lg bg-gray-50" />;
  }

  const hasValue =
    chartType === "pie"
      ? pieData.some((item) => item.value > 0)
      : barSeries.some((series) => series.data.some((value) => value > 0));
  if (!data.length || !hasValue) {
    return (
      <div className="flex h-[410px] items-center justify-center">
        <Empty description="Chưa có dữ liệu doanh thu" />
      </div>
    );
  }

  if (chartType === "pie") {
    return (
      <ReactApexChart
        options={pieOptions}
        series={pieData.map((item) => item.value)}
        type="pie"
        height={410}
      />
    );
  }

  return <ReactApexChart options={barOptions} series={barSeries} type="bar" height={410} />;
};
