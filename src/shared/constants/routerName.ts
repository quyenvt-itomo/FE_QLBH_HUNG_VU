export const publicRoutesName = {
  login: "/login",
  errorNetwork: "/error-network",
  error404: "/error-404",
  forgotPassword: "/forgot-password",
  confirmOtp: "/confirm-otp",
  confirmPassword: "/confirm-password",
  confirmEmail: "/confirm-email",
  newPassword: "/new-password",
  blank: "/blank-page",

  // invite
  confirmInviteSuccess: "/accept-invitation-success",
  confirmInviteFailed: "/accept-invitation-failed",
  auth: "auth",
  refreshToken: "auth/refresh-token",
};

export const privateRoutesName = {
  // TODO: Dashboard
  dashboard: "/",

  pos: "/pos",

  // TODO: Bán hàng
  sale: "/sales",
  saleReturn: "/sales-returns",

  // TODO: Hàng hóa
  product: "/products",
  storeTransfer: "/store-transfer",
  inventoryAdjustment: "/inventory-adjustments",
  internalExport: "/internal-export",

  // TODO: Mua hàng
  supplier: "/suppliers",
  purchase: "/purchases",
  purchaseReturn: "/purchases-returns",

  // TODO: Khách hàng
  customer: "/customers",

  // TODO: Sổ quỹ
  incomeExpense: "/income-expenses",

  // TODO: Kế toán
  fund: "/funds",
  fundAdjustment: "/fund-adjustments",
  fundTransfer: "/fund-transfers",
  debtAdjustment: "/debt-adjustments",
  vatAdjustment: "/vat-adjustments",

  // TODO: Phân tích
  analysis: {},

  // TODO: Báo cáo
  report: {},

  // TODO: Thiết lập
  setup: {
    store: "/setup/stores",
    attribute: "/setup/attributes",
    shipper: "/setup/shippers",
    user: "/setup/users",
    role: "/setup/roles",
  },

  profile: "/profile",
  setting: "/setting",
};

export interface RouteTitleMap {
  [key: string]: {
    path: string;
    title: string;
    subtitle: string;
  };
}

export const routeTitleMap: RouteTitleMap = {
  login: {
    path: publicRoutesName.login,
    title: "Đăng nhập",
    subtitle: "Vui lòng đăng nhập để tiếp tục",
  },

  profile: {
    path: privateRoutesName.profile,
    title: "Thông tin cá nhân",
    subtitle: "Thông tin tài khoản",
  },

  setting: {
    path: privateRoutesName.setting,
    title: "Cài đặt hiển thị",
    subtitle: "Tùy chỉnh cài đặt hiển thị",
  },

  dashboard: {
    path: privateRoutesName.dashboard,
    title: "Tổng quan",
    subtitle: "Tổng quan về hoạt động kinh doanh",
  },
};
