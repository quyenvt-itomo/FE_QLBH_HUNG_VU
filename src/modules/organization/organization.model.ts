import { Entity } from "@/shared/base/entity";
import { ApiRequestQuery } from "@/shared/interfaces/api";
import { Address } from "@/shared/interfaces/common";
import { File } from "@/shared/interfaces/file";
import { Role } from "../role";
import { Attribute } from "../attribute";
import { User } from "../user";
import { OrganizationTypeEnum } from "./organization.enum";
import { Employee, EmployeeSnapshot } from "../employee";

export interface OrganizationQuery extends ApiRequestQuery {
  moreQuery?: any;
  types?: OrganizationTypeEnum[];
  getAll?: boolean;
  parentId?: string;
}

export interface TeamOperation extends Entity {
  teamId: string;
  team: Organization;

  operationId: string;
  operation: Attribute;
}

export interface StoreUser extends Entity {
  storeId: string;
  company: Organization;

  userId: string;
  user: User;

  employeeId: string | null;
  employeeSnapshot: EmployeeSnapshot | null;
  employee: Employee;

  roleId: string | null;
  role: Role;
}

export interface OrganizationSnapshot {
  id: string;
  name: string;
  code: string;
  type: OrganizationTypeEnum;
}

export interface Organization extends Entity {
  parentId?: string;
  parent?: Organization;

  code: string;
  name: string;

  type: OrganizationTypeEnum;

  logo: File[];

  managerId?: string; // Trưởng đơn vị
  manager?: Employee;

  email?: string;
  phone?: string;

  // Dành cho tổng công ty và công ty
  taxCode?: string;
  address?: Address;

  // Dành cho chi nhánh, phòng ban, nhà máy, team
  industry?: string; // Chuyên ngành
  responsibility?: string; // Chức năng, nhiệm vụ chính

  establishment?: string; // Cơ sở thành lập

  children: Organization[];

  operations: TeamOperation[];

  companyUsers: StoreUser[];

  roles: Role[];
}

export interface SortPayload {
  id: string;
  sortOrder: number;
}

export interface EntityWithStore extends Entity {
  storeId: string;
  company: Organization;
}
