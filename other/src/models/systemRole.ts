/**
 * @file role_model.ts
 * @description Định nghĩa kiểu dữ liệu cho vai trò (role) và quyền truy cập (permission) trong hệ thống.
 * Bao gồm:
 * - Các loại quyền có thể cấp (create, read, update, approve, delete)
 * - Các module được phân quyền (purchase_order, contract, payment)
 * - Kiểu dữ liệu ISystemRole chứa thông tin vai trò và các quyền tương ứng theo module
 * - Kiểu SystemRoleQuery để truy vấn danh sách vai trò
 * - Kiểu SystemRoleResponse để định dạng phản hồi API
 */

import { PermissionStructure } from "../constants/permission";
import { ApiRequestQuery, ApiResponse } from "./base/api";

export interface SystemRoleQuery extends ApiRequestQuery {}

export interface ISystemRole {
  id: string;
  name: string;
  permissions: PermissionStructure;
}

export interface SystemRoleResponse extends ApiResponse {}
