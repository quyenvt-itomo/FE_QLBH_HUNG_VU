import { MenuProps } from "antd";
import { Link } from "react-router-dom";
import { privateRoutesName } from "@/shared/constants/routerName";
import { useGlobalData } from "@/shared/hooks/useGlobalData";
import { checkModule, checkPermission } from "@/shared/utils/permission.util";
import {
  AdjustmentsHorizontalIcon,
  ArrowsRightLeftIcon,
  BanknotesIcon,
  BuildingLibraryIcon,
  BuildingStorefrontIcon,
  ChartBarIcon,
  CubeIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  ShoppingCartIcon,
  TagIcon,
  TruckIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { Icon } from "@iconify/react";

type MenuItem = Required<MenuProps>["items"][number];
type Icon = React.ReactNode;

const item = (key: string, label: string, icon?: Icon): MenuItem => ({
  key,
  icon,
  label: <Link to={key}>{label}</Link>,
});

const subgroup = (key: string, label: string, icon: Icon, children: MenuItem[]): MenuItem | null =>
  children.length ? ({ key, type: "submenu", icon, label, children } as MenuItem) : null;

const group = (key: string, label: string, children: MenuItem[]): MenuItem | null =>
  children.length ? ({ key, type: "group", label, children } as MenuItem) : null;

const emptyItem = (key: string): MenuItem => ({ key, label: "Trống", disabled: true });

function extractPathsFromRouteObject(obj: any): string[] {
  const paths: string[] = [];
  const visit = (value: any) => {
    if (typeof value === "string") paths.push(value);
    else if (value && typeof value === "object") Object.values(value).forEach(visit);
  };
  visit(obj);
  return paths;
}

const isActivePath = (paths: string | string[]): boolean => {
  const current = window.location.pathname;
  if (paths === privateRoutesName.dashboard) return current === privateRoutesName.dashboard;
  return Array.isArray(paths)
    ? paths.some((path) => current.startsWith(path))
    : current.startsWith(paths);
};

export const SideBarMenuItems = (): MenuItem[] => {
  const { permissions } = useGlobalData();
  const can = (module: Parameters<typeof checkPermission>[1]) => checkModule(permissions, module);

  const overview = group(
    "overview",
    "Tổng quan",
    [
      item(
        privateRoutesName.dashboard,
        "Tổng quan",
        <Icon icon={"material-symbols:dashboard-outline-rounded"} />,
      ),
    ].filter(Boolean) as MenuItem[],
  );

  const orders = subgroup(
    "orders",
    "Đơn hàng",
    <DocumentTextIcon />,
    [
      can("sale") && item(privateRoutesName.sale, "Hóa đơn"),
      can("saleReturn") && item(privateRoutesName.saleReturn, "Trả hàng"),
    ].filter(Boolean) as MenuItem[],
  );

  const products = subgroup(
    "products",
    "Hàng hóa",
    <CubeIcon />,
    [
      can("product") && item(privateRoutesName.product, "Danh sách hàng hóa"),
      can("storeTransfer") && item(privateRoutesName.storeTransfer, "Chuyển kho"),
      can("inventoryAdjustment") && item(privateRoutesName.inventoryAdjustment, "Kiểm kho"),
      can("internalExport") && item(privateRoutesName.internalExport, "Xuất nội bộ"),
    ].filter(Boolean) as MenuItem[],
  );

  const purchases = subgroup(
    "purchases",
    "Mua hàng",
    <TruckIcon />,
    [
      can("supplier") && item(privateRoutesName.supplier, "Nhà cung cấp"),
      can("purchase") && item(privateRoutesName.purchase, "Nhập hàng"),
      can("purchaseReturn") && item(privateRoutesName.purchaseReturn, "Trả hàng nhập"),
    ].filter(Boolean) as MenuItem[],
  );

  const accounting = subgroup(
    "accounting",
    "Kế toán",
    <Icon icon={"material-symbols:account-balance-wallet-outline"} />,
    [
      can("fund") && item(privateRoutesName.fund, "Sổ quỹ"),
      can("fundTransfer") && item(privateRoutesName.fundTransfer, "Chuyển quỹ"),
      can("fundAdjustment") && item(privateRoutesName.fundAdjustment, "Điều chỉnh số dư"),
      can("debtAdjustment") && item(privateRoutesName.debtAdjustment, "Điều chỉnh công nợ"),
      can("vatAdjustment") && item(privateRoutesName.vatAdjustment, "Điều chỉnh VAT"),
    ].filter(Boolean) as MenuItem[],
  );

  const operations = group(
    "operations",
    "Nghiệp vụ",
    [
      orders,
      products,
      purchases,
      can("customer") &&
        item(privateRoutesName.customer, "Khách hàng", <Icon icon={"lucide:users"} />),
      accounting,
    ].filter(Boolean) as MenuItem[],
  );

  const analysisAndReports = group("analysis-reports", "Phân tích & báo cáo", [
    {
      key: "analysis",
      type: "submenu",
      label: "Phân tích",
      icon: <Icon icon={"solar:chart-bold"} />,
      children: [emptyItem("analysis-empty")],
    } as MenuItem,
    {
      key: "reports",
      type: "submenu",
      label: "Báo cáo",
      icon: <Icon icon={"solar:pie-chart-outline"} />,
      children: [emptyItem("reports-empty")],
    } as MenuItem,
  ]);

  const setup = subgroup(
    "setup",
    "Thiết lập",
    <Icon icon={"material-symbols:rule-settings-rounded"} />,
    [
      can("store") && item(privateRoutesName.setup.store, "Cửa hàng"),
      can("attribute") && item(privateRoutesName.setup.attribute, "Danh mục"),
      can("shipper") && item(privateRoutesName.setup.shipper, "Đơn vị vận chuyển"),
      can("user") && item(privateRoutesName.setup.user, "Người dùng"),
      can("role") && item(privateRoutesName.setup.role, "Vai trò hệ thống"),
    ].filter(Boolean) as MenuItem[],
  );

  const extensions = group("extensions", "Mở rộng", [setup].filter(Boolean) as MenuItem[]);

  return [overview, operations, analysisAndReports, extensions].filter(Boolean) as MenuItem[];
};
