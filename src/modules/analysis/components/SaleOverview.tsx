import React, { useMemo, useState } from "react";
import { Empty, Spin, Table, TableProps, Tabs } from "antd";
import ReactApexChart from "react-apexcharts";
import {
  formatMoney,
  formatPercentage,
  formatQuantity,
  formatShortMoney,
} from "@/shared/utils/number.util";
import {
  AnalysisBranchRow,
  AnalysisQuery,
  AnalysisSortBy,
  AnalysisTopRow,
  SaleBusinessIndicatorData,
  SaleOverviewMetricsData,
} from "../analysis.model";
import { AnalysisFilterProps, AnalysisViewHeader } from "./AnalysisToolbar";
import { AnalysisMetricCardsSkeleton } from "./AnalysisSkeletons";
import {
  useAnalysisSaleBusinessIndicatorStore,
  useAnalysisSaleOverviewMetricsStore,
  useAnalysisSaleTopCustomerGroupsStore,
  useAnalysisSaleTopProductGroupsStore,
  useAnalysisSaleTopProductsStore,
} from "../analysis.store";

const metricLabels: [keyof SaleOverviewMetricsData["metrics"], string][] = [
  ["invoiceCount", "Số hóa đơn"],
  ["revenue", "Doanh thu"],
  ["paymentValue", "Giá trị thanh toán"],
  ["netRevenue", "Doanh thu thuần"],
  ["totalCost", "Tổng giá vốn"],
  ["grossProfit", "Lợi nhuận gộp"],
];

const sortLabels: Record<AnalysisSortBy, string> = {
  revenue: "Doanh thu",
  returns: "Trả hàng",
  netRevenue: "Doanh thu thuần",
  grossProfit: "Lợi nhuận gộp",
  invoiceCount: "Số hóa đơn",
};

