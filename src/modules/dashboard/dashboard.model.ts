export enum DashboardTimeView {
  YESTERDAY = "yesterday",
  TODAY = "today",
  LAST_7_DAYS = "last7Days",
  THIS_MONTH = "thisMonth",
  LAST_MONTH = "lastMonth",
}

export enum DashboardTypeView {
  DAY = "day",
  HOUR = "hour",
  WEEKDAY = "weekday",
}

export enum DashboardTypeCal {
  BEFORE_TAX = "beforeTax",
  AFTER_TAX = "afterTax",
}

export enum DashboardProductTypeCal {
  REVENUE = "revenue",
  QUANTITY = "quantity",
}

export type DashboardChartType = "bar" | "pie";

export interface DashboardMetrics {
  revenue: number;
  revenueAfterTax: number;
  salesOrderCount: number;
  exchangeOrderCount: number;
  returnedGoodsRevenue: number;
  returnedRevenue: number;
  returnOrderCount: number;
  revenueGrowthYesterday: number;
  revenueGrowthLastMonth: number;
}

export interface DashboardBranchData {
  label: string;
  value: number;
}

export interface DashboardRevenueBranch {
  branch: string;
  data: DashboardBranchData[];
}

export interface DashboardTopProduct {
  productId: string;
  productName: string;
  quantity: number;
  revenue: number;
}

export interface DashboardTopCustomer {
  customerId: string;
  customerName: string;
  orderCount: number;
  revenue: number;
}

export interface DashboardTimeOption {
  value: DashboardTimeView;
  label: string;
}

export const dashboardTimeOptions: DashboardTimeOption[] = [
  { value: DashboardTimeView.YESTERDAY, label: "Hôm qua" },
  { value: DashboardTimeView.TODAY, label: "Hôm nay" },
  { value: DashboardTimeView.LAST_7_DAYS, label: "7 ngày qua" },
  { value: DashboardTimeView.THIS_MONTH, label: "Tháng này" },
  { value: DashboardTimeView.LAST_MONTH, label: "Tháng trước" },
];

export const getDashboardDefaultTimeView = (): DashboardTimeView =>
  new Date().getDate() >= 20
    ? DashboardTimeView.THIS_MONTH
    : DashboardTimeView.LAST_MONTH;
