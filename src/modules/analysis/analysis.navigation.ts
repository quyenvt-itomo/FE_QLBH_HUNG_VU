import { privateRoutesName } from "@/shared/constants";

export type AnalysisSection = "sale" | "product" | "customer" | "effectiveness";

export interface AnalysisTab {
  key: string;
  label: string;
}

export interface AnalysisTabGroup {
  key: AnalysisSection;
  label: string;
  icon: string;
  path: string;
  tabs: AnalysisTab[];
}

export const analysisTabGroups: AnalysisTabGroup[] = [
  {
    key: "sale",
    label: "Kinh doanh",
    icon: "ri:shake-hands-line",
    path: privateRoutesName.analysis.sale,
    tabs: [
      { key: "overview", label: "Tổng quan" },
      { key: "profit", label: "Chi phí - Lợi nhuận" },
    ],
  },
  {
    key: "product",
    label: "Hàng hóa",
    icon: "akar-icons:shipping-box-v2",
    path: privateRoutesName.analysis.product,
    tabs: [
      { key: "overview", label: "Tổng quan" },
      { key: "inventory", label: "Tồn kho" },
      { key: "classification", label: "Phân loại hàng hóa" },
    ],
  },
  {
    key: "customer",
    label: "Khách hàng",
    icon: "material-symbols:person-outline",
    path: privateRoutesName.analysis.customer,
    tabs: [
      { key: "overview", label: "Tổng quan" },
      { key: "classification", label: "Phân loại khách hàng" },
    ],
  },
  {
    key: "effectiveness",
    label: "Hiệu quả",
    icon: "boxicons:chart-line",
    path: privateRoutesName.analysis.effectiveness,
    tabs: [{ key: "receivable", label: "Công nợ khách hàng" }],
  },
];
