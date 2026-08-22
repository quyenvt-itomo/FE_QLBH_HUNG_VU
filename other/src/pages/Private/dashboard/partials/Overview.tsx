import ReactApexChart from "react-apexcharts";
import { PartialProps } from "..";
import { DashboardOverviewData, TopProduct } from "../../../../models/dashboard";
import { StatsCard } from "../components/StatsCard";
import { Icon } from "@iconify/react";
import Title from "../../../../components/display/Title";
import { useEffect, useState } from "react";
import { ApexOptions } from "apexcharts";
import { formatMoney, formatQuantity, formatShortMoney } from "../../../../utils/formatNumber";
import { Progress, Table, TableProps } from "antd";
import dayjs from "dayjs";
import { OrderSnapshot } from "../../../../models/store/order";
import { CLASSNAME } from "../../../../constants/UI";
import ProductImage from "../../../../components/image/ProductImage";
import { getMainImage } from "../../../../utils/fileUtil";
import { useNavigate } from "react-router-dom";
import { buildUrlWithId } from "../../../../utils/paramUtils";
import { privateRoutesName } from "../../../../constants/routerName";

/* ================= PIE ================= */
const getPieOptions = (): ApexOptions => ({
  chart: {
    width: 224,
    type: "pie",
  },
  labels: ["Tổng thu", "Tổng chi"],
  colors: ["#3b82f6", "#ef4444"],
  tooltip: {
    y: {
      formatter: (value: number) => formatMoney(value),
    },
  },
  legend: {
    position: "bottom",
    horizontalAlign: "center",
  },
});

