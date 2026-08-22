export const HOST_URL = import.meta.env.VITE_BASE_HOST_URL;
export const BASE_URL = import.meta.env.VITE_BASE_HOST_URL + "v1";
export const FE_BASE_URL = import.meta.env.VITE_BASE_FRONTEND_URL;
export const TOOL_URL = import.meta.env.VITE_BASE_TOOL_URL || "https://tool.itomosoft.com/";
export const apiGetIpAddress = "https://api.ipify.org?format=json";
export const VAPID_PUBLIC_KEY =
  import.meta.env.VITE_VAPID_PUBLIC_KEY ||
  "BJIAa5ccQvr8S0XRPeNYt0uBGSlcF9vV3VsKH9Cq39PZXG0IQcDnFQyLAVaUsc9k7usxBwzuQMt6DV8MkUX7UOw";

export const partnerEndPointPrefix = "/investor";

export const apiEndpoint = {
  // uploads
  upload: "/uploads",

  files: {
    base: "/file",
    setMain: "/file/:id/set-main",
  },

  dashboard: {
    base: "/dashboard",
    overview: "/dashboard/overview",
    profit: "/dashboard/profit",
    sales: "/dashboard/sales",
    product: "/dashboard/product",

    detailProduct: "/dashboard/product/:productId",
  },

  store: {
    base: "/store",
    first: "/store/first",
  },

  // settings
  settings: {
    base: "/settings",
    format: "/settings/format",
  },

  // code
  code: "/code",

  excel: {
    export: "/excel/export",
    import: "/excel/import",
    stream: "/excel/import/progress/:jobId/stream",
    template: "/excel/template/:entityType",
    validate: "/excel/validate",
  },

  attribute: {
    base: "/attribute",
  },

  passportAuth: {
    google: "/passport-auth/google",
    facebook: "/passport-auth/facebook",
    yahoo: "/passport-auth/yahoo",
    twitter: "/passport-auth/twitter",
  },

  // auth
  auth: {
    login: "/auth/login",
    logout: "/auth/logout",
    info: "/auth/me",
    updateInfo: "/auth/update-info",
    forgotPassword: "/auth/forgot-password",
    changePassword: "/auth/change-password",
    verifyOtp: "/auth/verify-otp",
    resendOtp: "/auth/resend-otp",
    resetPassword: "/auth/reset-password",

    notification: {
      base: "/auth/notifications",
      all: "/auth/notifications/all",
    },

    shift: {
      base: "/auth/shifts",
    },

    setting: "/auth/settings",
  },

  // TODO: Quỹ
  fund: {
    base: "/fund",
    incomeExpense: "/fund/:fundId/income-expense",
    transfer: "/fund/:fundId/fund-transfer",
    advance: "/fund/:fundId/advance",
  },
  fundCategory: {
    base: "/fund-category",
  },
  // TODO: Giao dịch quỹ
  incomeExpense: {
    base: "/income-expense",
  },
  // TODO: Tồn quỹ
  fundBalance: {
    report: "/fund-balance/report",
    transaction: "/fund-balance/transaction",
    adjustment: "/fund-balance/adjustment",
    transfer: "/fund-balance/transfer",
  },

  // TODO: Sản phẩm
  product: {
    base: "/product",
    many: "/product/many",
    option: "/product/:productId/option",
    manyOption: "/product/:productId/option/type",
    changeOptionIndex: "/product/:productId/option/change-index",
    variant: "/product/:productId/variant-unit",
  },

  // TODO: Khách hàng
  customer: {
    base: "/customer",
    subType: "/customer/:partnerId/sub-type",
    customerContact: "/customer/:partnerId/contact",
  },

  // TODO: Nhà cung cấp
  supplier: {
    base: "/supplier",
    subType: "/supplier/:partnerId/sub-type",
    supplierContact: "/supplier/:partnerId/contact",
  },

  // TODO: Đối tác
  partner: { base: "/partner/by-role" },

  // TODO: Nhân sự
  employee: {
    base: "/employee",
  },

  // TODO: Người dùng
  user: {
    base: "/user",
  },

  // TODO: Nhập hàng
  purchase: {
    base: "/purchase-order",
    line: "/purchase-order/:orderId/line",
  },

  // TODO: Bán hàng
  sale: {
    base: "/sale-order",
    line: "/sale-order/:orderId/line",
    updateStock: "/sale-order/:orderId/update-stock",
  },

  // TODO: Trả hàng mua
  purchaseReturn: {
    base: "/purchase-return",
    line: "/purchase-return/:orderId/line",
  },

  // TODO: Trả hàng bán
  saleReturn: {
    base: "/sale-return",
    line: "/sale-return/:orderId/line",
  },

  // TODO: Điều chỉnh tồn kho
  inventoryAdjustment: {
    base: "/inventory-adjustment",
    line: "/inventory-adjustment/:adjustmentId/line",
  },
  // TODO: Chuyển kho
  storeTransfer: {
    base: "/store-transfer",
    line: "/store-transfer/:transferId/line",
  },
  // TODO: Tồn kho
  inventory: {
    report: "/inventory/stock-report",
    transaction: "/inventory/transaction",
    recalculateQueueStats: "/inventory/recalculate/queue-stats",
    recalculateStream: "/inventory/recalculate/stream",
  },

  // TODO: Công nợ
  debt: {
    report: "/partner-debt/report",
    transaction: "/partner-debt/transaction",
    adjustment: "/partner-debt/adjustment",
    offset: "/partner-debt/offset",
  },

  // TODO: Thuế VAT
  vat: {
    transaction: "/vat-debt/report",
    adjustment: "/vat-debt/adjustment",
  },

  // TODO: Tích điểm
  loyaltyPoint: {
    report: "/loyalty-point/report",
    transaction: "/loyalty-point/transaction",
  },

  // TODO: Phân quyền
  systemRole: {
    base: "/system-role",
  },
  role: {
    base: "/role",
  },

  // TODO: Ca làm việc
  shift: {
    base: "/shift",
    open: "/shift/open",
    close: "/shift/:id/close",
    summary: "/shift/:id/summary",
  },
};
