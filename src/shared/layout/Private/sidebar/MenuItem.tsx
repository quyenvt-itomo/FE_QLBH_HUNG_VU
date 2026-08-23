import { MenuProps } from "antd";
import { Link } from "react-router-dom";
import { privateRoutesName } from "@/shared/constants/routerName";
import { useGlobalData } from "@/shared/hooks/useGlobalData";
import { checkAnyModule, checkModule } from "@/shared/utils/permission.util";
import { ChartBarIcon, ShoppingCartIcon, TruckIcon, ArrowsRightLeftIcon, AdjustmentsHorizontalIcon, CurrencyDollarIcon, BuildingLibraryIcon, UsersIcon, ShieldCheckIcon, CubeIcon, BuildingStorefrontIcon } from "@heroicons/react/24/outline";

type MenuItem = Required<MenuProps>["items"][number];
const item = (key: string, label: string, icon: React.ReactNode) => ({ key, icon, label: <Link to={key}>{label}</Link> });

export function extractPathsFromRouteObject(obj: any): string[] {
  const paths: string[] = [];
  const visit = (value: any) => typeof value === "string" ? paths.push(value) : value && typeof value === "object" && Object.values(value).forEach(visit);
  visit(obj);
  return paths;
}
export const isActivePath = (paths: string | string[]): boolean => {
  const current = window.location.pathname;
  return Array.isArray(paths) ? paths.some((path) => current.startsWith(path)) : current === paths || current.startsWith(paths);
};

export const SideBarMenuItems = (): MenuItem[] => {
  const { permissions } = useGlobalData();
  const sales = checkAnyModule(permissions, ["sale", "saleReturn"]);
  const purchases = checkAnyModule(permissions, ["purchase", "purchaseReturn"]);
  const inventory = checkAnyModule(permissions, ["storeTransfer", "inventoryAdjustment", "inventoryReport"]);
  const finance = checkAnyModule(permissions, ["income", "expense", "fund", "fundAdjustment", "fundTransfer"]);
  const partners = checkAnyModule(permissions, ["customer", "supplier", "shipper"]);
  return [
    item(privateRoutesName.dashboard, "Tổng quan", <ChartBarIcon />),
    checkModule(permissions, "sale") && item(privateRoutesName.sales.pos, "Bán hàng (POS)", <ShoppingCartIcon />),
    sales && { key: "sales", type: "group", label: "Bán hàng", children: [checkModule(permissions, "sale") && item(privateRoutesName.sales.order, "Đơn bán hàng", <ShoppingCartIcon />), checkModule(permissions, "saleReturn") && item(privateRoutesName.sales.saleReturn, "Đổi trả hàng", <ArrowsRightLeftIcon />)].filter(Boolean) },
    purchases && { key: "purchases", type: "group", label: "Nhập hàng", children: [checkModule(permissions, "purchase") && item(privateRoutesName.purchases.purchase, "Đơn nhập hàng", <TruckIcon />), checkModule(permissions, "purchaseReturn") && item(privateRoutesName.purchases.purchaseReturn, "Đổi trả hàng nhập", <ArrowsRightLeftIcon />)].filter(Boolean) },
    inventory && { key: "inventory", type: "group", label: "Kho", children: [checkModule(permissions, "storeTransfer") && item(privateRoutesName.inventories.storeTransfer, "Chuyển cửa hàng", <ArrowsRightLeftIcon />), checkModule(permissions, "inventoryAdjustment") && item(privateRoutesName.inventories.inventoryAdjustment, "Điều chỉnh tồn kho", <AdjustmentsHorizontalIcon />), checkModule(permissions, "inventoryReport") && item(privateRoutesName.inventories.report, "Báo cáo tồn kho", <ChartBarIcon />)].filter(Boolean) },
    finance && { key: "finance", type: "group", label: "Tài chính", children: [checkAnyModule(permissions, ["income", "expense"]) && item(privateRoutesName.accountants.incomeExpense, "Thu chi", <CurrencyDollarIcon />), checkModule(permissions, "fund") && item(privateRoutesName.accountants.fund, "Quỹ", <BuildingLibraryIcon />), checkModule(permissions, "fundAdjustment") && item(privateRoutesName.accountants.fundAdjustment, "Điều chỉnh quỹ", <AdjustmentsHorizontalIcon />), checkModule(permissions, "fundTransfer") && item(privateRoutesName.accountants.fundTransfer, "Chuyển quỹ", <ArrowsRightLeftIcon />)].filter(Boolean) },
    partners && { key: "partners", type: "group", label: "Đối tác", children: [checkModule(permissions, "customer") && item(privateRoutesName.categories.customer, "Khách hàng", <UsersIcon />), checkModule(permissions, "supplier") && item(privateRoutesName.categories.supplier, "Nhà cung cấp", <TruckIcon />), checkModule(permissions, "shipper") && item(privateRoutesName.categories.shipper, "Đơn vị vận chuyển", <TruckIcon />)].filter(Boolean) },
    checkModule(permissions, "product") && item(privateRoutesName.categories.product, "Sản phẩm", <CubeIcon />),
    checkModule(permissions, "store") && item(privateRoutesName.categories.store, "Cửa hàng", <BuildingStorefrontIcon />),
    checkModule(permissions, "user") && item(privateRoutesName.categories.user, "Người dùng", <UsersIcon />),
    checkModule(permissions, "role") && item(privateRoutesName.categories.permission, "Phân quyền", <ShieldCheckIcon />),
  ].filter(Boolean) as MenuItem[];
};
export const sideBarMenuItem = () => SideBarMenuItems();
