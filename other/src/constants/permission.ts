/**
 * =========================
 * MODULE DEFINITIONS
 * =========================
 */
export const MODULES = [
  // ===== Reports (read-only) =====
  "report",
  "inventoryReport",
  "debtReport",
  "fundReport",
  "vatReport",
  "loyaltyPointReport",

  // ===== Core entities / danh mục =====
  "user",
  "systemPermission",
  "store",
  "storeUser",
  "permission",

  "product",
  "customer",
  "supplier",
  "fund",

  // ===== Attribute / master data =====
  "position",
  "category",
  "unit",
  "productType",

  // ===== Business / giao dịch =====
  "saleOrder",
  "shift",
  "purchaseOrder",
  "saleReturn",
  "purchaseReturn",

  // ===== Finance =====
  "incomeExpense",
  "fundTransfer",
  "fundAdjustment",

  // ===== Inventory =====
  "inventoryAdjustment",
  "storeTransfer",

  // ===== Debt =====
  "debtAdjustment",
  "debtOffset",

  // ===== VAT =====
  "vatAdjustment",

  // ===== HR =====
  "employee",
] as const;

export type Module = (typeof MODULES)[number];

/**
 * =========================
 * PERMISSIONS
 * =========================
 */
export const PERMISSIONS = ["create", "read", "update", "delete"] as const;
export type Permission = (typeof PERMISSIONS)[number];

export type PermissionStructure = {
  [key in Module]?: Permission[];
};

/**
 * =========================
 * PERMISSION CONTEXT
 * =========================
 */
export type PermissionContext = "store" | "system";

/**
 * Các module chỉ có quyền read theo từng context
 */
export const ReadOnlyModulesByContext: Record<PermissionContext, Module[]> = {
  store: [
    // Core
    "user",
    "store",
    // "product",
    "supplier",

    // Attribute
    // "position",
    // "category",
    // "unit",
    // "productType",

    // Reports
    "report",
    "inventoryReport",
    "debtReport",
    "vatReport",
    "loyaltyPointReport",
  ],

  system: [
    // Business
    "saleOrder",
    "purchaseOrder",
    "saleReturn",
    "purchaseReturn",
    "incomeExpense",
    "shift",

    // Reports
    "report",
    "fundReport",
    "inventoryReport",
    "debtReport",
    "vatReport",
    "loyaltyPointReport",

    // Adjustment
    "inventoryAdjustment",
    "debtAdjustment",
    "vatAdjustment",

    // HR / Permission
    // "employee",
    "permission",
  ],
};

/**
 * Các module KHÔNG tồn tại trong store
 */
export const NotInStoreModules: Module[] = ["systemPermission", "storeTransfer"];

/**
 * =========================
 * MODULE LABEL MAP
 * =========================
 */
export const moduleMap: Record<Module, string> = {
  // Reports
  report: "Báo cáo tổng quan",
  inventoryReport: "Báo cáo tồn kho",
  debtReport: "Báo cáo công nợ",
  fundReport: "Báo cáo tồn quỹ",
  vatReport: "Báo cáo thuế VAT",
  loyaltyPointReport: "Báo cáo tích điểm",

  // Business
  purchaseOrder: "Đơn nhập hàng",
  saleOrder: "Đơn bán hàng",
  purchaseReturn: "Trả hàng NCC",
  saleReturn: "KH trả hàng",
  shift: "Ca làm việc",

  // Finance
  fund: "Danh sách quỹ",
  fundAdjustment: "Điều chỉnh quỹ",
  fundTransfer: "Chuyển quỹ",
  incomeExpense: "Thu chi",

  // Inventory
  inventoryAdjustment: "Điều chỉnh tồn kho",
  storeTransfer: "Chuyển kho",

  // Debt
  debtAdjustment: "Điều chỉnh công nợ",
  debtOffset: "Đối trừ công nợ",

  // VAT
  vatAdjustment: "Điều chỉnh thuế VAT",

  // HR
  employee: "Danh sách nhân sự",

  // Core / config
  user: "Danh sách người dùng",
  storeUser: "Người dùng cửa hàng",
  permission: "Phân quyền cửa hàng",
  systemPermission: "Phân quyền hệ thống",
  store: "Danh sách cửa hàng",

  // Master data
  product: "Danh sách sản phẩm",
  customer: "Danh sách khách hàng",
  supplier: "Danh sách NCC",
  position: "Vị trí công việc",
  category: "Danh mục",
  unit: "Đơn vị tính",
  productType: "Phân loại sản phẩm",
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
    modules: ["report", "inventoryReport", "debtReport", "vatReport", "fundReport"],
  },
  {
    title: "Kinh doanh",
    modules: ["purchaseOrder", "saleOrder", "purchaseReturn", "saleReturn", "shift"],
  },
  {
    title: "Tài chính",
    modules: [
      "fund",
      "fundAdjustment",
      "fundTransfer",
      "incomeExpense",
      "debtOffset",
      "vatAdjustment",
    ],
  },
  {
    title: "Xuất nhập tồn kho",
    modules: ["product", "inventoryAdjustment", "storeTransfer"],
  },
  {
    title: "Nhân sự",
    modules: ["employee"],
  },
  {
    title: "Danh mục",
    modules: [
      "customer",
      "supplier",
      "storeUser",
      "permission",
      "category",
      "productType",
      "unit",
      "position",
      "store",
      "user",
      "systemPermission",
    ],
  },
];

/**
 * =========================
 * PERMISSION HELPERS
 * =========================
 */
export function getPermissionOptionsByContext(
  module: Module,
  context: PermissionContext,
): { value: Permission; label: string }[] | undefined {
  if (context === "store" && NotInStoreModules.includes(module)) return undefined;

  const readOnly = ReadOnlyModulesByContext[context].includes(module);
  const permissions: Permission[] = readOnly ? ["read"] : [...PERMISSIONS];

  return permissions.map((p) => ({
    value: p,
    label: permissionMap[p],
  }));
}
