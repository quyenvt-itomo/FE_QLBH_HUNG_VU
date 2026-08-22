import { Icon } from "@iconify/react";
import { privateRoutesName, publicRoutesName } from "./routerName";
import { ReactNode } from "react";

export interface RouteTitleMap {
  [key: string]: {
    path: string;
    title: string;
    icon: ReactNode;
    subtitle?: string;
  };
}

export const routeTitleMap: RouteTitleMap = {
  login: {
    path: publicRoutesName.login,
    title: "Đăng nhập",
    icon: <Icon icon="material-symbols:login" height={20} />,
    subtitle: "Vui lòng đăng nhập để tiếp tục",
  },

  profile: {
    path: privateRoutesName.profile,
    title: "Thông tin cá nhân",
    icon: <Icon icon="lucide:user" height={20} />,
    subtitle: "Thông tin tài khoản của bạn",
  },

  setting: {
    path: privateRoutesName.setting,
    title: "Cài đặt hiển thị",
    icon: <Icon icon="uil:setting" height={20} />,
    subtitle: "Tùy chỉnh cài đặt hiển thị của bạn",
  },

  overview: {
    path: privateRoutesName.dashboard,
    title: "Trang chủ",
    icon: <Icon icon="material-symbols:home-outline-rounded" height={20} />,
  },

  purchase: {
    path: privateRoutesName.purchase.page,
    title: "Nhập hàng",
    icon: <Icon icon="mdi:truck-outline" height={20} />,
  },
  addPurchaseOrder: {
    path: privateRoutesName.purchase.add,
    title: "Tạo đơn nhập hàng",
    icon: <Icon icon="mdi:truck-outline" height={20} />,
  },
  detailPurchaseOrder: {
    path: privateRoutesName.purchase.detail,
    title: "Chi tiết đơn nhập hàng",
    icon: <Icon icon="mdi:truck-outline" height={20} />,
  },

  sale: {
    path: privateRoutesName.sale.page,
    title: "Bán hàng",
    icon: <Icon icon="mdi:cart-outline" height={20} />,
  },
  addSaleOrder: {
    path: privateRoutesName.sale.add,
    title: "Tạo đơn bán hàng",
    icon: <Icon icon="mdi:cart-outline" height={20} />,
  },
  detailSaleOrder: {
    path: privateRoutesName.sale.detail,
    title: "Chi tiết đơn bán hàng",
    icon: <Icon icon="mdi:cart-outline" height={20} />,
  },

  purchaseReturn: {
    path: privateRoutesName.purchaseReturn.page,
    title: "Trả hàng nhà cung cấp",
    icon: <Icon icon="tabler:truck-return" height={20} />,
  },
  addPurchaseReturn: {
    path: privateRoutesName.purchaseReturn.add,
    title: "Tạo đơn trả hàng nhà cung cấp",
    icon: <Icon icon="tabler:truck-return" height={20} />,
  },
  detailPurchaseReturn: {
    path: privateRoutesName.purchaseReturn.detail,
    title: "Chi tiết đơn trả hàng nhà cung cấp",
    icon: <Icon icon="tabler:truck-return" height={20} />,
  },

  saleReturn: {
    path: privateRoutesName.saleReturn.page,
    title: "Khách hàng trả hàng",
    icon: <Icon icon="lsicon:sales-return-outline" height={20} />,
  },
  addSaleReturn: {
    path: privateRoutesName.saleReturn.add,
    title: "Tạo đơn hoàn hàng",
    icon: <Icon icon="lsicon:sales-return-outline" height={20} />,
  },
  detailSaleReturn: {
    path: privateRoutesName.saleReturn.detail,
    title: "Chi tiết đơn hoàn hàng",
    icon: <Icon icon="lsicon:sales-return-outline" height={20} />,
  },

  cashBook: {
    path: privateRoutesName.cashBook.page,
    title: "Sổ thu chi",
    icon: <Icon icon="tabler:cash" height={20} />,
  },
  fund: {
    path: privateRoutesName.fundManager.page,
    title: "Quản lý quỹ",
    icon: <Icon icon="ri:refund-2-line" height={20} />,
  },

  product: {
    path: privateRoutesName.product.page,
    title: "Danh sách hàng hóa",
    icon: <Icon icon="fluent-mdl2:product-variant" height={20} />,
  },
  addProduct: {
    path: privateRoutesName.product.add,
    title: "Thêm mới hàng hóa",
    icon: <Icon icon="fluent-mdl2:product-variant" height={20} />,
  },
  detailProduct: {
    path: privateRoutesName.product.detail,
    title: "Chi tiết thông tin hàng hóa",
    icon: <Icon icon="fluent-mdl2:product-variant" height={20} />,
  },

  storeTransfer: {
    path: privateRoutesName.storeTransfer.page,
    title: "Chuyển kho",
    icon: <Icon icon="mdi:swap-horizontal-bold" height={20} />,
  },

  inventoryAdjustment: {
    path: privateRoutesName.inventoryAdjustment.page,
    title: "Kiểm kho",
    icon: <Icon icon="mdi:clipboard-check-multiple-outline" height={20} />,
  },

  inventory: {
    path: privateRoutesName.inventory.page,
    title: "Tồn kho",
    icon: <Icon icon="fluent:box-32-regular" height={20} />,
  },
  inventoryDetail: {
    path: privateRoutesName.inventory.detail,
    title: "Chi tiết sổ kho sản phẩm",
    icon: <Icon icon="ri:bill-line" height={20} />,
  },

  customer: {
    path: privateRoutesName.customer.page,
    title: "Danh sách khách hàng",
    icon: <Icon icon="lucide:users" height={20} />,
  },
  detailCustomer: {
    path: privateRoutesName.customer.detail,
    title: "Chi tiết khách hàng",
    icon: <Icon icon="lucide:users" height={20} />,
  },
  addCustomer: {
    path: privateRoutesName.customer.add,
    title: "Thêm khách hàng",
    icon: <Icon icon="lucide:users" height={20} />,
  },

  supplier: {
    path: privateRoutesName.supplier.page,
    title: "Danh sách nhà cung cấp",
    icon: <Icon icon="mdi:truck-delivery-outline" height={20} />,
  },
  detailSupplier: {
    path: privateRoutesName.supplier.detail,
    title: "Chi tiết nhà cung cấp",
    icon: <Icon icon="mdi:truck-delivery-outline" height={20} />,
  },
  addSupplier: {
    path: privateRoutesName.supplier.add,
    title: "Thêm nhà cung cấp",
    icon: <Icon icon="mdi:truck-delivery-outline" height={20} />,
  },

  employee: {
    path: privateRoutesName.employee.page,
    title: "Danh sách nhân sự",
    icon: <Icon icon="clarity:employee-line" height={20} />,
  },

  store: {
    path: privateRoutesName.categories.store,
    title: "Danh sách cửa hàng",
    icon: <Icon icon="mdi:store-outline" height={20} />,
  },
  user: {
    path: privateRoutesName.categories.user,
    title: "Người dùng",
    icon: <Icon icon="lucide:users" height={20} />,
  },

  permission: {
    path: privateRoutesName.categories.permission,
    title: "Phân quyền",
    icon: <Icon icon="mdi:shield-lock-outline" height={20} />,
  },
};
