/**
 * @file role_model.ts
 * @description Định nghĩa kiểu dữ liệu cho vai trò (role) và quyền truy cập (permission) trong hệ thống.
 * Bao gồm:
 * - Các loại quyền có thể cấp (create, read, update, approve, delete)
 * - Các module được phân quyền (purchase_order, contract, payment)
 * - Kiểu dữ liệu IRole chứa thông tin vai trò và các quyền tương ứng theo module
 * - Kiểu RoleQuery để truy vấn danh sách vai trò
 * - Kiểu RoleResponse để định dạng phản hồi API
 */

import { PermissionStructure } from "../../constants/permission";
import { ApiRequestQuery, ApiResponse } from "../base/api";
import { IEntityWithStore } from "./entityWithStore";

export interface RoleQuery extends ApiRequestQuery {
  storeId?: string;
}

export interface IRole extends IEntityWithStore {
  name: string;
  permissions: PermissionStructure;
}

export interface RoleResponse extends ApiResponse {}
