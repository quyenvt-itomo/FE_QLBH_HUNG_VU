import { MenuProps } from "antd";
import { Link } from "react-router-dom";
import { privateRoutesName } from "../../../../../constants/routerName";
import { useClientData } from "../../../../../hooks/core/useClientData";
import { checkAnyModule, checkModule } from "../../../../../utils/permissionUtils";
import { Icon } from "@iconify/react";
import { CurrencyDollarIcon } from "@heroicons/react/24/outline";

type MenuItem = Required<MenuProps>["items"][number];

export function extractPathsFromRouteObject(obj: any): string[] {
  const paths: string[] = [];

  const traverse = (node: any) => {
    if (typeof node === "string") {
      paths.push(node);
    } else if (typeof node === "object" && node !== null) {
      Object.values(node).forEach(traverse);
    }
  };

  traverse(obj);
  return paths;
}

export const isActivePath = (paths: string | string[]): boolean => {
  const currentPath = window.location.pathname;
  if (paths === privateRoutesName.dashboard) {
    return currentPath === privateRoutesName.dashboard;
  }

  // Nếu paths là mảng, kiểm tra tất cả các đường link trong mảng
  if (Array.isArray(paths)) {
    if (paths.includes(privateRoutesName.dashboard)) {
      return paths.includes(currentPath);
    }
    return paths.some((path) => currentPath.includes(path));
  }

  // Nếu paths chỉ là một chuỗi, kiểm tra trực tiếp
  return currentPath.includes(paths);
};

// Sidebar menu
export const SideBarMenuItems = (): MenuItem[] => {
  const { permissions, currentStore } = useClientData();
  const menuItems = [
    {
      key: privateRoutesName.dashboard,
      icon: <Icon icon="material-symbols:home-outline-rounded" width="16" />,
      label: <Link to={privateRoutesName.dashboard}>Trang chủ</Link>,
    },

    checkModule(permissions, "saleOrder") && {
      key: privateRoutesName.sale.page,
      icon: <Icon icon="mdi:cart-outline" width="16" />,
      label: <Link to={privateRoutesName.sale.page}>Bán hàng</Link>,
    },

    checkModule(permissions, "product") && {
      key: privateRoutesName.product.page,
      label: <Link to={privateRoutesName.product.page}>Hàng hóa</Link>,
      icon: <Icon icon="fluent-mdl2:product-variant" width="16" />,
    },

    checkAnyModule(permissions, [
      "purchaseOrder",
      "purchaseReturn",
      "saleReturn",
      "inventoryReport",
      "inventoryAdjustment",
      "storeTransfer",
    ]) && {
      key: "warehouse",
      icon: <Icon icon="streamline-flex:warehouse-1" width="16" />,
      label: <span>Kho</span>,
      children: [
        checkModule(permissions, "purchaseOrder") && {
          key: privateRoutesName.purchase.page,
          label: <Link to={privateRoutesName.purchase.page}>Nhập hàng</Link>,
        },
        checkModule(permissions, "purchaseReturn") && {
          key: privateRoutesName.purchaseReturn.page,
          label: <Link to={privateRoutesName.purchaseReturn.page}>Trả hàng NCC</Link>,
        },
        checkModule(permissions, "saleReturn") && {
          key: privateRoutesName.saleReturn.page,
          label: <Link to={privateRoutesName.saleReturn.page}>KH trả hàng</Link>,
        },
        checkModule(permissions, "storeTransfer") && {
          key: privateRoutesName.storeTransfer.page,
          label: <Link to={privateRoutesName.storeTransfer.page}>Chuyển kho</Link>,
        },
        checkModule(permissions, "inventoryAdjustment") && {
          key: privateRoutesName.inventoryAdjustment.page,
          label: <Link to={privateRoutesName.inventoryAdjustment.page}>Kiểm kho</Link>,
        },
        checkModule(permissions, "inventoryReport") && {
          key: privateRoutesName.inventory.page,
          label: <Link to={privateRoutesName.inventory.page}>Tồn kho</Link>,
        },
      ],
    },

    (checkAnyModule(permissions, [
      "incomeExpense",
      "debtReport",
      "debtAdjustment",
      "debtOffset",
      "vatReport",
      "vatAdjustment",
    ]) ||
      checkAnyModule(permissions, ["fund", "fundAdjustment", "fundReport", "fundTransfer"])) && {
      key: "accounting",
      icon: <CurrencyDollarIcon width="16" />,
      label: <span>Kế toán</span>,
      children: [
        checkModule(permissions, "incomeExpense") && {
          key: privateRoutesName.cashBook.page,
          label: <Link to={privateRoutesName.cashBook.page}>Sổ thu chi</Link>,
        },
        checkAnyModule(permissions, ["fund", "fundAdjustment", "fundReport", "fundTransfer"]) && {
          key: privateRoutesName.fundManager.page,
          label: <Link to={privateRoutesName.fundManager.page}>Quản lý quỹ</Link>,
        },
        checkAnyModule(permissions, ["debtReport", "debtAdjustment", "debtOffset"]) && {
          key: privateRoutesName.debtManager.page,
          label: <Link to={privateRoutesName.debtManager.page}>Quản lý công nợ</Link>,
        },
        checkAnyModule(permissions, ["vatReport", "vatAdjustment"]) && {
          key: privateRoutesName.vatManager.page,
          label: <Link to={privateRoutesName.vatManager.page}>Quản lý VAT</Link>,
        },
      ],
    },
    checkModule(permissions, "customer") && {
      key: privateRoutesName.customer.page,
      icon: <Icon icon="octicon:people-24" width="16" />,
      label: <Link to={privateRoutesName.customer.page}>Khách hàng</Link>,
    },
    checkAnyModule(permissions, ["store", "supplier", "employee", "user", "permission"]) && {
      key: "categories",
      icon: <Icon icon="material-symbols:density-medium-rounded" width="16" />,
      label: <span>Danh mục</span>,
      children: [
        checkModule(permissions, "store") && {
          key: privateRoutesName.categories.store,
          label: <Link to={privateRoutesName.categories.store}>Cửa hàng</Link>,
        },
        checkModule(permissions, "supplier") && {
          key: privateRoutesName.supplier.page,
          label: <Link to={privateRoutesName.supplier.page}>Nhà cung cấp</Link>,
        },

        checkModule(permissions, "employee") && {
          key: privateRoutesName.employee.page,
          label: <Link to={privateRoutesName.employee.page}>Nhân sự</Link>,
        },

        checkModule(permissions, "shift") && {
          key: privateRoutesName.shift.page,
          label: <Link to={privateRoutesName.shift.page}>Ca làm việc</Link>,
        },
        checkModule(permissions, "user") && {
          key: privateRoutesName.categories.user,
          label: <Link to={privateRoutesName.categories.user}>Người dùng</Link>,
        },
        checkModule(permissions, "permission") && {
          key: privateRoutesName.categories.permission,
          label: <Link to={privateRoutesName.categories.permission}>Phân quyền cửa hàng</Link>,
        },
        checkModule(permissions, "systemPermission") && {
          key: privateRoutesName.categories.systemPermission,
          label: (
            <Link to={privateRoutesName.categories.systemPermission}>Phân quyền hệ thống</Link>
          ),
        },
      ],
    },
  ].filter(Boolean) as MenuItem[];

  return menuItems;
};

export const sideBarMenuItem = () => {
  return SideBarMenuItems();
};