const SaleOverviewMetrics: React.FC<{ query: AnalysisQuery }> = ({ query }) => {
  const request = useAnalysisSaleOverviewMetricsStore(query);

  if (request.loading || !request.data) {
    return <AnalysisMetricCardsSkeleton count={metricLabels.length} />;
  }
  const data = request.data;

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
      {metricLabels.map(([key, label]) => {
        const metric = data.metrics[key];
        const isCount = key === "invoiceCount";

        return (
          <div key={key} className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="text-sm text-slate-600">{label}</div>
            <div className="mt-1 text-2xl font-bold text-slate-900">
              {isCount ? formatQuantity(metric.value) || "0" : formatShortMoney(metric.value)}
            </div>
            <div className="mt-4 flex justify-between gap-4 text-xs text-slate-500">
              <span>
                Trung bình/ngày
                <br />
                <strong className="text-slate-900">
                  {isCount
                    ? metric.averagePerDay.toFixed(1)
                    : formatMoney(metric.averagePerDay) || "0"}
                </strong>
              </span>
              <span>
                So với kỳ trước
                <br />
                <strong className={metric.growth >= 0 ? "text-green-600" : "text-red-500"}>
                  {metric.growth >= 0 ? "+" : ""}
                  {metric.growth.toFixed(2)}%
                </strong>
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const BusinessIndicatorLoading: React.FC = () => (
  <section className="rounded-xl bg-white p-4 shadow-sm">
    <div className="flex h-[420px] items-center justify-center">
      <Spin size="large" tip="Đang tải chỉ số kinh doanh..." />
    </div>
  </section>
);

const BranchTable: React.FC<{ data: AnalysisBranchRow[]; loading: boolean }> = ({
  data,
  loading,
}) => (
  <Table
    size="small"
    rowKey="branch"
    loading={loading}
    pagination={false}
    dataSource={data}
    columns={[
      { title: "Chi nhánh", dataIndex: "branch" },
      {
        title: "Doanh thu",
        dataIndex: "revenue",
        align: "right",
        render: (value: number) => formatMoney(value) || "0",
      },
      {
        title: "Trả hàng",
        dataIndex: "returns",
        align: "right",
        render: (value: number) => formatMoney(value) || "0",
      },
      {
        title: "Doanh thu thuần",
        dataIndex: "netRevenue",
        align: "right",
        render: (value: number) => formatMoney(value) || "0",
      },
      {
        title: "Tổng giá vốn",
        dataIndex: "totalCost",
        align: "right",
        render: (value: number) => formatMoney(value) || "0",
      },
      {
        title: "Lợi nhuận gộp",
        dataIndex: "grossProfit",
        align: "right",
        render: (value: number) => formatMoney(value) || "0",
      },
    ]}
  />
);

const BusinessIndicator: React.FC<{ query: AnalysisQuery }> = ({ query }) => {
  const request = useAnalysisSaleBusinessIndicatorStore(query);

  if (!request.data) return <BusinessIndicatorLoading />;

  const { businessIndicator } = request.data as SaleBusinessIndicatorData;
  const chartSeries = businessIndicator.series.map((item) => ({
    name: sortLabels[item.name as AnalysisSortBy] || item.name,
    data: item.data,
  }));

  return (
    <section className="rounded-xl bg-white p-4 shadow-sm">
      <h2 className="mb-2 text-base font-semibold text-slate-900">Chỉ số kinh doanh</h2>
      <Spin spinning={request.fetching} tip="Đang tải chỉ số kinh doanh...">
        <ReactApexChart
          options={{
            chart: { toolbar: { show: false }, zoom: { enabled: false } },
            stroke: { curve: "straight", width: 2 },
            dataLabels: { enabled: false },
            xaxis: {
              categories: businessIndicator.labels,
              labels: { hideOverlappingLabels: true },
            },
            yaxis: { labels: { formatter: (value: number) => formatShortMoney(value) } },
            tooltip: { y: { formatter: (value: number) => formatMoney(value) || "0" } },
            legend: { position: "bottom" },
          }}
          series={chartSeries}
          type="line"
          height={340}
        />
      </Spin>
      <div className="mt-4">
        <h3 className="mb-3 text-base font-semibold text-slate-900">Chi nhánh</h3>
        <BranchTable data={request.data.branches} loading={request.fetching} />
      </div>
    </section>
  );
};

const TopTable: React.FC<{
  title: string;
  data?: AnalysisTopRow[];
  loading: boolean;
  sortBy: AnalysisSortBy;
}> = ({ title, data, loading, sortBy }) => {
  if (!data) {
    return (
      <section className="rounded-xl bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-base font-semibold">{title}</h2>
        <div className="flex h-48 items-center justify-center">
          <Spin tip="Đang tải dữ liệu..." />
        </div>
      </section>
    );
  }

  const columns = useMemo((): TableProps<AnalysisTopRow>["columns"] => {
    const baseColumns: TableProps<AnalysisTopRow>["columns"] = [
      { title: "Tên", dataIndex: "name" },
    ];

    switch (sortBy) {
      case "returns":
        baseColumns.push(
          {
            title: "SL trả",
            dataIndex: "returnQuantity",
            align: "right",
            width: 140,
            render: (value: number) => value.toLocaleString("vi-VN"),
          },
          {
            title: "Giá trị trả",
            dataIndex: "returns",
            align: "right",
            width: 140,
            render: (value: number) => formatMoney(value) || "0",
          },
          {
            title: "Tỷ lệ trả",
            dataIndex: "returnRatio",
            align: "right",
            width: 140,
            render: (value: number) => formatPercentage(value) || "0%",
          },
        );
        break;
      case "invoiceCount":
        baseColumns.push({
          title: "Số hóa đơn",
          dataIndex: "invoiceCount",
          align: "right",
          width: 140,
          render: (value: number) => value.toLocaleString("vi-VN"),
        });
        break;
      case "grossProfit":
        baseColumns.push(
          {
            title: "Lợi nhuận gộp",
            dataIndex: "grossProfit",
            align: "right",
            width: 140,
            render: (value: number) => formatMoney(value) || "0",
          },
          {
            title: "TB/đơn",
            dataIndex: "averageOrder",
            align: "right",
            width: 140,
            render: (value: number) => formatMoney(value) || "0",
          },
          {
            title: "Tỷ suất",
            dataIndex: "margin",
            align: "right",
            width: 140,
            render: (value: number) => formatPercentage(value) || "0%",
          },
        );
        break;
      default:
        baseColumns.push(
          {
            title: sortLabels[sortBy],
            dataIndex: sortBy === "netRevenue" ? "netRevenue" : "revenue",
            align: "right",
            width: 140,
            render: (value: number) => formatMoney(value) || "0",
          },
          {
            title: "TB/đơn",
            dataIndex: "averageOrder",
            align: "right",
            width: 140,
            render: (value: number) => formatMoney(value) || "0",
          },
        );
    }

    baseColumns.push({
      title: "So với kỳ trước",
      dataIndex: "growth",
      key: "growth",
      align: "right",
      width: 140,
      render: (value: number) => (
        <span className={value >= 0 ? "text-green-600" : "text-red-500"}>
          {value >= 0 ? "+" : ""}
          {value.toFixed(2)}%
        </span>
      ),
    });

    return baseColumns;
  }, [sortBy]);

  return (
    <section className="rounded-xl bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-semibold">{title}</h2>
        <span className="text-xs text-slate-500">Theo {sortLabels[sortBy].toLowerCase()}</span>
      </div>
      <Table
        size="small"
        rowKey="id"
        loading={loading}
        dataSource={data}
        pagination={false}
        locale={{
          emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Chưa có dữ liệu" />,
        }}
        columns={columns}
      />
    </section>
  );
};

const TopProductGroups: React.FC<{ query: AnalysisQuery; sortBy: AnalysisSortBy }> = ({
  query,
  sortBy,
}) => {
  const request = useAnalysisSaleTopProductGroupsStore({ ...query, sortBy });
  return (
    <TopTable
      title="Top 10 nhóm hàng"
      data={request.data?.rows}
      loading={request.loading}
      sortBy={sortBy}
    />
  );
};

const TopProducts: React.FC<{ query: AnalysisQuery; sortBy: AnalysisSortBy }> = ({
  query,
  sortBy,
}) => {
  const request = useAnalysisSaleTopProductsStore({ ...query, sortBy });
  return (
    <TopTable
      title="Top 10 hàng hóa"
      data={request.data?.rows}
      loading={request.loading}
      sortBy={sortBy}
    />
  );
};

const TopCustomerGroups: React.FC<{ query: AnalysisQuery; sortBy: AnalysisSortBy }> = ({
  query,
  sortBy,
}) => {
  const request = useAnalysisSaleTopCustomerGroupsStore({ ...query, sortBy });
  return (
    <TopTable
      title="Top 10 nhóm khách hàng"
      data={request.data?.rows}
      loading={request.loading}
      sortBy={sortBy}
    />
  );
};

export const SaleOverview: React.FC<AnalysisFilterProps & { query: AnalysisQuery }> = ({
  query,
  ...filters
}) => {
  const [sortBy, setSortBy] = useState<AnalysisSortBy>("revenue");

  return (
    <div className="space-y-4">
      <AnalysisViewHeader title="Tổng quan kinh doanh" {...filters} />
      <SaleOverviewMetrics query={query} />
      <BusinessIndicator query={query} />
      <div className="flex flex-col pt-1">
        <span className="text-base font-semibold">Phân tích theo</span>
        <Tabs
          className="custom-tabs"
          activeKey={sortBy}
          items={Object.entries(sortLabels).map(([key, label]) => ({ key, label }))}
          onChange={(key) => setSortBy(key as AnalysisSortBy)}
        />
      </div>
      <div className="space-y-4">
        <TopProductGroups query={query} sortBy={sortBy} />
        <TopProducts query={query} sortBy={sortBy} />
        <TopCustomerGroups query={query} sortBy={sortBy} />
      </div>
    </div>
  );
};
