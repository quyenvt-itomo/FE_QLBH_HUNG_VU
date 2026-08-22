import { Module, Permission, PermissionStructure } from "../constants/permission";
import { UserInfo } from "../models/base/auth";

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
  return !!(permissions as any)?.[module]?.includes(permission);
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
  if (info?.username === "admin") return false;
  if (!record) return true;
  return record?.status == "cancel";
};
