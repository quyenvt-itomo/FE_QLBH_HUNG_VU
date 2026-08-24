/**
 * Danh sách module mà chi nhánh thường (isHeadquarters = false) chỉ được xem.
 * Logic: BE sẽ trả _actions.update.can / _actions.delete.can = false cho user BRANCH
 * ở chi nhánh thường với các module này. FE dùng để ẩn/disable button.
 */
export const ReadOnlyInBranchModules = [
  "product", // Hàng hóa
  "branch", // Chi nhánh
  "priceList", // Bảng giá
  "billOfMaterial", // BOM
  "attribute", // Danh mục (loại global)
] as const;

export type ReadOnlyInBranchModule = (typeof ReadOnlyInBranchModules)[number];

/**
 * Permission map theo BE docs.
 * Mỗi module có các action: read, create, update, delete, và 1 số action đặc biệt
 * (confirm, cancel, approve, fulfill...).
 */
export const ModulePermissions = {
  // System
  user: ["read", "create", "update", "delete", "resetPassword"] as const,
  role: ["read", "create", "update", "delete"] as const,
  branch: ["read", "create", "update", "delete"] as const,
  company: ["read", "update"] as const,
  employee: ["read", "create", "update", "delete"] as const,
  attribute: ["read", "create", "update", "delete"] as const,

  // Hàng hóa
  product: ["read", "create", "update", "delete"] as const,
  billOfMaterial: ["read", "create", "update", "delete"] as const,
  priceList: ["read", "create", "update", "delete"] as const,

  // Đối tác
  partner: ["read", "create", "update", "delete"] as const,

  // Kho
  warehouse: ["read", "create", "update", "delete"] as const,
  stockDocument: [
    "read",
    "create",
    "update",
    "delete",
    "confirm",
    "cancel",
    "confirmImport",
    "confirmExport",
  ] as const,
  warehouseTransfer: ["read", "create", "update", "confirm"] as const,
  inventoryAdjustment: ["read", "create", "update", "confirm"] as const,
  inventoryLot: ["read"] as const,
  inventoryReport: ["read"] as const,

  // Mua hàng
  purchase: ["read", "create", "update", "delete", "confirm", "cancel"] as const,
  purchaseQuotation: ["read", "create", "update"] as const,

  // Bán hàng
  order: ["read", "create", "update", "delete", "confirm", "cancel", "fulfill", "close"] as const,
  quotation: ["read", "create", "update"] as const,

  // Sản xuất
  production: [
    "read",
    "create",
    "update",
    "delete",
    "confirm",
    "start",
    "complete",
    "cancel",
  ] as const,

  // Tài chính
  fund: ["read", "update"] as const,
  fundTransfer: ["read", "create", "confirm"] as const,
  incomeExpense: ["read", "create", "update", "delete", "confirm"] as const,
  partnerDebt: ["read", "update", "adjust"] as const,

  // Báo cáo
  report: ["view", "export", "dashboard"] as const,

  // Notification
  notification: ["read"] as const,

  // Excel
  excel: ["import", "export"] as const,

  // Audit
  operationLog: ["read"] as const,
} as const;

export type ModuleKey = keyof typeof ModulePermissions;
export type PermissionAction<T extends ModuleKey> = (typeof ModulePermissions)[T][number];

/** Build tên permission đầy đủ: `product.read`, `order.confirm`, ... */
export const buildPermission = <T extends ModuleKey>(
  module: T,
  action: PermissionAction<T>,
): string => `${module}.${action}`;

/** Permission wildcard (super admin) */
export const PERMISSION_WILDCARD = "*";

/**
 * Default roles theo BE docs.
 * BE sẽ seed các role này khi khởi tạo Store.
 */
export const DefaultRoleCodes = {
  SUPER: "SUPER",
  ADMIN: "ADMIN",
  MANAGER: "MANAGER",
  SALES: "SALES",
  WAREHOUSE: "WAREHOUSE",
  PRODUCTION: "PRODUCTION",
  ACCOUNTANT: "ACCOUNTANT",
  VIEWER: "VIEWER",
} as const;
