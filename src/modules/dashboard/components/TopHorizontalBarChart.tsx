import React, { useMemo } from "react";
import { Empty } from "antd";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatMoney, formatQuantity, formatShortMoney } from "@/shared/utils/number.util";
import { useGlobalData } from "@/shared/hooks/useGlobalData";

export interface HorizontalBarItem {
  id: string;
  label: string;
  value: number;
}

interface TopHorizontalBarChartProps {
  title: string;
  data?: HorizontalBarItem[];
  valueType: "money" | "quantity";
  loading?: boolean;
  actions?: React.ReactNode;
}

interface BarLabelProps {
  x?: number | string;
  y?: number | string;
  width?: number | string;
  height?: number | string;
  value?: unknown;
  valueType?: TopHorizontalBarChartProps["valueType"];
}

const TICK_COUNT = 5;
const ROW_HEIGHT = 40;
const BAR_HEIGHT = 20;

const toNumber = (value: unknown) => Number(value) || 0;

const formatValue = (value: number, valueType: TopHorizontalBarChartProps["valueType"]) =>
  valueType === "money" ? formatMoney(value) || "0" : formatQuantity(value) || "0";

const formatAxisValue = (value: number, valueType: TopHorizontalBarChartProps["valueType"]) =>
  valueType === "money" ? formatShortMoney(value) : formatQuantity(value) || "0";

const getNiceMax = (value: number) => {
  if (value <= 0) return 1;

  const magnitude = 10 ** Math.floor(Math.log10(value));
  return Math.ceil(value / magnitude) * magnitude;
};

const truncateLabel = (value: unknown, maxLength = 72) => {
  const label = String(value || "");
  return label.length > maxLength ? `${label.slice(0, maxLength - 3)}...` : label;
};

const CategoryLabel: React.FC<BarLabelProps> = ({ x = 0, y = 0, value }) => (
  <text
    x={toNumber(x) + 8}
    y={toNumber(y) - 6}
    fill="#334155"
    fontSize={11}
    textAnchor="start"
    pointerEvents="none"
  >
    {truncateLabel(value)}
  </text>
);

const ValueLabel: React.FC<BarLabelProps> = ({
  x = 0,
  y = 0,
  width = 0,
  height = BAR_HEIGHT,
  value,
  valueType = "money",
}) => (
  <text
    x={toNumber(x) + toNumber(width) + 8}
    y={toNumber(y) + toNumber(height) / 2}
    fill="#334155"
    fontSize={11}
    dominantBaseline="middle"
    textAnchor="start"
    pointerEvents="none"
  >
    {formatValue(toNumber(value), valueType)}
  </text>
);

export const TopHorizontalBarChart: React.FC<TopHorizontalBarChartProps> = ({
  title,
  data = [],
  valueType,
  loading,
  actions,
}) => {
  const { themeMode } = useGlobalData();
  const chartData = useMemo(
    () => data.map((item) => ({ ...item, value: Math.max(0, Number(item.value) || 0) })),
    [data],
  );
  const maxValue = useMemo(
    () => getNiceMax(Math.max(...chartData.map((item) => item.value), 0)),
    [chartData],
  );
  const ticks = useMemo(
    () => Array.from({ length: TICK_COUNT + 1 }, (_, index) => (maxValue / TICK_COUNT) * index),
    [maxValue],
  );
  const chartHeight = Math.max(280, chartData.length * ROW_HEIGHT + 48);
  const axisColor = themeMode === "dark" ? "#cbd5e1" : "#64748b";
  const gridColor = themeMode === "dark" ? "#334155" : "#e2e8f0";

  return (
    <div className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-sm font-bold text-gray-900">{title}</h3>
        {actions}
      </div>
      {loading ? (
        <div className="h-[350px] animate-pulse rounded bg-gray-50" />
      ) : chartData.length ? (
        <div style={{ height: chartHeight }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 28, right: 72, bottom: 20, left: 0 }}
              barCategoryGap={0}
            >
              <CartesianGrid stroke={gridColor} horizontal vertical />
              <XAxis
                type="number"
                domain={[0, maxValue]}
                ticks={ticks}
                tick={{ fill: axisColor, fontSize: 11 }}
                tickFormatter={(value) => formatAxisValue(Number(value), valueType)}
                axisLine={{ stroke: gridColor }}
                tickLine={{ stroke: gridColor }}
              />
              <YAxis
                type="category"
                dataKey="label"
                width={0}
                axisLine={false}
                tickLine={false}
                tick={false}
              />
              <Tooltip
                cursor={{ fill: themeMode === "dark" ? "#1e293b" : "#eff6ff" }}
                formatter={(value) => [formatValue(Number(value), valueType), title]}
                labelFormatter={(label) => String(label)}
              />
              <Bar
                dataKey="value"
                fill="#1677ff"
                barSize={BAR_HEIGHT}
                radius={[0, 2, 2, 0]}
                isAnimationActive
                animationBegin={0}
                animationDuration={700}
                animationEasing="ease-out"
              >
                <LabelList dataKey="label" content={<CategoryLabel />} />
                <LabelList dataKey="value" content={<ValueLabel valueType={valueType} />} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex h-[350px] items-center justify-center">
          <Empty description="Chưa có dữ liệu" />
        </div>
      )}
    </div>
  );
};
