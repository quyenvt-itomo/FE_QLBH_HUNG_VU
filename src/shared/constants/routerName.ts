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

  // For Company
  quotationRequest: "/:companyCode/quotation-request",
  quotationRequestDetail: "/:companyCode/quotation-request/:code",

  supplierQuotation: "/:companyCode/supplier-quotation",
  supplierQuotationDetail: "/:companyCode/supplier-quotation/:code",
};

export const privateRoutesName = {
  // TODO: Dashboard
  dashboard: "/",

  // TODO: Sales - Kinh doanh
  sales: {
    pos: "/sales/pos",
    order: "/sales/orders",
    saleReturn: "/sales/returns",
    quotation: "/sales/quotations",
    quotationRequest: "/sales/quotation-requests",
    purchaseQuotation: "/sales/purchase-quotations",
    purchaseRequisition: "/sales/purchase-requisitions",
  },

  // TODO: Purchases - Mua hàng
  purchases: {
    purchase: "/purchases",
    purchaseReturn: "/purchases/returns",
  },

  // TODO: Productions - Sản xuất
  productions: {
    production: "/productions",
    billOfMaterial: "/productions/bom",
  },

  // TODO: Inventories - Kho
  inventories: {
    warehouse: "/inventories/warehouses",
    stockDocument: "/inventories/stock-documents",
    warehouseTransfer: "/inventories/transfers",
    inventoryAdjustment: "/inventories/adjustments",
    inventoryConversion: "/inventories/conversions",
    gateLog: "/inventories/gate-logs",
    shippingPlan: "/inventories/shipping-plans",
    report: "/inventories/report",
    storeTransfer: "/inventories/transfers",
  },

  // TODO: Accountants - Kế toán
  accountants: {
    incomeExpense: "/accountants/income-expenses",
    fund: "/accountants/funds",
    fundAdjustment: "/accountants/fund-adjustments",
    fundTransfer: "/accountants/fund-transfers",
    fundBalanceReport: "/accountants/fund-balance-report",
    invoice: "/accountants/invoices",
    paymentRequest: "/accountants/payment-requests",
    commissionDebt: "/accountants/commission-debts",
    partnerDebt: "/accountants/partner-debts",
    vatDebt: "/accountants/vat-debts",

    debtManagerment: "/accountants/debt-managerment",
  },

  // TODO: HR - Nhân sự
  hr: {
    employee: "/hr/employees",
  },

  establish: {
    organization: "/establish/organizations",
    jobPosition: "/establish/job-positions",
  },

  // TODO: Categories - Danh mục
  categories: {
    paymentTerm: "/categories/payment-terms",
    partner: "/categories/partners",
    product: "/categories/products",
    priceHistory: "/categories/products/price-histories",
    service: "/categories/services",
    user: "/categories/users",
    permission: "/categories/permission",
    attribute: "/categories/attributes",
    setting: "/categories/settings",
    customer: "/categories/customers",
    supplier: "/categories/suppliers",
    shipper: "/categories/shippers",
    store: "/categories/stores",
  },

  // TODO: System - Hệ thống
  system: {
    notification: "/system/notifications",
    deviceWhitelist: "/system/device-whitelists",
    operationLog: "/system/operation-logs",
  },

  // TODO: Profile
  profile: "/profile",

  // TODO: Setting
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

  overview: {
    path: privateRoutesName.dashboard,
    title: "Tổng quan",
    subtitle: "Tổng quan về hoạt động kinh doanh",
  },

  // Sales
  order: {
    path: privateRoutesName.sales.order,
    title: "Đơn hàng",
    subtitle: "Quản lý đơn bán hàng",
  },
  quotation: {
    path: privateRoutesName.sales.quotation,
    title: "Báo giá",
    subtitle: "Quản lý báo giá cho khách hàng",
  },
  quotationRequest: {
    path: privateRoutesName.sales.quotationRequest,
    title: "Đề nghị báo giá",
    subtitle: "Quản lý phiếu đề nghị báo giá từ khách hàng",
  },
  purchaseQuotation: {
    path: privateRoutesName.sales.purchaseQuotation,
    title: "Báo giá mua",
    subtitle: "Danh sách báo giá, chào giá từ nhà cung cấp",
  },
  purchaseRequisition: {
    path: privateRoutesName.sales.purchaseRequisition,
    title: "Đề nghị mua vật tư",
    subtitle: "Quản lý phiếu đề nghị mua vật tư",
  },

  // Purchases
  purchase: {
    path: privateRoutesName.purchases.purchase,
    title: "Mua hàng",
    subtitle: "Quản lý đơn mua hàng",
  },

  // Production
  production: {
    path: privateRoutesName.productions.production,
    title: "Lệnh sản xuất",
    subtitle: "Quản lý lệnh sản xuất",
  },
  billOfMaterial: {
    path: privateRoutesName.productions.billOfMaterial,
    title: "Định mức NVL",
    subtitle: "Quản lý định mức nguyên vật liệu",
  },

  // Inventory
  warehouse: {
    path: privateRoutesName.inventories.warehouse,
    title: "Kho hàng",
    subtitle: "Quản lý danh sách kho",
  },
  stockDocument: {
    path: privateRoutesName.inventories.stockDocument,
    title: "Phiếu xuất nhập kho",
    subtitle: "Quản lý phiếu xuất nhập kho",
  },
  warehouseTransfer: {
    path: privateRoutesName.inventories.warehouseTransfer,
    title: "Chuyển kho",
    subtitle: "Quản lý phiếu chuyển kho",
  },
  inventoryAdjustment: {
    path: privateRoutesName.inventories.inventoryAdjustment,
    title: "Kiểm kê",
    subtitle: "Quản lý phiếu kiểm kê",
  },
  inventoryConversion: {
    path: privateRoutesName.inventories.inventoryConversion,
    title: "Chuyển mã",
    subtitle: "Quản lý phiếu chuyển mã",
  },
  gateLog: {
    path: privateRoutesName.inventories.gateLog,
    title: "Nhật ký cổng",
    subtitle: "Quản lý nhật ký ra vào cổng",
  },
  shippingPlan: {
    path: privateRoutesName.inventories.shippingPlan,
    title: "Kế hoạch giao hàng",
    subtitle: "Quản lý kế hoạch giao hàng",
  },
  inventoryReport: {
    path: privateRoutesName.inventories.report,
    title: "Báo cáo tồn kho",
    subtitle: "Xem báo cáo tồn kho",
  },

  // Accountants
  incomeExpense: {
    path: privateRoutesName.accountants.incomeExpense,
    title: "Thu chi",
    subtitle: "Quản lý sổ thu chi",
  },
  fund: {
    path: privateRoutesName.accountants.fund,
    title: "Quản lý quỹ",
    subtitle: "Quản lý danh sách quỹ",
  },
  fundAdjustment: {
    path: privateRoutesName.accountants.fundAdjustment,
    title: "Điều chỉnh quỹ",
    subtitle: "Quản lý điều chỉnh quỹ",
  },
  fundTransfer: {
    path: privateRoutesName.accountants.fundTransfer,
    title: "Chuyển quỹ",
    subtitle: "Quản lý chuyển quỹ",
  },
  fundBalanceReport: {
    path: privateRoutesName.accountants.fundBalanceReport,
    title: "Báo cáo tồn quỹ",
    subtitle: "Xem báo cáo tồn quỹ",
  },
  invoice: {
    path: privateRoutesName.accountants.invoice,
    title: "Hóa đơn",
    subtitle: "Quản lý hóa đơn",
  },
  paymentRequest: {
    path: privateRoutesName.accountants.paymentRequest,
    title: "Đề nghị thanh toán",
    subtitle: "Quản lý phiếu đề nghị thanh toán",
  },
  debtManagerment: {
    path: privateRoutesName.accountants.debtManagerment,
    title: "Quản lý công nợ",
    subtitle: "Quản lý công nợ mua, bán, hoa hồng",
  },
  vatDebt: {
    path: privateRoutesName.accountants.vatDebt,
    title: "Thuế VAT",
    subtitle: "Quản lý thuế VAT",
  },

  // HR
  employee: {
    path: privateRoutesName.hr.employee,
    title: "Nhân sự",
    subtitle: "Quản lý thông tin nhân sự",
  },

  // Establish
  organization: {
    path: privateRoutesName.establish.organization,
    title: "Cơ cấu tổ chức",
    subtitle: "Thiết lập cơ cấu tổ chức",
  },
  jobPosition: {
    path: privateRoutesName.establish.jobPosition,
    title: "Vị trí công việc",
    subtitle: "Quản lý vị trí công việc",
  },

  // Categories
  paymentTerm: {
    path: privateRoutesName.categories.paymentTerm,
    title: "Điều khoản thanh toán",
    subtitle: "Quản lý điều khoản thanh toán",
  },
  partner: {
    path: privateRoutesName.categories.partner,
    title: "Đối tác",
    subtitle: "Quản lý đối tác",
  },
  product: {
    path: privateRoutesName.categories.product,
    title: "Hàng hóa",
    subtitle: "Quản lý hàng hóa",
  },
  priceHistory: {
    path: privateRoutesName.categories.priceHistory,
    title: "Lịch sử giá",
    subtitle: "Theo dõi lịch sử cập nhật giá hàng hóa",
  },
  service: {
    path: privateRoutesName.categories.service,
    title: "Dịch vụ",
    subtitle: "Quản lý dịch vụ",
  },
  user: {
    path: privateRoutesName.categories.user,
    title: "Người dùng",
    subtitle: "Quản lý người dùng hệ thống",
  },
  permission: {
    path: privateRoutesName.categories.permission,
    title: "Phân quyền",
    subtitle: "Quản lý phân quyền hệ thống",
  },
  attribute: {
    path: privateRoutesName.categories.attribute,
    title: "Thuộc tính",
    subtitle: "Quản lý thuộc tính hệ thống",
  },

  // System
  notification: {
    path: privateRoutesName.system.notification,
    title: "Thông báo",
    subtitle: "Quản lý thông báo hệ thống",
  },
  deviceWhitelist: {
    path: privateRoutesName.system.deviceWhitelist,
    title: "Thiết bị đăng nhập",
    subtitle: "Quản lý thiết bị đăng nhập",
  },
  operationLog: {
    path: privateRoutesName.system.operationLog,
    title: "Nhật ký hoạt động",
    subtitle: "Xem nhật ký hoạt động hệ thống",
  },
};
