import React from "react";
import {
  ArrowPathRoundedSquareIcon,
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon,
  BanknotesIcon,
} from "@heroicons/react/24/outline";
import { formatMoney, formatPercentage, formatQuantity } from "@/shared/utils/number.util";
import { DashboardMetrics } from "../dashboard.model";

interface MetricsCardsProps {
  data?: DashboardMetrics;
  loading?: boolean;
}

const money = (value: number) => formatMoney(value) || "0";
const quantity = (value: number) => formatQuantity(value) || "0";
const percentage = (value: number) => formatPercentage(value) || "0%";

const separatorByIndex = [
  "border-t-0",
  "border-t sm:border-l sm:border-t-0",
  "border-t xl:border-l xl:border-t-0",
  "border-t sm:border-l sm:border-t-0 xl:border-t-0",
];

const CompactCard: React.FC<{
  label: string;
  value: string;
  details: React.ReactNode;
  index: number;
  loading?: boolean;
  icon?: React.ReactNode;
}> = ({ label, value, details, index, loading, icon }) => {
  const separatorClass = separatorByIndex[index] || "border-t";

  if (loading) {
    return (
      <div className={`flex gap-4 border-gray-200 pl-4 ${separatorClass}`}>
        {icon}
        <div className="flex min-h-[82px] flex-col gap-0.5">
          <span className="text-xs font-semibold text-gray-500">{label}</span>
          <div className="h-7 w-32 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-40 animate-pulse rounded bg-gray-100" />
          <div className="h-4 w-28 animate-pulse rounded bg-gray-100" />
        </div>
      </div>
    );
  }

  return (
    <div className={`flex gap-4 border-gray-200 pl-4 ${separatorClass}`}>
      {icon}
      <div className="flex min-h-[82px] flex-col gap-0.5">
        <span className="text-xs font-semibold text-gray-500">{label}</span>
        <span className="text-lg font-bold text-gray-800 dark:text-gray-200">{value}</span>
        <div className="text-xs space-y-0.5 text text-gray-500">{details}</div>
      </div>
    </div>
  );
};

const GrowthCard: React.FC<{
  value: number;
  description: string;
  index: number;
  loading?: boolean;
  icon?: React.ReactNode;
}> = ({ value, description, index, loading, icon }) => {
  const hasGrowth = value !== 0;
  const isPositive = value >= 0;
  const growthColor = isPositive ? "text-green-600" : "text-red-600";

  return (
    <CompactCard
      label="Doanh thu thuần"
      value={percentage(value)}
      index={index}
      loading={loading}
      icon={icon}
      details={
        <div className={`flex items-center gap-1 ${hasGrowth ? growthColor : ""}`}>
          {hasGrowth ? (
            isPositive ? (
              <ArrowTrendingUpIcon className="h-3.5 w-3.5" />
            ) : (
              <ArrowTrendingDownIcon className="h-3.5 w-3.5" />
            )
          ) : null}
          <span>{description}</span>
        </div>
      }
    />
  );
};

export const MetricsCards: React.FC<MetricsCardsProps> = ({ data, loading }) => {
  const metrics = data || {
    revenue: 0,
    revenueAfterTax: 0,
    salesOrderCount: 0,
    exchangeOrderCount: 0,
    returnedGoodsRevenue: 0,
    returnedRevenue: 0,
    returnOrderCount: 0,
    revenueGrowthYesterday: 0,
    revenueGrowthLastMonth: 0,
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <CompactCard
        label="Doanh thu"
        value={money(metrics.revenue)}
        index={0}
        loading={loading}
        icon={
          <div className="p-2 rounded-lg bg-primary/10 flex h-fit w-fit">
            <BanknotesIcon className="h-7 w-7 text-primary" />
          </div>
        }
        details={
          <>
            <div>Sau thuế: {money(metrics.revenueAfterTax)}</div>
            <div>
              {quantity(metrics.salesOrderCount)} hóa đơn{" "}
              {!!metrics.exchangeOrderCount && (
                <span>({quantity(metrics.exchangeOrderCount)} đơn trả có doanh thu)</span>
              )}
            </div>
          </>
        }
      />
      <CompactCard
        label="Trả hàng"
        value={money(metrics.returnedGoodsRevenue)}
        index={1}
        loading={loading}
        icon={
          <div className="p-2 rounded-lg bg-amber-600/10 flex h-fit w-fit">
            <ArrowPathRoundedSquareIcon className="h-8 w-8 text-amber-600" />
          </div>
        }
        details={
          <>
            <div>
              Sau thuế:{" "}
              <span className="font-semibold text-gray-700">{money(metrics.returnedRevenue)}</span>
            </div>
            <div>{quantity(metrics.returnOrderCount)} đơn trả hàng</div>
          </>
        }
      />
      <GrowthCard
        value={metrics.revenueGrowthYesterday}
        description="So với hôm qua"
        index={2}
        loading={loading}
        icon={
          <div
            className={`p-2 rounded-lg ${
              metrics.revenueGrowthYesterday >= 0 ? "bg-primary/10" : "bg-red-600/10"
            } flex h-fit w-fit`}
          >
            {metrics.revenueGrowthYesterday >= 0 ? (
              <ArrowTrendingUpIcon className="h-8 w-8 text-primary" />
            ) : (
              <ArrowTrendingDownIcon className="h-8 w-8 text-red-600" />
            )}
          </div>
        }
      />
      <GrowthCard
        value={metrics.revenueGrowthLastMonth}
        description="So với cùng kỳ tháng trước"
        index={3}
        loading={loading}
        icon={
          <div
            className={`p-2 rounded-lg ${
              metrics.revenueGrowthLastMonth >= 0 ? "bg-primary/10" : "bg-red-600/10"
            } flex h-fit w-fit`}
          >
            {metrics.revenueGrowthLastMonth >= 0 ? (
              <ArrowTrendingUpIcon className="h-8 w-8 text-primary" />
            ) : (
              <ArrowTrendingDownIcon className="h-8 w-8 text-red-600" />
            )}
          </div>
        }
      />
    </div>
  );
};
