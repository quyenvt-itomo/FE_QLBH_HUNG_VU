/**
 * @file role_model.ts
 * @description Định nghĩa kiểu dữ liệu cho vai trò (role) và quyền truy cập (permission) trong hệ thống.
 * Bao gồm:
 * - Các loại quyền có thể cấp (create, read, update, approve, delete)
 * - Các module được phân quyền (purchase_order, contract, payment)
 * - Kiểu dữ liệu Role chứa thông tin vai trò và các quyền tương ứng theo module
 * - Kiểu RoleQuery để truy vấn danh sách vai trò
 * - Kiểu RoleResponse để định dạng phản hồi API
 */
import { StoreEntity } from "@/shared/base/entity";
import { Module, PermissionStructure } from "@/shared/constants/permission";
import { ApiRequestQuery } from "@/shared/interfaces/api";

export enum RoleType {
  SYSTEM = "system",
  STORE = "store",
}
export const roleTypeMap: Record<RoleType, string> = {
  [RoleType.SYSTEM]: "Hệ thống",
  [RoleType.STORE]: "Cửa hàng",
};

export interface RoleQuery extends ApiRequestQuery {}

export interface Role extends StoreEntity {
  name: string;
  permissions: PermissionStructure;
  importExcel: Module[];
  exportExcel: Module[];
  userCount?: number;
  type: RoleType;
}
