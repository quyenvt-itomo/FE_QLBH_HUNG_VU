/**
 * =========================
 * MODULE DEFINITIONS — Đồng bộ với BE: permission.middleware.ts
 * =========================
 */
export const MODULES = [
  // ===== Reports (read-only) =====
  "report",
  "fundReport",
  "fundBalanceReport",
  "inventoryReport",
  "partnerDebtReport",
  "vatDebtReport",
  "commissionDebtReport",
  "purchaseCostReport",
  "salesCostReport",
  "productionOutputReport",

  // ===== Mua hàng =====
  "purchaseRequisition",
  "purchaseQuotation",
  "purchase",

  // ==== Bán hàng =====
  "quotationRequest",
  "quotation",
  "order",

  // Kế hoạch vận chuyển
  "shippingPlan",

  // ===== Kế toán =====
  "paymentRequest",
  "incomeExpense",
  "fund",
  "fundAdjustment",
  "fundTransfer",
  "invoice",
  "loan",
  "termDeposit",
  "asset",
  "partnerDebtAdjustment",
  "partnerDebtOffset",
  "vatDebtAdjustment",
  "commissionDebtAdjustment",

  // ===== Kho =====
  "warehouse",
  "warehouseTransfer",
  "inventoryAdjustment",
  "stockDocument",
  "gateLog",

  // ===== Sản xuất =====
  "bom",
  "production",
  "materialBugget",
  "meshSheet",

  // ===== Kho mở rộng =====
  "inventoryConversion",

  // ===== Nhân sự =====
  "employee",
  "payroll",

  // ===== Thiết lập tổ chức =====
  "organization",
  "jobPosition",
  "paymentTerm",

  // ===== Core entities / danh mục =====
  "partner",
  "product",
  "priceHistory",
  "service",
  "user",
  "role",
  "category",

  // ===== An toàn & bảo mật =====
  "log",
  "loginApproval",
] as const;

export type Module = (typeof MODULES)[number];

/**
 * =========================
 * PERMISSIONS
 * =========================
 */
export const PERMISSIONS = [
  "create",
  "read",
  "readAll",
  "update",
  "delete",
  "approve",
  "customerApprove",
  "confirmExport",
  "confirmImport",
  "complete",
  "enter",
  "exit",
  "link",
] as const;
export type Permission = (typeof PERMISSIONS)[number];

export type PermissionStructure = {
  [key in Module]?: Permission[];
};

/**
 * Các module chỉ có quyền read theo từng context
 */
export const ReadOnlyModules: Module[] = [
  "report",
  "fundReport",
  "inventoryReport",
  "partnerDebtReport",
  "vatDebtReport",
  "purchaseCostReport",
  "salesCostReport",
  "productionOutputReport",
  "materialBugget",
  "priceHistory",

  "quotationRequest",
  "purchaseQuotation",
  "order",
];

/**
 * Các module cần quyền readAll để xem toàn bộ dữ liệu
 */
export const ReadAllModules: Module[] = [
  "quotation",
  "order",
  "purchaseQuotation",
  "purchase",

  "partner",
];

/**
 * Các module cần quyền approve
 */
export const ApprovalModules: Module[] = [
  "quotationRequest",
  "quotation",
  "order",
  "purchaseRequisition",
  "purchaseQuotation",
  "purchase",
  "shippingPlan",
  "paymentRequest",
];

/**
 * Các module đặc biệt
 */
export const CustomerApprovalModules: Module[] = ["quotation"];
export const ConfirmExportModules: Module[] = ["stockDocument"];
export const ConfirmImportModules: Module[] = ["stockDocument"];
export const CompleteModules: Module[] = ["purchase", "order", "production", "stockDocument"];

/**
 * =========================
 * MODULE LABEL MAP
 * =========================
 */
