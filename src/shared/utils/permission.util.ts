import { Module, Permission, PermissionStructure } from "@/shared/constants/permission";
import { UserInfo } from "../interfaces/auth";
import { ActionKey } from "../base/entity";

export const readPermissionFallbackMap: Partial<Record<Module, Module[]>> = {
  product: ["sale", "saleReturn", "purchase", "purchaseReturn", "inventoryAdjustment", "storeTransfer"],
  customer: ["sale", "saleReturn"], supplier: ["purchase", "purchaseReturn"], fund: ["fundTransfer", "fundAdjustment"],
};
export function checkPermission(permissions: PermissionStructure | null, module: Module | string, permission: Permission): boolean {
  if (!permissions) return false;
  const modulePermissions = (permissions as Record<string, Permission[]>)[module] || [];
  if (modulePermissions.includes(permission)) return true;
  if (permission === "read") return (readPermissionFallbackMap[module as Module] || []).some((fallback) => permissions[fallback]?.includes("read") || permissions[fallback]?.includes("create"));
  return false;
}
export const checkModule = (permissions: PermissionStructure | null, module: Module | string): boolean => Boolean((permissions as any)?.[module]?.length);
export const checkAnyModule = (permissions: PermissionStructure | null, modules: (Module | string)[]): boolean => modules.some((module) => checkModule(permissions, module));
export const handleCheckLockAction = (record: any, info: UserInfo | null) => info?.isAdmin ? false : !record || record?.status === "cancel";
export const checkCanPermission = (record: any, actions: ActionKey | ActionKey[], mode: "some" | "every" = "some"): boolean => Array.isArray(actions) ? (mode === "every" ? actions.every((action) => record?._actions?.[action]?.can) : actions.some((action) => record?._actions?.[action]?.can)) : Boolean(record?._actions?.[actions]?.can);
export const checkIsAdmin = (info: UserInfo | null): boolean => info?.username === "admin";
