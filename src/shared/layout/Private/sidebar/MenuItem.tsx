import { MenuProps } from "antd";
import { Link } from "react-router-dom";
import { privateRoutesName } from "@/shared/constants/routerName";
import { useGlobalData } from "@/shared/hooks/useGlobalData";
import { checkAnyModule, checkModule } from "@/shared/utils/permission.util";
import {
  ChartBarIcon,
  ShoppingCartIcon,
  TruckIcon,
  WrenchScrewdriverIcon,
  UsersIcon,
  BanknotesIcon,
  DocumentTextIcon,
  ClipboardDocumentListIcon,
  ClipboardDocumentCheckIcon,
  ArrowsRightLeftIcon,
  AdjustmentsHorizontalIcon,
  ScaleIcon,
  ClockIcon,
  CalendarDaysIcon,
  CreditCardIcon,
  CurrencyDollarIcon,
  ReceiptPercentIcon,
  DocumentDuplicateIcon,
  DocumentCheckIcon,
  DevicePhoneMobileIcon,
  ListBulletIcon,
  UserGroupIcon,
  TagIcon,
  CubeIcon,
  BriefcaseIcon,
  BuildingOffice2Icon,
  ShieldCheckIcon,
  GlobeAltIcon,
  BookmarkIcon,
  BuildingLibraryIcon,
} from "@heroicons/react/24/outline";

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

  if (Array.isArray(paths)) {
    if (paths.includes(privateRoutesName.dashboard)) {
      return paths.includes(currentPath);
    }
    return paths.some((path) => currentPath.startsWith(path));
  }
  return currentPath.includes(paths);
};