export const moduleMap: Record<Module, string> = {
  // Reports
  report: "Báo cáo tổng quan",
  fundReport: "Báo cáo tồn quỹ",
  fundBalanceReport: "Báo cáo số dư quỹ",
  inventoryReport: "Báo cáo tồn kho",
  partnerDebtReport: "Báo cáo công nợ đối tác",
  vatDebtReport: "Báo cáo thuế VAT",
  commissionDebtReport: "Báo cáo công nợ hoa hồng",
  purchaseCostReport: "Báo cáo chi phí mua hàng",
  salesCostReport: "Báo cáo chi phí bán hàng",
  productionOutputReport: "Báo cáo công khoán",

  // Business
  order: "Đơn hàng",
  quotation: "Báo giá",
  quotationRequest: "Đề nghị báo giá",
  purchaseQuotation: "Báo giá mua",
  purchaseRequisition: "Đề nghị mua vật tư",
  purchase: "Mua hàng",
  shippingPlan: "Kế hoạch giao hàng",

  // Finance
  paymentRequest: "Đề nghị thanh toán",
  incomeExpense: "Thu chi",
  fund: "Danh sách quỹ",
  fundAdjustment: "Điều chỉnh quỹ",
  fundTransfer: "Chuyển quỹ",
  invoice: "Hóa đơn",
  loan: "Khoản vay",
  termDeposit: "Tiền gửi có kỳ hạn",
  asset: "Tài sản cố định",
  partnerDebtAdjustment: "Điều chỉnh công nợ đối tác",
  partnerDebtOffset: "Đối trừ công nợ",
  vatDebtAdjustment: "Điều chỉnh thuế VAT",
  commissionDebtAdjustment: "Điều chỉnh công nợ hoa hồng",

  // Inventory
  warehouse: "Kho hàng",
  warehouseTransfer: "Chuyển kho",
  inventoryAdjustment: "Kiểm kê",
  inventoryConversion: "Chuyển mã",
  stockDocument: "Phiếu xuất nhập kho",
  gateLog: "Nhật ký cổng",

  // Production
  bom: "Định mức NVL",
  production: "Sản xuất",
  materialBugget: "Dự trù vật tư",
  meshSheet: "Thông số lưới thép",

  // HR
  employee: "Nhân sự",
  payroll: "Bảng lương",

  // Organization
  organization: "Cơ cấu tổ chức",
  jobPosition: "Vị trí công việc",
  paymentTerm: "Điều khoản thanh toán",

  // Core
  user: "Người dùng",
  role: "Phân quyền",
  partner: "Đối tác",
  product: "Hàng hóa",
  priceHistory: "Lịch sử giá",
  service: "Dịch vụ",
  category: "Danh mục",

  // Security
  log: "Nhật ký hệ thống",
  loginApproval: "Xác thực đăng nhập",
};

/**
 * =========================
 * PERMISSION LABEL MAP
 * =========================
 */
export const permissionMap: Record<Permission, string> = {
  read: "Xem",
  create: "Thêm",
  update: "Sửa",
  delete: "Xoá",

  // Các quyền đặc thù
  readAll: "Xem tất cả",
  approve: "Duyệt",
  complete: "Hoàn tất",
  customerApprove: "Khách hàng duyệt",
  confirmExport: "Xác nhận xuất kho",
  confirmImport: "Xác nhận nhập kho",

  // Các quyền đặc thù cho gateLog
  enter: "Xe vào",
  exit: "Xe ra",
  link: "Liên kết",
};

/**
 * =========================
 * UI GROUPING
 * =========================
 */
export const role: {
  title: string;
  modules: Module[];
}[] = [
  {
    title: "Báo cáo",
    modules: [
      "report",
      "fundReport",
      "fundBalanceReport",
      "inventoryReport",
      "commissionDebtReport",
      "partnerDebtReport",
      "vatDebtReport",
      "purchaseCostReport",
      "salesCostReport",
      "productionOutputReport",
      "priceHistory",
    ],
  },
  {
    title: "Kinh doanh",
    modules: [
      "order",
      "quotation",
      "quotationRequest",
      "purchaseQuotation",
      "purchaseRequisition",
      "purchase",
      "shippingPlan",
    ],
  },
  {
    title: "Tài chính",
    modules: [
      "paymentRequest",
      "incomeExpense",
      "fund",
      "fundAdjustment",
      "fundTransfer",
      "invoice",
      "loan",
      "termDeposit",
      "asset",
      "partnerDebtAdjustment",
      "partnerDebtOffset",
      "vatDebtAdjustment",
      "commissionDebtAdjustment",
    ],
  },
  {
    title: "Kho",
    modules: [
      "warehouse",
      "warehouseTransfer",
      "inventoryAdjustment",
      "inventoryConversion",
      "stockDocument",
      "gateLog",
    ],
  },
  {
    title: "Sản xuất",
    modules: ["bom", "production", "materialBugget", "meshSheet"],
  },
  {
    title: "Nhân sự",
    modules: ["employee", "payroll"],
  },
  {
    title: "Thiết lập",
    modules: ["organization", "jobPosition", "paymentTerm"],
  },
  {
    title: "Danh mục",
    modules: ["user", "role", "partner", "product", "priceHistory", "service", "category"],
  },
  {
    title: "Hệ thống",
    modules: ["log", "loginApproval"],
  },
];

/**
 * =========================
 * PERMISSION HELPERS
 * =========================
 */
export function getPermissionOptions(
  module: Module,
): { value: Permission; label: string }[] | undefined {
  const readOnly = ReadOnlyModules.includes(module);
  let permissions: Permission[] = readOnly ? ["read"] : ["read", "create", "update", "delete"];

  // Chèn vào ngay sau read
  if (ReadAllModules.includes(module)) permissions.splice(1, 0, "readAll");
  if (ApprovalModules.includes(module)) permissions.push("approve");
  if (CustomerApprovalModules.includes(module)) permissions.push("customerApprove");
  if (ConfirmExportModules.includes(module)) permissions.push("confirmExport");
  if (ConfirmImportModules.includes(module)) permissions.push("confirmImport");
  if (CompleteModules.includes(module)) permissions.push("complete");
  if (module === "gateLog") {
    permissions = ["read", "enter", "exit", "link"];
  }

  return permissions.map((p) => ({
    value: p,
    label: permissionMap[p],
  }));
}