/* ================= LINE ================= */
const getLineOptions = (categories: string[]): ApexOptions => ({
  chart: {
    type: "line",
    toolbar: { show: false },
  },

  stroke: {
    curve: "straight",
    width: [3, 3, 2, 2], // năm nay đậm hơn
    dashArray: [0, 0, 6, 6], // năm ngoái nét đứt
  },

  /** 👇 MÀU THEO SERIES ORDER */
  colors: [
    "#3b82f6", // Doanh thu (năm nay)
    "#22c55e", // Số đơn (năm nay)
    "#3b82f6", // Doanh thu (năm ngoái)
    "#22c55e", // Số đơn (năm ngoái)
  ],

  fill: {
    opacity: [1, 1, 0.3, 0.3], // năm ngoái mờ
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

  yaxis: [
    {
      labels: { formatter: (v) => formatShortMoney(v) },
    },
    {
      opposite: true,
      labels: { formatter: (v) => Math.round(v).toString() },
    },
  ],

  legend: {
    position: "top",
    horizontalAlign: "right",

    /** 👇 CHỈ HIỆN 2 Ý NGHĨA CHÍNH */
    customLegendItems: ["Doanh thu", "Số đơn"],
    markers: {
      fillColors: ["#3b82f6", "#22c55e"],
    },
  },

  tooltip: {
    shared: true,
    y: {
      formatter: (v, { seriesIndex }) =>
        seriesIndex === 0 || seriesIndex === 2
          ? formatMoney(v) || "0"
          : `${formatQuantity(v) || "0"} đơn`,
    },
  },
});

/* ================= COMPONENT ================= */
export const Overview: React.FC<PartialProps<DashboardOverviewData>> = ({ data, loading }) => {
  const [lineState, setLineState] = useState<{
    series: ApexAxisChartSeries;
    options: ApexOptions;
  }>({
    series: [],
    options: getLineOptions([]),
  });

  const [pieState, setPieState] = useState<{
    series: number[];
    options: ApexOptions;
  }>({
    series: [],
    options: getPieOptions(),
  });
  const navigate = useNavigate();

  const {
    metrics,
    revenueByDate = [],
    revenueByDateLastYear = [],
    incomeByAttribute,
    expenseByAttribute,
    totalExpense,
    totalIncome,
    recentOrders,
    topProducts,
  } = data || {};

  useEffect(() => {
    const today = dayjs().startOf("day");

    // const categories = revenueByDate.map((i) => i.date);
    const categories = revenueByDate.map((i) => {
      const date = dayjs(i.date, "DD/MM/YYYY");
      return date.format("DD/MM");
    });

    const revenueThisYear = revenueByDate.map((i) =>
      dayjs(i.date, "DD/MM/YYYY").isAfter(today) ? null : i.revenue,
    );

    const ordersThisYear = revenueByDate.map((i) =>
      dayjs(i.date, "DD/MM/YYYY").isAfter(today) ? null : i.orders,
    );

    const series: ApexAxisChartSeries = [
      {
        name: "Doanh thu",
        data: revenueThisYear,
      },
      {
        name: "Số đơn",
        data: ordersThisYear,
      },
      {
        name: "Doanh thu năm ngoái",
        data: revenueByDateLastYear.map((i) => i.revenue),
      },
      {
        name: "Số đơn năm ngoái",
        data: revenueByDateLastYear.map((i) => i.orders),
      },
    ];

    setLineState({
      series,
      options: getLineOptions(categories),
    });

    setPieState({
      series: [totalIncome || 0, totalExpense || 0],
      options: getPieOptions(),
    });
  }, [data]);

  const handleProductClick = (record: TopProduct) => {
    const url = buildUrlWithId(privateRoutesName.product.report, record.id);
    navigate(url);
  };

  const orderColumns: TableProps<OrderSnapshot>["columns"] = [
    {
      title: "Khách hàng",
      dataIndex: ["partnerSnapshot", "name"],
      key: "partnerName",
      render: (name: string) => <span className="text-xs font-medium">{name}</span>,
    },
    {
      title: "Số đơn",
      dataIndex: "code",
      key: "code",
      render: (code: string) => <span className="text-xs">{code}</span>,
    },
    {
      title: "Ngày",
      dataIndex: "orderAt",
      key: "orderAt",
      width: 100,
      render: (orderAt: string) => (
        <div className="flex flex-col">
          <span className="text-xs">{dayjs(orderAt).format("HH:mm")}</span>
          <span className="text-xs text-gray-400">{dayjs(orderAt).format("DD/MM/YYYY")}</span>
        </div>
      ),
    },
    {
      title: "Tổng tiền",
      dataIndex: "netAmount",
      key: "netAmount",
      align: "right",
      // render: (value: number) => formatMoney(value),
      render: (value: number) => (
        <span className="text-xs font-medium text-blue-500">{formatMoney(value)}</span>
      ),
    },
  ];

  const productColumns: TableProps<TopProduct>["columns"] = [
    {
      title: "Sản phẩm",
      dataIndex: "name",
      key: "name",
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <ProductImage size={24} image={getMainImage(record.album || [])} />
          <div className="flex-1 flex flex-col">
            <span className="text-xs block truncate font-medium">{record?.name}</span>
            <span className="text-[10px] text-gray-500">Mã: {record.code}</span>
          </div>
        </div>
      ),
    },
    {
      title: "Doanh thu",
      dataIndex: "revenue",
      key: "revenue",
      align: "right",
      render: (value: number) => formatMoney(value),
    },
    {
      title: "Số lượng bán",
      dataIndex: "quantity",
      key: "quantity",
      align: "right",
      render: (value: number) => formatQuantity(value),
    },
  ];

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* ===== STATS ===== */}
      <div className="grid grid-cols-5 gap-4">
        <StatsCard
          label="Tổng doanh thu bán hàng"
          value={metrics?.totalRevenue || 0}
          type="money"
          growth={metrics?.revenueGrowth}
          loading={loading}
          icon={
            <div className="h-8 w-8 flex items-center justify-center rounded-full bg-slate-50 text-blue-500">
              <Icon icon="material-symbols-light:attach-money-rounded" width="24" height="24" />
            </div>
          }
        />
        <StatsCard
          label="Tổng đơn hàng"
          value={metrics?.totalOrders || 0}
          growth={metrics?.orderGrowth}
          loading={loading}
          icon={
            <div className="h-8 w-8 flex items-center justify-center rounded-full bg-slate-50 text-blue-500">
              <Icon icon="material-symbols-light:shopping-cart-outline" width="24" height="24" />
            </div>
          }
        />
        <StatsCard
          label="Tổng sản phẩm bán ra"
          value={metrics?.totalProductsSold || 0}
          growth={metrics?.productsSoldGrowth}
          loading={loading}
          icon={
            <div className="h-8 w-8 flex items-center justify-center rounded-full bg-slate-50 text-blue-500">
              <Icon icon="material-symbols-light:box-outline-rounded" width="24" height="24" />
            </div>
          }
        />
        <StatsCard
          label="Tổng đơn hoàn"
          value={metrics?.totalReturnOrders || 0}
          growth={metrics?.returnOrderGrowth}
          loading={loading}
          warning
        />
        <StatsCard
          label="Tổng giá trị đơn hoàn"
          value={metrics?.totalReturnValue || 0}
          type="money"
          growth={metrics?.returnValueGrowth}
          loading={loading}
          warning
        />
      </div>

      {/* ===== CHARTS ===== */}
      <div className="flex gap-4">
        <div className="flex flex-col justify-between flex-1 shadow-sm bg-white rounded-lg p-4 pt-2">
          <Title content="Doanh thu & số đơn theo ngày" level={5} />
          <ReactApexChart
            options={lineState.options}
            series={lineState.series}
            type="line"
            height={320}
          />
        </div>

        <div className="w-80 shadow-sm bg-white rounded-lg p-4 pt-2 flex flex-col">
          <Title content="Tỷ trọng thu chi" level={5} />
          <div className="flex flex-col items-center">
            <ReactApexChart
              options={pieState.options}
              series={pieState.series}
              type="pie"
              width={224}
            />
          </div>

          <hr className="my-4" />

          <div className="flex flex-col gap-2">
            {incomeByAttribute?.map((item) => (
              <div key={item.id} className="flex flex-col">
                <span className="text-xs text-gray-500">{item.name}</span>
                <Progress
                  percent={totalIncome ? Math.round((item.amount / totalIncome) * 10000) / 100 : 0}
                  size="small"
                  strokeColor="#3b82f6"
                  showInfo={false}
                />
              </div>
            ))}
            {expenseByAttribute?.map((item) => (
              <div key={item.id} className="flex flex-col">
                <span className="text-xs text-gray-500">{item.name}</span>
                <Progress
                  percent={
                    totalExpense ? Math.round((item.amount / totalExpense) * 10000) / 100 : 0
                  }
                  size="small"
                  strokeColor="#ef4444"
                  showInfo={false}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== TABLES ===== */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col justify-between flex-1 shadow-sm bg-white rounded-lg p-4 pt-2 gap-4">
          <Title content="Đơn hàng gần nhất" level={5} />

          <Table
            columns={orderColumns}
            dataSource={recentOrders}
            loading={loading}
            pagination={false}
            rowKey="id"
            className={CLASSNAME.table + " dashboard-table"}
          />
        </div>
        <div className="flex flex-col justify-between flex-1 shadow-sm bg-white rounded-lg p-4 pt-2 gap-4">
          <Title content="Sản phẩm doanh thu cao" level={5} />

          <div className="flex flex-col h-[calc(100%-28px)]">
            <Table
              columns={productColumns}
              dataSource={topProducts}
              loading={loading}
              pagination={false}
              rowKey="id"
              className={CLASSNAME.table + " dashboard-table"}
              onRow={(record) => {
                return {
                  className: "cursor-pointer",
                  onClick: () => handleProductClick(record),
                };
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
