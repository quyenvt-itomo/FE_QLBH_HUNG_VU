import { MenuProps } from "antd";
import { Link } from "react-router-dom";
import { privateRoutesName } from "@/shared/constants/routerName";
import { useGlobalData } from "@/shared/hooks/useGlobalData";
import { checkPermission } from "@/shared/utils/permission.util";
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

type MenuItem = Required<MenuProps>["items"][number];
type Icon = React.ReactNode;

const item = (key: string, label: string, icon: Icon): MenuItem => ({
  key,
  icon,
  label: <Link to={key}>{label}</Link>,
});

const subgroup = (key: string, label: string, children: MenuItem[]): MenuItem | null =>
  children.length ? ({ key, type: "submenu", label, children } as MenuItem) : null;

const group = (key: string, label: string, children: MenuItem[]): MenuItem | null =>
  children.length ? ({ key, type: "group", label, children } as MenuItem) : null;

const emptyItem = (key: string): MenuItem => ({ key, label: "Trống", disabled: true });

export function extractPathsFromRouteObject(obj: any): string[] {
  const paths: string[] = [];
  const visit = (value: any) => {
    if (typeof value === "string") paths.push(value);
    else if (value && typeof value === "object") Object.values(value).forEach(visit);
  };
  visit(obj);
  return paths;
}

export const isActivePath = (paths: string | string[]): boolean => {
  const current = window.location.pathname;
  if (paths === privateRoutesName.dashboard) return current === privateRoutesName.dashboard;
  return Array.isArray(paths)
    ? paths.some((path) => current.startsWith(path))
    : current.startsWith(paths);
};

export const SideBarMenuItems = (): MenuItem[] => {
  const { permissions } = useGlobalData();
  const can = (module: Parameters<typeof checkPermission>[1]) =>
    checkPermission(permissions, module, "read");

  const overview = group(
    "overview",
    "Tổng quan",
    [item(privateRoutesName.dashboard, "Tổng quan", <ChartBarIcon />)].filter(
      Boolean,
    ) as MenuItem[],
  );

  const orders = subgroup(
    "orders",
    "Đơn hàng",
    [
      can("sale") && item(privateRoutesName.sale, "Hóa đơn", <DocumentTextIcon />),
      can("saleReturn") && item(privateRoutesName.saleReturn, "Trả hàng", <ArrowsRightLeftIcon />),
    ].filter(Boolean) as MenuItem[],
  );

  const products = subgroup(
    "products",
    "Hàng hóa",
    [
      can("product") && item(privateRoutesName.product, "Danh sách hàng hóa", <CubeIcon />),
      can("storeTransfer") &&
        item(privateRoutesName.storeTransfer, "Chuyển kho", <ArrowsRightLeftIcon />),
      can("inventoryAdjustment") &&
        item(privateRoutesName.inventoryAdjustment, "Kiểm kho", <AdjustmentsHorizontalIcon />),
      can("internalExport") && item(privateRoutesName.internalExport, "Xuất nội bộ", <TruckIcon />),
    ].filter(Boolean) as MenuItem[],
  );

  const purchases = subgroup(
    "purchases",
    "Mua hàng",
    [
      can("supplier") && item(privateRoutesName.supplier, "Nhà cung cấp", <TruckIcon />),
      can("purchase") && item(privateRoutesName.purchase, "Nhập hàng", <ShoppingCartIcon />),
      can("purchaseReturn") &&
        item(privateRoutesName.purchaseReturn, "Trả hàng nhập", <ArrowsRightLeftIcon />),
    ].filter(Boolean) as MenuItem[],
  );

  const accounting = subgroup(
    "accounting",
    "Kế toán",
    [
      can("fund") && item(privateRoutesName.fund, "Sổ quỹ", <BanknotesIcon />),
      can("fundTransfer") &&
        item(privateRoutesName.fundTransfer, "Chuyển quỹ", <ArrowsRightLeftIcon />),
      can("fundAdjustment") &&
        item(privateRoutesName.fundAdjustment, "Điều chỉnh số dư", <AdjustmentsHorizontalIcon />),
      can("debtAdjustment") &&
        item(privateRoutesName.debtAdjustment, "Điều chỉnh công nợ", <UsersIcon />),
      can("vatAdjustment") && item(privateRoutesName.vatAdjustment, "Điều chỉnh VAT", <TagIcon />),
    ].filter(Boolean) as MenuItem[],
  );

  const operations = group(
    "operations",
    "Nghiệp vụ",
    [
      orders,
      products,
      purchases,
      can("customer") && item(privateRoutesName.customer, "Khách hàng", <UsersIcon />),
      accounting,
    ].filter(Boolean) as MenuItem[],
  );

  const analysisAndReports = group("analysis-reports", "Phân tích & báo cáo", [
    {
      key: "analysis",
      type: "submenu",
      label: "Phân tích",
      children: [emptyItem("analysis-empty")],
    } as MenuItem,
    {
      key: "reports",
      type: "submenu",
      label: "Báo cáo",
      children: [emptyItem("reports-empty")],
    } as MenuItem,
  ]);

  const setup = subgroup(
    "setup",
    "Thiết lập",
    [
      can("store") && item(privateRoutesName.setup.store, "Cửa hàng", <BuildingStorefrontIcon />),
      can("attribute") && item(privateRoutesName.setup.attribute, "Danh mục", <TagIcon />),
      can("shipper") && item(privateRoutesName.setup.shipper, "Đơn vị vận chuyển", <TruckIcon />),
      can("user") && item(privateRoutesName.setup.user, "Người dùng", <UsersIcon />),
      can("role") && item(privateRoutesName.setup.role, "Vai trò hệ thống", <ShieldCheckIcon />),
    ].filter(Boolean) as MenuItem[],
  );

  const extensions = group("extensions", "Mở rộng", [setup].filter(Boolean) as MenuItem[]);

  return [overview, operations, analysisAndReports, extensions].filter(Boolean) as MenuItem[];
};

export const sideBarMenuItem = () => SideBarMenuItems();