// Sidebar menu
export const SideBarMenuItems = (): MenuItem[] => {
  const { permissions } = useGlobalData();
  const menuItems = [
    // ==========================================
    // Tổng quan
    // ==========================================
    {
      key: privateRoutesName.dashboard,
      icon: <ChartBarIcon />,
      label: <Link to={privateRoutesName.dashboard}>Tổng quan</Link>,
    },

    // ==========================================
    checkModule(permissions, "order") && {
      key: privateRoutesName.sales.pos,
      icon: <ShoppingCartIcon />,
      label: <Link to={privateRoutesName.sales.pos}>Bán hàng (POS)</Link>,
    },

    // KINH DOANH
    // ==========================================
    checkAnyModule(permissions, ["order", "quotation", "quotationRequest"]) && {
      key: "sales",
      type: "group",
      label: "Kinh doanh",
      children: [
        checkModule(permissions, "quotationRequest") && {
          key: privateRoutesName.sales.quotationRequest,
          icon: <ClipboardDocumentListIcon />,
          label: <Link to={privateRoutesName.sales.quotationRequest}>Đề nghị báo giá</Link>,
        },
        checkModule(permissions, "quotation") && {
          key: privateRoutesName.sales.quotation,
          icon: <DocumentTextIcon />,
          label: <Link to={privateRoutesName.sales.quotation}>Báo giá</Link>,
        },
        checkModule(permissions, "order") && {
          key: privateRoutesName.sales.order,
          icon: <ShoppingCartIcon />,
          label: <Link to={privateRoutesName.sales.order}>Đơn hàng</Link>,
        },
      ].filter(Boolean),
    },

    // ==========================================
    // MUA HÀNG
    // ==========================================
    checkAnyModule(permissions, ["purchase", "purchaseRequisition", "purchaseQuotation"]) && {
      key: "purchases",
      type: "group",
      label: "Mua hàng",
      children: [
        checkModule(permissions, "purchaseRequisition") && {
          key: privateRoutesName.sales.purchaseRequisition,
          icon: <ClipboardDocumentCheckIcon />,
          label: <Link to={privateRoutesName.sales.purchaseRequisition}>Đề nghị mua vật tư</Link>,
        },
        checkModule(permissions, "purchaseQuotation") && {
          key: privateRoutesName.sales.purchaseQuotation,
          icon: <DocumentTextIcon />,
          label: <Link to={privateRoutesName.sales.purchaseQuotation}>Báo giá từ NCC</Link>,
        },
        checkModule(permissions, "purchase") && {
          key: privateRoutesName.purchases.purchase,
          icon: <TruckIcon />,
          label: <Link to={privateRoutesName.purchases.purchase}>Đơn mua hàng</Link>,
        },
      ].filter(Boolean),
    },

    // ==========================================
    // SẢN XUẤT
    // ==========================================
    checkAnyModule(permissions, ["production", "bom"]) && {
      key: "productions",
      type: "group",
      label: "Sản xuất",
      children: [
        checkModule(permissions, "production") && {
          key: privateRoutesName.productions.production,
          icon: <WrenchScrewdriverIcon />,
          label: <Link to={privateRoutesName.productions.production}>Lệnh sản xuất</Link>,
        },
        checkModule(permissions, "bom") && {
          key: privateRoutesName.productions.billOfMaterial,
          icon: <ClipboardDocumentListIcon />,
          label: <Link to={privateRoutesName.productions.billOfMaterial}>Định mức NVL</Link>,
        },
      ].filter(Boolean),
    },

    // ==========================================
    // QUẢN LÝ KHO
    // ==========================================
    checkAnyModule(permissions, [
      "warehouse",
      "stockDocument",
      "warehouseTransfer",
      "inventoryAdjustment",
      "inventoryConversion",
      "gateLog",
      "shippingPlan",
      "inventoryReport",
    ]) && {
      key: "inventories",
      type: "group",
      label: "Quản lý kho",
      children: [
        checkModule(permissions, "warehouse") && {
          key: privateRoutesName.inventories.warehouse,
          icon: <BuildingOffice2Icon />,
          label: <Link to={privateRoutesName.inventories.warehouse}>Kho hàng</Link>,
        },
        checkModule(permissions, "stockDocument") && {
          key: privateRoutesName.inventories.stockDocument,
          icon: <DocumentDuplicateIcon />,
          label: <Link to={privateRoutesName.inventories.stockDocument}>Phiếu XNK</Link>,
        },
        checkModule(permissions, "warehouseTransfer") && {
          key: privateRoutesName.inventories.warehouseTransfer,
          icon: <ArrowsRightLeftIcon />,
          label: <Link to={privateRoutesName.inventories.warehouseTransfer}>Chuyển kho</Link>,
        },
        checkModule(permissions, "inventoryAdjustment") && {
          key: privateRoutesName.inventories.inventoryAdjustment,
          icon: <AdjustmentsHorizontalIcon />,
          label: <Link to={privateRoutesName.inventories.inventoryAdjustment}>Kiểm kê</Link>,
        },
        checkModule(permissions, "inventoryConversion") && {
          key: privateRoutesName.inventories.inventoryConversion,
          icon: <ScaleIcon />,
          label: <Link to={privateRoutesName.inventories.inventoryConversion}>Chuyển mã</Link>,
        },
        checkModule(permissions, "inventoryReport") && {
          key: privateRoutesName.inventories.report,
          icon: <ChartBarIcon />,
          label: <Link to={privateRoutesName.inventories.report}>Báo cáo tồn kho</Link>,
        },
        checkModule(permissions, "shippingPlan") && {
          key: privateRoutesName.inventories.shippingPlan,
          icon: <CalendarDaysIcon />,
          label: <Link to={privateRoutesName.inventories.shippingPlan}>Phương án vận chuyển</Link>,
        },
        checkModule(permissions, "gateLog") && {
          key: privateRoutesName.inventories.gateLog,
          icon: <ClockIcon />,
          label: <Link to={privateRoutesName.inventories.gateLog}>Nhật ký ra vào cổng</Link>,
        },
      ].filter(Boolean),
    },

    // ==========================================
    // KẾ TOÁN
    // ==========================================
    checkAnyModule(permissions, [
      "incomeExpense",
      "fund",
      "fundAdjustment",
      "fundTransfer",
      "fundBalanceReport",
      "invoice",
      "paymentRequest",
      "paymentTerm",
      "commissionDebtAdjustment",
      "commissionDebtReport",
      "partnerDebtAdjustment",
      "partnerDebtOffset",
      "partnerDebtReport",
      "vatDebtAdjustment",
      "vatDebtReport",
    ]) && {
      key: "accountants",
      type: "group",
      label: "Kế toán",
      children: [
        checkModule(permissions, "incomeExpense") && {
          key: privateRoutesName.accountants.incomeExpense,
          icon: <CurrencyDollarIcon />,
          label: <Link to={privateRoutesName.accountants.incomeExpense}>Thu chi</Link>,
        },
        checkModule(permissions, "fund") && {
          key: privateRoutesName.accountants.fund,
          icon: <BuildingLibraryIcon />,
          label: <Link to={privateRoutesName.accountants.fund}>Danh sách quỹ</Link>,
        },
        checkModule(permissions, "fundAdjustment") && {
          key: privateRoutesName.accountants.fundAdjustment,
          icon: <AdjustmentsHorizontalIcon />,
          label: <Link to={privateRoutesName.accountants.fundAdjustment}>Điều chỉnh quỹ</Link>,
        },
        checkModule(permissions, "fundTransfer") && {
          key: privateRoutesName.accountants.fundTransfer,
          icon: <ArrowsRightLeftIcon />,
          label: <Link to={privateRoutesName.accountants.fundTransfer}>Chuyển quỹ</Link>,
        },
        checkModule(permissions, "fundBalanceReport") && {
          key: privateRoutesName.accountants.fundBalanceReport,
          icon: <ChartBarIcon />,
          label: <Link to={privateRoutesName.accountants.fundBalanceReport}>Báo cáo tồn quỹ</Link>,
        },
        checkModule(permissions, "invoice") && {
          key: privateRoutesName.accountants.invoice,
          icon: <ReceiptPercentIcon />,
          label: <Link to={privateRoutesName.accountants.invoice}>Hóa đơn</Link>,
        },
        checkModule(permissions, "paymentRequest") && {
          key: privateRoutesName.accountants.paymentRequest,
          icon: <CreditCardIcon />,
          label: <Link to={privateRoutesName.accountants.paymentRequest}>Đề nghị thanh toán</Link>,
        },
        checkAnyModule(permissions, [
          "partnerDebtAdjustment",
          "partnerDebtOffset",
          "partnerDebtReport",
          "commissionDebtAdjustment",
          "commissionDebtReport",
        ]) && {
          key: privateRoutesName.accountants.debtManagerment,
          icon: <BanknotesIcon />,
          label: <Link to={privateRoutesName.accountants.debtManagerment}>Quản lý công nợ</Link>,
        },
      ].filter(Boolean),
    },

    // ==========================================
    // NHÂN SỰ
    // ==========================================
    false && checkAnyModule(permissions, ["employee"]) && {
      key: "hr",
      type: "group",
      label: "Nhân sự",
      children: [
        checkModule(permissions, "employee") && {
          key: privateRoutesName.hr.employee,
          icon: <UsersIcon />,
          label: <Link to={privateRoutesName.hr.employee}>Danh sách nhân sự</Link>,
        },
      ].filter(Boolean),
    },

    // ==========================================
    // THIẾT LẬP HỆ THỐNG
    // ==========================================
    checkAnyModule(permissions, ["organization", "jobPosition"]) && {
      key: "establish",
      type: "group",
      label: "Thiết lập hệ thống",
      children: [
        checkModule(permissions, "organization") && {
          key: privateRoutesName.establish.organization,
          icon: <BuildingOffice2Icon />,
          label: <Link to={privateRoutesName.establish.organization}>Cơ cấu tổ chức</Link>,
        },
        checkModule(permissions, "jobPosition") && {
          key: privateRoutesName.establish.jobPosition,
          icon: <BriefcaseIcon />,
          label: <Link to={privateRoutesName.establish.jobPosition}>Vị trí công việc</Link>,
        },
      ].filter(Boolean),
    },

    // ==========================================
    // DANH MỤC
    // ==========================================
    checkAnyModule(permissions, [
      "partner",
      "product",
      "service",
      "user",
      "role",
      "organization",
      "category",
    ]) && {
      key: "categories",
      type: "group",
      label: "Danh mục",
      children: [
        checkModule(permissions, "paymentTerm") && {
          key: privateRoutesName.categories.paymentTerm,
          icon: <TagIcon />,
          label: <Link to={privateRoutesName.categories.paymentTerm}>Điều khoản thanh toán</Link>,
        },
        checkModule(permissions, "partner") && {
          key: privateRoutesName.categories.partner,
          icon: <UserGroupIcon />,
          label: <Link to={privateRoutesName.categories.partner}>Đối tác</Link>,
        },
        checkModule(permissions, "product") && {
          key: privateRoutesName.categories.product,
          icon: <CubeIcon />,
          label: <Link to={privateRoutesName.categories.product}>Hàng hóa</Link>,
        },
        checkModule(permissions, "product") && {
          key: privateRoutesName.categories.priceHistory,
          icon: <BookmarkIcon />,
          label: <Link to={privateRoutesName.categories.priceHistory}>Lịch sử giá</Link>,
        },
        checkModule(permissions, "service") && {
          key: privateRoutesName.categories.service,
          icon: <GlobeAltIcon />,
          label: <Link to={privateRoutesName.categories.service}>Dịch vụ</Link>,
        },
        checkModule(permissions, "user") && {
          key: privateRoutesName.categories.user,
          icon: <UsersIcon />,
          label: <Link to={privateRoutesName.categories.user}>Người dùng</Link>,
        },
        checkModule(permissions, "role") && {
          key: privateRoutesName.categories.permission,
          icon: <ShieldCheckIcon />,
          label: <Link to={privateRoutesName.categories.permission}>Phân quyền</Link>,
        },
        // checkModule(permissions, "category") && {
        //   key: privateRoutesName.categories.attribute,
        //   icon: <TagIcon />,
        //   label: <Link to={privateRoutesName.categories.attribute}>Nhóm, ĐVT, danh mục...</Link>,
        // },
      ].filter(Boolean),
    },

    // ==========================================
    // HỆ THỐNG
    // ==========================================
    checkAnyModule(permissions, ["loginApproval", "log"]) && {
      key: "system",
      type: "group",
      label: "Hệ thống",
      children: [
        checkModule(permissions, "loginApproval") && {
          key: privateRoutesName.system.deviceWhitelist,
          icon: <DevicePhoneMobileIcon />,
          label: <Link to={privateRoutesName.system.deviceWhitelist}>Thiết bị đăng nhập</Link>,
        },
        checkModule(permissions, "log") && {
          key: privateRoutesName.system.operationLog,
          icon: <ListBulletIcon />,
          label: <Link to={privateRoutesName.system.operationLog}>Nhật ký hoạt động</Link>,
        },
      ].filter(Boolean),
    },
  ].filter(Boolean) as MenuItem[];

  return menuItems;
};

export const sideBarMenuItem = () => {
  return SideBarMenuItems();
};
