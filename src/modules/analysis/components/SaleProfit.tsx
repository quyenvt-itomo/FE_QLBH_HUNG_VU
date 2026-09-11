import React from "react";
import { Spin, Table } from "antd";
import { formatMoney, formatPercentage, formatShortMoney } from "@/shared/utils/number.util";
import { AnalysisQuery, SaleProfitMetricsData } from "../analysis.model";
import {
  useAnalysisSaleProfitCostStructureStore,
  useAnalysisSaleProfitEffectivenessStore,
  useAnalysisSaleProfitMetricsStore,
} from "../analysis.store";
import { AnalysisFilterProps, AnalysisViewHeader } from "./AnalysisToolbar";
import { AnalysisMetricCardsSkeleton } from "./AnalysisSkeletons";

const metricLabels: Record<keyof SaleProfitMetricsData["metrics"], string> = {
  netRevenue: "Doanh thu thuần",
  grossProfit: "Lợi nhuận gộp",
  totalCost: "Tổng chi phí",
  otherIncome: "Thu nhập khác",
  netProfit: "Lợi nhuận ròng",
  averageCostPerDay: "Chi phí TB/ngày",
  costRevenueRatio: "% chi phí/doanh thu",
};

type BranchDataItem = { branch: string; value: number };
type BranchDataRow = { branchData?: BranchDataItem[] };

const getBranchColumns = <T extends BranchDataRow>(rows: T[]) => {
  const branches = Array.from(
    new Set(rows.flatMap((row) => row.branchData?.map((item) => item.branch) ?? [])),
  );

  return branches.map((branch) => ({
    title: branch,
    key: `branch-${branch}`,
    width: 140,
    align: "right" as const,
    render: (_value: unknown, row: T) =>
      formatMoney(row.branchData?.find((item) => item.branch === branch)?.value) || "0",
  }));
};

const ProfitMetrics: React.FC<{ query: AnalysisQuery }> = ({ query }) => {
  const request = useAnalysisSaleProfitMetricsStore(query);

  if (request.loading || !request.data) {
    return (
      <AnalysisMetricCardsSkeleton
        count={Object.keys(metricLabels).length}
        columns="xl:grid-cols-4"
      />
    );
  }
  const data = request.data;

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
      {Object.entries(metricLabels).map(([key, label]) => {
        const metric = data.metrics[key as keyof typeof data.metrics];
        const isRatio = key === "costRevenueRatio";

        return (
          <div key={key} className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="text-xs font-semibold text-slate-600">{label}</div>
            <div className="mt-1 text-xl font-bold text-slate-900">
              {isRatio
                ? formatPercentage(metric.value) || "0%"
                : formatShortMoney(metric.value) || "0"}
            </div>
            <div
              className={
                metric.growth >= 0 ? "mt-1 text-xs text-green-600" : "mt-1 text-xs text-red-500"
              }
            >
              {metric.growth >= 0 ? "+" : ""}
              {metric.growth.toFixed(2)}% so với kỳ trước
            </div>
          </div>
        );
      })}
    </div>
  );
};

const CostStructure: React.FC<{ query: AnalysisQuery }> = ({ query }) => {
  const request = useAnalysisSaleProfitCostStructureStore(query);

  return (
    <section className="rounded-xl bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-base font-semibold">Cơ cấu chi phí</h2>
      {!request.data ? (
        <div className="flex h-48 items-center justify-center">
          <Spin tip="Đang tải cơ cấu chi phí..." />
        </div>
      ) : (
        <Table
          size="small"
          rowKey="name"
          loading={request.fetching}
          pagination={false}
          scroll={{ x: "max-content" }}
          dataSource={request.data.costStructure}
          columns={[
            { title: "Danh mục", dataIndex: "name", key: "name" },
            ...getBranchColumns(request.data.costStructure),
            {
              title: "Tổng",
              dataIndex: "total",
              key: "total",
              align: "right",
              render: (value: number) => formatMoney(value) || "0",
            },
            {
              title: "% chi phí / doanh thu",
              dataIndex: "percent",
              key: "percent",
              align: "right",
              render: (value: number) => formatPercentage(value) || "0%",
            },
          ]}
        />
      )}
    </section>
  );
};

const Effectiveness: React.FC<{ query: AnalysisQuery }> = ({ query }) => {
  const request = useAnalysisSaleProfitEffectivenessStore(query);

  return (
    <section className="rounded-xl bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-base font-semibold">Chi tiết hiệu quả</h2>
      {!request.data ? (
        <div className="flex h-48 items-center justify-center">
          <Spin tip="Đang tải chi tiết hiệu quả..." />
        </div>
      ) : (
        <Table
          size="small"
          rowKey="key"
          loading={request.fetching}
          pagination={false}
          scroll={{ x: "max-content" }}
          dataSource={request.data.effectiveness}
          columns={[
            { title: "Khoản mục", dataIndex: "name", key: "name" },
            ...getBranchColumns(request.data.effectiveness),
            {
              title: "Tổng",
              dataIndex: "total",
              key: "total",
              align: "right",
              render: (value: number) => formatMoney(value) || "0",
            },
          ]}
        />
      )}
    </section>
  );
};

export const SaleProfit: React.FC<AnalysisFilterProps & { query: AnalysisQuery }> = ({
  query,
  ...filters
}) => (
  <div className="space-y-4">
    <AnalysisViewHeader title="Chi phí - Lợi nhuận" {...filters} />
    <ProfitMetrics query={query} />
    <div className="flex flex-col gap-4">
      <CostStructure query={query} />
      <Effectiveness query={query} />
    </div>
  </div>
);
