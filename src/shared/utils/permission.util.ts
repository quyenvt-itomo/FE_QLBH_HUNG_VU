import { Module, Permission, PermissionStructure } from "@/shared/constants/permission";
import { UserInfo } from "../interfaces/auth";
import { ActionKey } from "../base/entity";
export const readPermissionFallbackMap: Partial<Record<Module, Module[]>> = {
  product: [
    "quotation",
    "order",
    "purchaseRequisition",
    "purchase",

    "stockDocument",
    "warehouseTransfer",
    "inventoryConversion",
    "inventoryAdjustment",

    "bom",
    "production",
    "meshSheet",
  ],
  service: ["quotation", "order"],
  fund: ["incomeExpense", "fundTransfer", "fundAdjustment"],
  partner: ["quotation", "order", "purchase", "invoice", "incomeExpense", "paymentRequest"],
  category: ["product", "partner", "incomeExpense"],
  warehouse: ["stockDocument", "inventoryAdjustment", "inventoryConversion", "warehouseTransfer"],
  employee: [
    "quotation",
    "order",
    "purchaseRequisition",
    "purchase",
    "incomeExpense",
    "warehouse",
    "stockDocument",
    "warehouseTransfer",
    "gateLog",
    "production",
    "payroll",

    "organization",
  ],
};

const checkPermissionFallback = (
  permissions?: Partial<PermissionStructure>,
  module?: Module,
): boolean => {
  if (!module || !permissions) return true;

  const fallbackModules = readPermissionFallbackMap[module] || [];

  for (const fallbackModule of fallbackModules) {
    if (permissions[fallbackModule]?.includes("create")) {
      return true;
    }
  }

  return false;
};

/**
 * Kiểm tra xem user có quyền cụ thể nào đó không
 * @param permissions Danh sách quyền của user
 * @param requiredPermissions Danh sách quyền cần kiểm tra
 * @returns true nếu user có tất cả các quyền cần thiết, ngược lại false
 */

export function checkPermission(
  permissions: PermissionStructure | null,
  module: Module,
  permission: Permission,
): boolean {
  if (!permissions) return false;

  const modulePermissions = permissions[module] || [];
  if (modulePermissions.includes(permission)) {
    return true;
  }

  if (permission === "read") {
    return checkPermissionFallback(permissions, module);
  }

  return false;
}

export const checkModule = (permissions: PermissionStructure | null, module: Module): boolean => {
  return !!(permissions as any)?.[module] && (permissions as any)[module]?.length > 0;
};

export const checkAnyModule = (
  permissions: PermissionStructure | null,
  modules: Module[],
): boolean => {
  return modules.some((m) => checkModule(permissions, m));
};

export const handleCheckLockAction = (record: any, info: UserInfo | null) => {
  if (info?.isAdmin) return false;
  if (!record) return true;
  return record?.status == "cancel";
};

/**
 * Alias của checkPermission - kiểm tra xem user có quyền cụ thể không
 */

export const checkCanPermission = (
  record: any,
  actions: ActionKey | ActionKey[],
  mode: "some" | "every" = "some",
): boolean => {
  if (!Array.isArray(actions)) {
    return !!record?._actions?.[actions]?.can;
  }

  return mode === "every"
    ? actions.every((action) => record?._actions?.[action]?.can)
    : actions.some((action) => record?._actions?.[action]?.can);
};

export const checkIsAdmin = (info: UserInfo | null): boolean => {
  return info?.username === "admin";
};
