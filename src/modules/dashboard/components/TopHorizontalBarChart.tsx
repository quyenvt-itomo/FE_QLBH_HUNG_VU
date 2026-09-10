import React, { useMemo } from "react";
import { Empty } from "antd";
import { formatMoney, formatQuantity, formatShortMoney } from "@/shared/utils/number.util";

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

const TICK_COUNT = 5;
const ROW_HEIGHT = 40;

const formatValue = (value: number, valueType: TopHorizontalBarChartProps["valueType"]) =>
  valueType === "money" ? formatMoney(value) || "0" : formatQuantity(value) || "0";

const formatAxisValue = (value: number, valueType: TopHorizontalBarChartProps["valueType"]) =>
  valueType === "money" ? formatShortMoney(value) : formatQuantity(value) || "0";

const getNiceMax = (value: number) => {
  if (value <= 0) return 1;

  const magnitude = 10 ** Math.floor(Math.log10(value));
  return Math.ceil(value / magnitude) * magnitude;
};

export const TopHorizontalBarChart: React.FC<TopHorizontalBarChartProps> = ({
  title,
  data = [],
  valueType,
  loading,
  actions,
}) => {
  const maxValue = useMemo(
    () => getNiceMax(Math.max(...data.map((item) => item.value), 0)),
    [data],
  );
  const ticks = useMemo(
    () => Array.from({ length: TICK_COUNT + 1 }, (_, index) => (maxValue / TICK_COUNT) * index),
    [maxValue],
  );

  const chartHeight = Math.max(280, data.length * ROW_HEIGHT + 28);

  return (
    <div className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-sm font-bold text-gray-900">{title}</h3>
        {actions}
      </div>
      {loading ? (
        <div className="h-[350px] animate-pulse rounded bg-gray-50" />
      ) : data.length ? (
        <div className="relative overflow-hidden" style={{ height: chartHeight }}>
          <div className="mr-14 h-[calc(100%-24px)]">
            <div className="pointer-events-none absolute bottom-6 left-0 right-14 top-0">
              {ticks.map((tick) => (
                <span
                  key={tick}
                  className="absolute bottom-0 top-0 border-l border-gray-200"
                  style={{ left: `${(tick / maxValue) * 100}%` }}
                />
              ))}
            </div>

            {data.map((item) => {
              const percentage = Math.max(0, Math.min(100, (item.value / maxValue) * 100));

              return (
                <div key={item.id} className="relative" style={{ height: ROW_HEIGHT }}>
                  <div
                    className="relative z-10 h-5 truncate px-2 text-[11px] leading-5 text-gray-700"
                    title={item.label}
                  >
                    {item.label}
                  </div>
                  <div className="relative h-5 border-b border-gray-200">
                    <div
                      className="absolute inset-y-0 left-0 bg-blue-600 transition-[width] duration-300"
                      style={{ width: `${percentage}%` }}
                      title={`${item.label}: ${formatValue(item.value, valueType)}`}
                    />
                    <span
                      className="absolute top-1/2 z-10 -translate-y-1/2 whitespace-nowrap pl-2 text-[11px] text-gray-700"
                      style={{ left: `${percentage}%` }}
                    >
                      {formatValue(item.value, valueType)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="absolute bottom-0 left-0 right-14 flex justify-between border-t border-gray-300 pt-1 text-[11px] text-gray-500">
            {ticks.map((tick) => (
              <span
                key={tick}
                className="-translate-x-1/2 first:translate-x-0 last:translate-x-1/2"
              >
                {formatAxisValue(tick, valueType)}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex h-[350px] items-center justify-center">
          <Empty description="Chưa có dữ liệu" />
        </div>
      )}
    </div>
  );
};
